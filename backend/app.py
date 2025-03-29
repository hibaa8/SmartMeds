# from flask import Flask, jsonify
# from flask_pymongo import PyMongo
# import os
# from dotenv import load_dotenv
# from flask import current_app, g
# from pymongo import MongoClient
# from flask_cors import CORS

# mongo = PyMongo()
# load_dotenv()

# def get_db():
#     db = getattr(g, "_database", None)
#     if db is None:
#         db = g._database = PyMongo(current_app).db
#     return db

# app = Flask(__name__)
# # CORS(app) 

# @app.route("/members")
# def init():
#     return jsonify({"members":["members"]})


# if __name__ == "__main__":
#     app.run(debug=True)

from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from auth_routes import auth_bp
from views_routes import views_bp
import config

app = Flask(__name__, static_folder="frontend/build", static_url_path="")
app.config["JWT_SECRET_KEY"] = config.JWT_SECRET_KEY
jwt = JWTManager(app)

# CORS(app)
# Allow requests from React frontend
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

# Serve React frontend
@app.route("/")
def serve_react():
    return send_from_directory("frontend/build", "index.html")

@app.route("/<path:path>")
def serve_static_files(path):
    return send_from_directory("frontend/build", path)

app.register_blueprint(auth_bp)
app.register_blueprint(views_bp)

if __name__ == "__main__":
    app.run(debug=True)
