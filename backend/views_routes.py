from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jti
from models import users_collection
from auth_routes import blacklisted_tokens

views_bp = Blueprint("views", __name__)

@views_bp.route('/dashboard', methods=['GET'])
@jwt_required()
# def dashboard():
#     jti = get_jti(get_jwt_identity())
#     if jti in blacklisted_tokens:
#         return jsonify({"error": "Invalid token, please log in again"}), 401

#     current_user = get_jwt_identity()
#     return jsonify({"message": f"Welcome {current_user}!"})
def dashboard():
    current_user = get_jwt_identity()
    if not current_user:
        return jsonify({"error": "User not authenticated"}), 401

    return jsonify({"message": f"Welcome {current_user}!"}), 200


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