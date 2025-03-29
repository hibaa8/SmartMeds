import axios from "axios"

// Create an axios instance with base URL pointing to Flask backend
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle 401 Unauthorized errors (expired token, etc.)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

// API service methods
export const apiService = {
  // Auth endpoints
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  logout: () => api.post("/auth/logout"),

  // User endpoints
  getCurrentUser: () => api.get("/user/profile"),
  updateProfile: (userData) => api.put("/user/profile", userData),
  updateMedicalConditions: (conditions) => api.put("/user/conditions", { conditions }),

  // Medication endpoints
  getMedications: () => api.get("/medications"),
  addMedication: (medicationData) => api.post("/medications", medicationData),
  updateMedication: (id, medicationData) => api.put(`/medications/${id}`, medicationData),
  deleteMedication: (id) => api.delete(`/medications/${id}`),
  takeDose: (id) => api.post(`/medications/${id}/take-dose`),

  // AI Assistant endpoints
  sendMessage: (message) => api.post("/ai/message", { message }),

  // Travel endpoints
  getTravelPlans: () => api.get("/travel/plans"),
  getMedicationRegulations: () => api.get("/travel/regulations"),

  // Generic request methods
  get: (url, config) => api.get(url, config),
  post: (url, data, config) => api.post(url, data, config),
  put: (url, data, config) => api.put(url, data, config),
  delete: (url, config) => api.delete(url, config),
}

