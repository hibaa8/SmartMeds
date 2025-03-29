import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000 // 10 second timeout
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Network Error: Unable to connect to the server. Please check if the server is running.');
    } else {
      console.error('API Error:', error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);

// This is where the backend API calls would go
// Currently using mock data for development

// Mock data
const mockUsers = [
  {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    medical_conditions: ['Hypertension', 'Diabetes'],
    allergies: ['Penicillin']
  }
];

const mockMedications = [
  {
    id: '1',
    name: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    time: 'Morning',
    reminder: true
  }
];

export const authService = {
  signup: async (userData) => {
    // This would connect to: POST /api/auth/signup
    console.log('Signup would connect to backend:', userData);
    return { message: 'User created successfully', user_id: '1' };
  },

  login: async (credentials) => {
    // This would connect to: POST /api/auth/login
    console.log('Login would connect to backend:', credentials);
    return {
      access_token: 'mock_token',
      user: {
        id: '1',
        name: 'Test User',
        email: credentials.email
      }
    };
  },

  getCurrentUser: async () => {
    // This would connect to: GET /api/auth/me
    console.log('Get current user would connect to backend');
    return mockUsers[0];
  },

  updateProfile: async (userData) => {
    // This would connect to: PUT /api/auth/update-profile
    console.log('Update profile would connect to backend:', userData);
    return { message: 'Profile updated successfully' };
  },

  updateMedicalInfo: async (medicalData) => {
    // This would connect to: PUT /api/auth/update-medical-info
    console.log('Update medical info would connect to backend:', medicalData);
    return { message: 'Medical information updated successfully' };
  },

  logout: () => {
    // This would connect to: POST /api/auth/logout
    console.log('Logout would connect to backend');
    localStorage.removeItem('token');
  }
};

export const medicationService = {
  getMedications: async () => {
    // This would connect to: GET /api/medications
    console.log('Get medications would connect to backend');
    return mockMedications;
  },

  addMedication: async (medicationData) => {
    // This would connect to: POST /api/medications
    console.log('Add medication would connect to backend:', medicationData);
    return { id: '2', ...medicationData };
  },

  updateMedication: async (id, medicationData) => {
    // This would connect to: PUT /api/medications/:id
    console.log('Update medication would connect to backend:', { id, medicationData });
    return { message: 'Medication updated successfully' };
  },

  deleteMedication: async (id) => {
    // This would connect to: DELETE /api/medications/:id
    console.log('Delete medication would connect to backend:', id);
    return { message: 'Medication deleted successfully' };
  },

  checkInteractions: async (medicationName) => {
    // This would connect to: GET /api/medications/check-interactions
    console.log('Check interactions would connect to backend:', medicationName);
    return {
      interactions: [
        {
          medication: medicationName,
          interaction: 'No known interactions found'
        }
      ]
    };
  }
};

export const aiService = {
  sendMessage: async (message) => {
    // This would connect to: POST /api/ai/chat
    console.log('Send message would connect to backend:', message);
    return {
      response: 'This is a mock AI response. The actual backend would process this message and return a relevant response.'
    };
  }
};

export default api; 