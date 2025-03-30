from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jti
import bcrypt
from models import users_collection

auth_bp = Blueprint("auth", __name__)
blacklisted_tokens = set()

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json
    existing_user = users_collection.find_one({"email": data['email']})
    
    if existing_user:
        return jsonify({"error": "User already exists"}), 400

    hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())

    user_data = {
        "name": data['name'],
        "email": data['email'],
        "password": hashed_password.decode('utf-8'),
        "medical_history": []
    }
    
    users_collection.insert_one(user_data)
    return jsonify({"message": "User registered successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    user = users_collection.find_one({"email": data['email']})
    
    if not user or not bcrypt.checkpw(data['password'].encode('utf-8'), user['password'].encode('utf-8')):
        return jsonify({"error": "Invalid email or password"}), 401

    access_token = create_access_token(identity=user['email'])
    return jsonify({"token": access_token, "user": {"name": user["name"], "email": user["email"]}})


@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """Logs the user out by blacklisting their token and ending their session."""
    try:
        jti = get_jti(get_jwt_identity())  # Get token identifier
        blacklisted_tokens.add(jti)  # Add token to blacklist
        return jsonify({"message": "Successfully logged out"}), 200
    except Exception as e:
        return jsonify({"error": f"Logout failed: {str(e)}"}), 500
    
@auth_bp.route('/is_logged_in', methods=['GET'])
@jwt_required()
def is_logged_in():
    return jsonify({"status": "User is authenticated"})