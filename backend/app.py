
from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from auth_routes import auth_bp
from views_routes import views_bp
from scan_prescription import scan_bp
import config

app = Flask(__name__, static_folder="frontend/build", static_url_path="")
app.config["JWT_SECRET_KEY"] = config.JWT_SECRET_KEY
jwt = JWTManager(app)


CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

@app.route("/")
def serve_react():
    return send_from_directory("frontend/build", "index.html")

@app.route("/<path:path>")
def serve_static_files(path):
    return send_from_directory("frontend/build", path)

app.register_blueprint(auth_bp)
app.register_blueprint(views_bp)
app.register_blueprint(scan_bp)

if __name__ == "__main__":
    app.run(debug=True)
