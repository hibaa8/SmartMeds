import os
import json
import traceback
import google.generativeai as genai
from google.cloud import vision
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import os
load_dotenv()

scan_bp = Blueprint("scan", __name__)

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.getenv("GOOGLE_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_KEY")
genai.configure(api_key=GEMINI_API_KEY)

def extract_text_from_image(image_path):
    client = vision.ImageAnnotatorClient()

    with open(image_path, "rb") as image_file:
        content = image_file.read()

    image = vision.Image(content=content)
    response = client.text_detection(image=image)

    if response.error.message:
        raise Exception(f"Google Vision API Error: {response.error.message}")

    extracted_text = response.text_annotations[0].description if response.text_annotations else ""
    return extracted_text

def clean_text_with_gemini(ocr_text):
    prompt = f"""
    Extract structured prescription details from the following OCR text. Ignore irrelevant text like image credits.

    OCR Text:
    {ocr_text}

    Return a JSON object with these fields:
    - name: (Medication name, capitalize properly)
    - dosage: (Just strength, e.g., "500 MG", remove words like "TABLET")
    - frequency: (How often to take it, e.g., "Twice daily")
    - quantity: (Total count, e.g., "30")
    - refills: (Remaining refills, e.g., "2" or "0" if none)
    - days: (Calculate how many days the user needs to take this medication: Days = Quantity / Frequency per day)

    Ensure the response is a valid JSON object and follows this format:

    {{
      "name": "Amoxicillin",
      "dosage": "500 MG",
      "frequency": "Twice daily",
      "quantity": "30",
      "refills": "2",
      "days": "15"
    }}
    """

    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(prompt)

        print("\n🔹 Raw LLM Response:\n", response.text)
        structured_data = response.text.strip("```json").strip("```").strip() 
        structured_data = json.loads(structured_data)
        if "dosage" in structured_data:
            structured_data["dosage"] = structured_data["dosage"].replace("TABLET", "").strip()

        return structured_data

    except json.JSONDecodeError:
        return {"error": "Gemini returned non-JSON data."}
    except Exception as e:
        print("\n🔥 Gemini API Error:", traceback.format_exc()) 
        return {"error": f"Gemini API Error: {str(e)}"}

@scan_bp.route('/scan-prescription', methods=['POST'])
@jwt_required()
def scan_prescription():
    """Handles prescription scanning, extracts details, and sends to frontend."""
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image = request.files['image']
    if image.filename == '':
        return jsonify({"error": "No selected file"}), 400

    temp_path = f"temp_{image.filename}"
    image.save(temp_path)

    try:

        extracted_text = extract_text_from_image(temp_path)
        os.remove(temp_path)

        print("\n📌 Extracted Text from Image:\n", extracted_text)

       
        structured_data = clean_text_with_gemini(extracted_text)

        if "error" in structured_data:
            return jsonify({"error": structured_data["error"]}), 500

        return jsonify({"success": True, "data": structured_data}), 200

    except Exception as e:
        print("\n ERROR LOG:", traceback.format_exc())
        return jsonify({"error": f"Server error: {str(e)}"}), 500
