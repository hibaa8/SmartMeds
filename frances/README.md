# Smart Med Assistant

A medication management system with AI prescription scanning, health assistant, and travel planning features.

## Project Structure

### Frontend (React + TypeScript)
- Located in the `client` directory
- Built with React, TypeScript, and Tailwind CSS
- Uses shadcn/ui components for the UI
- Includes features:
  - Medication management
  - AI health assistant
  - Travel planning
  - Prescription scanning with OCR

### Backend (Python + Flask)
- Located in the `backend` directory
- Built with Flask, MongoDB, and Google Cloud APIs
- Features:
  - User authentication
  - Prescription OCR scanning with Google Vision
  - AI-powered responses with Google Gemini
  - Medication storage and retrieval

## Setup Instructions

### Frontend
```
cd client
npm install
npm run dev
```

### Backend
```
cd backend
pip install -r requirements.txt
python app.py
```

## Features

1. **User Authentication** - Secure login/signup with profile management
2. **Medication Tracking** - Add, view, and manage medications
3. **OCR Prescription Scanning** - Convert prescription images to digital records
4. **AI Health Assistant** - Get answers to health-related questions
5. **Travel Planning** - Check medication regulations for different countries