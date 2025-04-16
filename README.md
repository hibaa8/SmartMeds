### Smart Med Assistant

Overview

Smart Med Assistant is an AI-powered medication management system that helps patients track their prescriptions, monitor doses, and receive reminders to ensure adherence to treatment plans. Users can scan prescriptions, manage their medication schedules, and receive notifications via Google Calendar.

Features

- Prescription Management: Add, update, and delete prescriptions.

- AI-Powered Label Scanning: Extract prescription details using OCR.

- Gemma Medication Verfication: Gemma checks all the medications you are taking, informs you of possible side effects and ensure the medication is safe to take together.

- Secure User Authentication: Signup and login with JWT authentication.

Features work in progress:
- Google Calendar Integration: Schedule medication reminders.
- Chat bot: Users can interact with a RAG-based chatbot to ask questions regarding their symptoms, over-the-counter medication, and prescriptions.  


Tech Stack
Frontend: React.js, Bootstrap
Backend: Flask, Flask,, MongoDB
APIs & Services: Google Vision API, Gemini, Gemma, Google OAuth, Google Calendar API
OCR: Tesseract.js

Installation & Setup

1. Clone the Repository
```
git clone https://github.com/hibaa8/SmartMeds.git
cd smart-med-assistant
```

2. Backend Setup
```
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt
```

3. Configure Environment Variables
```
#update the config file with the following parameters:
MONGO_URI=your_mongo_uri
JWT_SECRET_KEY=""
GOOGLE_VISION_CREDENTIALS_FILE=link_to_google_vision_key_json_file
```
4. Run the Backend Server
```
flask run
```
5. Frontend Setup
```
cd frontend
npm install
npm start
```

