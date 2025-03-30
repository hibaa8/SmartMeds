import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import cors from "cors";

// Add interface to extend Request type to include file property
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}
import { storage } from "./storage";

// Setup multer for file uploads
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure CORS
  app.use(cors({
    origin: 'http://localhost:5000',
    credentials: true
  }));

  // API routes that connect to the Python/Flask backend
  app.get('/api/dashboard', (req, res) => {
    // This would connect to the Flask backend 'dashboard' endpoint
    // Proxy the request to the Flask backend
    // For now, we're using a placeholder response
    res.json({ 
      message: "Welcome user@example.com!", 
      prescriptions: [] 
    });
  });

  app.post('/api/scan-prescription', upload.single('image'), (req: MulterRequest, res) => {
    // Forward the image to Flask 'scan_prescription' endpoint
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    // In a real implementation, this would send the file to the Flask backend:
    // const formData = new FormData();
    // formData.append('image', fs.createReadStream(req.file.path));
    // const response = await fetch('http://flask-backend:5000/scan_prescription', {
    //   method: 'POST',
    //   body: formData
    // });
    // const data = await response.json();
    // res.json(data);

    // For demonstration, return a simulated response
    res.json({ 
      success: true, 
      data: {
        name: "Teparalon",
        dosage: "40 MG",
        frequency: "Twice daily",
        quantity: "60",
        refills: "2",
        days: "30"
      }
    });
  });

  app.get('/api/get-prescriptions', (req, res) => {
    // Would connect to the Flask 'get_prescriptions' endpoint
    // Proxy the request to the Flask backend
    // For now using placeholder data
    res.json({
      prescriptions: [
        {
          id: "1",
          name: "Teparalon",
          dosage: "40 MG",
          frequency: "Twice daily",
          quantity: 60,
          days: 30,
          last_taken: "2023-05-14",
          refills: 2
        },
        {
          id: "2",
          name: "Amoxicillin",
          dosage: "500 MG",
          frequency: "3 times daily",
          quantity: 30,
          days: 10,
          last_taken: "2023-05-15",
          refills: 0
        }
      ]
    });
  });

  app.post('/api/add-prescription', (req, res) => {
    // Would connect to the Flask 'add_prescription' endpoint
    // Proxy the request with the medication data to the Flask backend
    // For example:
    // const response = await fetch('http://flask-backend:5000/add_prescription', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(req.body)
    // });
    // const data = await response.json();
    // res.status(201).json(data);

    // For demonstration, return a simulated response
    res.status(201).json({ 
      success: true, 
      message: "Prescription added successfully!" 
    });
  });

  // Authentication routes
  app.post('/api/login', (req, res) => {
    // Would connect to the Flask 'login' endpoint
    // Proxy the authentication request to the Flask backend
    // For example:
    // const response = await fetch('http://flask-backend:5000/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(req.body)
    // });
    // const data = await response.json();
    // res.json(data);

    // For demonstration, return a simulated response
    res.json({ 
      token: "sample_jwt_token", 
      user: { 
        name: "John Doe", 
        email: req.body.email 
      } 
    });
  });

  app.post('/api/signup', (req, res) => {
    // Would connect to the Flask 'signup' endpoint
    // Proxy the registration request to the Flask backend
    res.status(201).json({ 
      message: "User registered successfully",
      token: "sample_jwt_token",
      user: { 
        name: req.body.name, 
        email: req.body.email 
      }
    });
  });

  app.post('/api/logout', (req, res) => {
    // Would connect to the Flask 'logout' endpoint
    // Proxy the logout request to the Flask backend
    res.status(200).json({ 
      message: "Successfully logged out" 
    });
  });

  app.get('/api/is_logged_in', (req, res) => {
    // Would connect to the Flask 'is_logged_in' endpoint
    // Proxy the authentication check to the Flask backend
    res.status(200).json({
      status: "User is authenticated"
    });
  });

  app.post('/api/update_medical_history', (req, res) => {
    // Would connect to the Flask 'update_medical_history' endpoint
    // Proxy the medical history update to the Flask backend
    res.json({ 
      message: "Medical history updated successfully" 
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
