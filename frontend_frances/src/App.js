import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import CompleteAccountPage from "./pages/CompleteAccountPage"
import DashboardLayout from "./layouts/DashboardLayout"
import HomePage from "./pages/HomePage"
import AddMedicationPage from "./pages/AddMedicationPage"
import SuccessPage from "./pages/SuccessPage"
import WarningPage from "./pages/WarningPage"
import ChatbotPage from "./pages/ChatbotPage"
import TravelPage from "./pages/TravelPage"
import ProfilePage from "./pages/ProfilePage"

// Auth context for managing user authentication
import { AuthProvider } from "./contexts/AuthContext"

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/complete-account" element={<CompleteAccountPage />} />

          {/* Protected routes with dashboard layout */}
          <Route path="/" element={<DashboardLayout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/home/add-medication" element={<AddMedicationPage />} />
            <Route path="/home/add-medication/success" element={<SuccessPage />} />
            <Route path="/home/add-medication/warning" element={<WarningPage />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
            <Route path="/travel" element={<TravelPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App

