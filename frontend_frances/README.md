# Smart Med Assistant

A full-stack application for medication management and health assistance.

## Project Structure

```
smart-med-assistant/
├── frontend/           # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
└── backend/           # Flask backend
    ├── app.py
    ├── requirements.txt
    └── .env
```

## Setup Instructions

### Backend Setup

1. Create a virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up MongoDB:
- Install MongoDB locally or use MongoDB Atlas
- Update the MONGODB_URI in .env file

4. Run the Flask server:
```bash
python app.py
```

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Create a .env file:
```
REACT_APP_API_URL=http://localhost:5000/api
```

3. Run the development server:
```bash
npm start
```

## Features

- User authentication (signup/login)
- Medication management
- AI-powered health assistant
- Travel planning with medical considerations
- Medication interaction checking
- Reminder system

## API Endpoints

### Authentication
- POST /api/auth/signup - Register new user
- POST /api/auth/login - User login

### Medications
- GET /api/medications - Get user's medications
- POST /api/medications - Add new medication
- GET /api/medications/interactions - Check medication interactions

### AI Chat
- POST /api/chat - Send message to AI assistant

## Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- CORS enabled for frontend-backend communication
- Environment variables for sensitive data

## Development

1. Backend development:
```bash
cd backend
flask run --debug
```

2. Frontend development:
```bash
cd frontend
npm start
```

## Production Deployment

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Deploy the backend:
- Set up a production server (e.g., Heroku, DigitalOcean)
- Configure environment variables
- Set up MongoDB Atlas for production
- Deploy using gunicorn or similar

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request 