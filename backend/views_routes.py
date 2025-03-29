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

@views_bp.route("/add-prescription", methods=["POST"])
@jwt_required()
def add_prescription():
    """Adds a new prescription record to MongoDB."""
    try:
        data = request.json
        current_user = get_jwt_identity()  # Get user ID from JWT token

        if not data:
            return jsonify({"error": "No data received"}), 400

        # Ensure required fields exist
        required_fields = ["name", "dosage", "frequency", "quantity", "days", "last_taken"]
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({"error": f"Missing field: {field}"}), 400

        # Create new prescription record
        prescription = {
            "user_id": current_user,  # Link prescription to user
            "name": data["name"],
            "dosage": data["dosage"],
            "frequency": data["frequency"],
            "quantity": int(data["quantity"]),
            "days": int(data["days"]),
            "last_taken": datetime.datetime.strptime(data["last_taken"], "%Y-%m-%d"),
            "refills": int(data["refills"]) if "refills" in data else 0,  # Default to 0 if missing
            "created_at": datetime.datetime.utcnow()
        }

        # ✅ Insert into MongoDB
        prescription_collection.insert_one(prescription)

        return jsonify({"success": True, "message": "Prescription added successfully!"}), 201

    except Exception as e:
        print("\n🔥 ERROR LOG:", str(e))  # ✅ Print exact error
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@views_bp.route("/get-prescriptions", methods=["GET"])
@jwt_required()
def get_prescriptions():
    """Retrieve all prescriptions for the logged-in user, sorted by most recent."""
    try:
        current_user = get_jwt_identity()  # Get logged-in user's ID

        # ✅ Fetch prescriptions for the user & sort by most recent (`created_at`)
        prescriptions = prescription_collection.find(
            {"user_id": current_user}
        ).sort("created_at", -1)  # -1 sorts in descending order (most recent first)

        # ✅ Convert MongoDB documents to JSON
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
                "refills": presc["refills"]
            })

        return jsonify({"success": True, "prescriptions": prescriptions_list}), 200

    except Exception as e:
        print("\n🔥 ERROR LOG:", str(e))  # ✅ Log errors
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

# @views_bp.route("/add-prescription", methods=["POST"])
# @jwt_required()
# def add_prescription():
#     """Adds a new prescription record to MongoDB."""
#     try:
#         data = request.json
#         current_user = get_jwt_identity()  # Get user ID from JWT token

#         if not data:
#             return jsonify({"error": "No data received"}), 400

#         # Ensure required fields exist
#         required_fields = ["name", "dosage", "frequency", "quantity", "days", "last_taken"]
#         for field in required_fields:
#             if field not in data or not data[field]:
#                 return jsonify({"error": f"Missing field: {field}"}), 400

#         # Create new prescription record
#         prescription = {
#             "user_id": current_user,  # Link prescription to user
#             "name": data["name"],
#             "dosage": data["dosage"],
#             "frequency": data["frequency"],
#             "quantity": int(data["quantity"]),
#             "days": int(data["days"]),
#             "last_taken": datetime.datetime.strptime(data["last_taken"], "%Y-%m-%d"),
#             "refills": int(data["refills"]) if "refills" in data else 0,  # Default to 0 if missing
#             "created_at": datetime.datetime.utcnow()
#         }

#         # ✅ Insert into MongoDB
#         prescription_collection.insert_one(prescription)

#         return jsonify({"success": True, "message": "Prescription added successfully!"}), 201

#     except Exception as e:
#         print("\n🔥 ERROR LOG:", str(e))  # ✅ Print exact error
#         return jsonify({"error": f"Server error: {str(e)}"}), 500

# @views_bp.route('/scan-prescription', methods=['POST'])
# @jwt_required()
# def scan_prescription():
#     if 'image' not in request.files:
#         return jsonify({"error": "No image uploaded"}), 400

#     image = request.files['image']
#     if image.filename == '':
#         return jsonify({"error": "No selected file"}), 400

#     # Save image temporarily
#     temp_path = f"temp_{image.filename}"
#     image.save(temp_path)

#     try:
#         # Process image with Tesseract OCR
#         extracted_text = pytesseract.image_to_string(Image.open(temp_path))

#         # Remove temporary image
#         os.remove(temp_path)

#         print("Extracted Text:\n", extracted_text)

#         # Regex to extract relevant details
#         name_match = re.search(r"([A-Z]+[a-z]*(?:\s+[A-Z]+[a-z]*)*)\s+\d+\s*MG", extracted_text)
#         frequency_match = re.search(r"(\d+)[xX]?\s*(per)?\s*day", extracted_text)
#         duration_match = re.search(r"for\s+(\d+)\s+days", extracted_text)
#         qty_match = re.search(r"QTY[:\s]+(\d+)", extracted_text)

#         extracted_data = {
#             "name": name_match.group(1).strip() if name_match else "",
#             "duration": duration_match.group(1) if duration_match else "",
#             "frequency_per_day": frequency_match.group(1) if frequency_match else "",
#             "qty": qty_match.group(1) if qty_match else "",
#         }

#         print("Extracted Data:", extracted_data)  # ✅ Debugging output

#         return jsonify({"success": True, "data": extracted_data}), 200

#     except Exception as e:
#         print("🔥 Error:", str(e))  # ✅ Debugging output
#         return jsonify({"error": f"Error processing image: {str(e)}"}), 500