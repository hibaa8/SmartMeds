from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jti
from models import users_collection, prescription_collection
from auth_routes import blacklisted_tokens
import os
# import pytesseract
from PIL import Image
import re
import datetime
from bson import ObjectId 
import requests
import google.generativeai as genai


genai.configure(api_key=os.getenv(GEMINI_API_KEY))

views_bp = Blueprint("views", __name__)

@views_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    current_user_email = get_jwt_identity()
    user = users_collection.find_one({"email": current_user_email})
    
    if not user:
        return jsonify({"error": "User not found"}), 404

    user_id = str(user["_id"])  # Convert ObjectId to string
    prescriptions = list(prescription_collection.find({"user_id": user_id}))

    # Convert MongoDB objects to JSON serializable format
    for prescription in prescriptions:
        prescription["_id"] = str(prescription["_id"])
        prescription["user_id"] = str(prescription["user_id"])
    
    return jsonify({"message": f"Welcome {current_user_email}!", "prescriptions": prescriptions}), 200


@views_bp.route('/update_medical_history', methods=['POST'])
def update_medical_history():
    data = request.json
    email = data.get("email")
    medical_history = data.get("medical_history")

    if not email or not medical_history:
        return jsonify({"error": "Missing data"}), 400

    result = users_collection.update_one(
        {"email": email},
        {"$set": {"medical_history": medical_history}}
    )

    if result.matched_count == 0:
        return jsonify({"error": "User not found"}), 404

    return jsonify({"message": "Medical history updated successfully"}), 200

###  Function to Call TxGemma for Drug Interaction Analysis
def analyze_drug_interactions(new_prescription, existing_prescriptions):
    """
    Calls TxGemma API to analyze potential drug interactions.
    """
    try:
        # ✅ Prepare request data
        prescription_list = [new_prescription["name"]] + [p["name"] for p in existing_prescriptions]

        prompt = f"""
        Here are the current list of prescriptions the user is taking: 
        {prescription_list}

        Now they will start taking the following medication: {new_prescription}

        In 2 sentences state the following things:
        a. Is it safe for the user to start this medication with their current medications (if they have any)?
        b. Are there any unusual/heavy symptoms they user should be aware of with this medication?
        
        Limit your response to 100 words. Don't include any disclaimers regarding you credibility.
        If there are no major safety conflicts, just say "Your new medication has no conflicts with previous medication!"
        """

        #  Call TxGemma API
        model = genai.GenerativeModel("gemma-3-27b-it")
        response = model.generate_content(prompt).text
        return response
       
    except Exception as e:
        print("\n🔥Gemma API ERROR:", str(e))
        return "⚠ Error analyzing drug interactions."

###  Add Prescription Route (Now Includes Drug Interaction Check)

@views_bp.route("/add-prescription", methods=["POST"])
@jwt_required()
def add_prescription():
    try:
        data = request.json
        current_user = get_jwt_identity()

        if not data:
            return jsonify({"error": "No data received"}), 400

        required_fields = ["name", "dosage", "frequency", "quantity", "days", "last_taken"]
        for field in required_fields:
            if field not in data or data[field] == "":
                return jsonify({"error": f"Missing or empty field: {field}"}), 400  


        try:
            quantity = int(data["quantity"]) if data["quantity"].isdigit() else 0
            days = int(data["days"]) if data["days"].isdigit() else 0
            refills = int(data["refills"]) if "refills" in data and data["refills"].isdigit() else 0
        except ValueError:
            return jsonify({"error": "Invalid number format for quantity, days, or refills"}), 400  

        existing_prescriptions = list(prescription_collection.find({"user_id": current_user}))

        analysis_response = analyze_drug_interactions(data, existing_prescriptions)
        print(f'🔹 Analysis Result: {analysis_response}')

        # **Extract text from AI response**
        ai_analysis = "No analysis available."
        try:
            if analysis_response:
                ai_analysis = analysis_response.strip()
        except Exception as e:
            print("\n🔥 Error extracting AI analysis:", str(e))

        # Create new prescription record
        prescription = {
            "user_id": current_user,  
            "name": data["name"],
            "dosage": data["dosage"],
            "frequency": data["frequency"],
            "quantity": quantity,  
            "days": days,  
            "last_taken": datetime.datetime.strptime(data["last_taken"], "%Y-%m-%d"),
            "refills": refills,  
            "created_at": datetime.datetime.utcnow(),
            "analysis": ai_analysis  
        }

        #  Insert into MongoDB
        prescription_collection.insert_one(prescription)

        return jsonify({"success": True, "message": "Prescription added successfully!", "analysis": ai_analysis}), 201

    except Exception as e:
        print("\n🔥 ERROR LOG:", str(e))
        return jsonify({"error": f"Server error: {str(e)}"}), 500


@views_bp.route("/get-prescriptions", methods=["GET"])
@jwt_required()
def get_prescriptions():
    try:
        current_user = get_jwt_identity()
        prescriptions = prescription_collection.find({"user_id": current_user}).sort("created_at", -1)

        prescriptions_list = []
        for presc in prescriptions:
            prescriptions_list.append({
                "id": str(presc["_id"]),
                "name": presc["name"],
                "dosage": presc["dosage"],
                "frequency": presc["frequency"],
                "quantity": presc["quantity"],
                "days": presc["days"],
                "last_taken": presc["last_taken"].strftime("%Y-%m-%d"),
                "refills": presc["refills"],
                "analysis": presc.get("analysis", "No analysis available")  # ✅ Include analysis
            })

        return jsonify({"success": True, "prescriptions": prescriptions_list}), 200

    except Exception as e:
        print("\n🔥 ERROR LOG:", str(e))
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@views_bp.route("/delete-prescription/<string:prescription_id>", methods=["DELETE"])
@jwt_required()
def delete_prescription(prescription_id):
    """Deletes a prescription from MongoDB."""
    try:
        
        # ✅ Convert prescription_id to ObjectId
        try:
            valid_object_id = ObjectId(prescription_id)
        except:
            return jsonify({"error": "Invalid prescription ID"}), 400

        # ✅ Ensure the prescription exists and belongs to the user
        prescription = prescription_collection.find_one({"_id": valid_object_id})
        if not prescription:
            return jsonify({"error": "Prescription not found or does not belong to user"}), 404

        # ✅ Delete the prescription
        prescription_collection.delete_one({"_id": valid_object_id})

        print("✅ Prescription deleted successfully!")
        return jsonify({"success": True, "message": "Prescription deleted successfully!"}), 200

    except Exception as e:
        print("\n🔥 ERROR LOG:", str(e))
        return jsonify({"error": f"Server error: {str(e)}"}), 500
    
@views_bp.route("/test-auth", methods=["GET"])
@jwt_required()
def test_auth():
    user = get_jwt_identity()
    return jsonify({"message": f"Authenticated as {user}"}), 200


#         return jsonify({"success": True, "data": extracted_data}), 200

#     except Exception as e:
#         print("🔥 Error:", str(e))  # ✅ Debugging output
#         return jsonify({"error": f"Error processing image: {str(e)}"}), 500
