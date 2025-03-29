from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jti
from models import users_collection, prescription_collection
from auth_routes import blacklisted_tokens
import os
# import pytesseract
from PIL import Image
import re

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

@views_bp.route('/add-prescription', methods=['POST'])
@jwt_required()
def add_prescription():
    data = request.json
    current_user_email = get_jwt_identity()

    user = users_collection.find_one({"email": current_user_email})
    if not user:
        return jsonify({"error": "User not found"}), 404

    user_id = str(user["_id"])  # Convert user ID to string

    new_prescription = {
        "user_id": user_id,
        "name": data.get("name"),
        "duration": int(data.get("duration")),
        "frequency_per_day": int(data.get("frequency_per_day")),
        "last_taken": data.get("last_taken")
    }

    prescription_collection.insert_one(new_prescription)

    return jsonify({"message": "Prescription added successfully"}), 201

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