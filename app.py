#!/usr/bin/env python3
"""
MedTrack - Prescription Management Application

Main Flask application module with MongoDB configuration.
"""
import os
from typing import Any, Dict
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import mongoengine as me

# Load environment variables
load_dotenv()

# Initialize Flask application
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure MongoDB connection
mongodb_uri = os.environ.get("MONGODB_URI", "mongodb://localhost:27017/medtrack")
app.config["MONGODB_HOST"] = mongodb_uri
me.connect(host=mongodb_uri)

# Import routes (to be added later)
# from routes import user_routes, prescription_routes, reminder_routes

@app.route("/")
def health_check() -> Dict[str, str]:
    """Simple health check endpoint."""
    return jsonify({"status": "healthy", "service": "MedTrack API"})

@app.errorhandler(404)
def not_found(e: Any) -> tuple[Dict[str, str], int]:
    """Handle 404 errors."""
    return jsonify({"error": "Resource not found"}), 404

@app.errorhandler(500)
def server_error(e: Any) -> tuple[Dict[str, str], int]:
    """Handle 500 errors."""
    return jsonify({"error": "Internal server error"}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))  # Change default port to 5001
    debug = os.environ.get("FLASK_ENV") == "development"
    app.run(host="0.0.0.0", port=port, debug=debug)
