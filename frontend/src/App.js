import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import Dashboard from "./Dashboard";
import MedicalHistory from "./MedicalHistory";
import Navbar from "./components/Navbar";
import LandingPage from "./LandingPage";
import AddPrescription from "./AddPrescription"; // Import the new page
import ScanPrescription from "./ScanPrescription"; // Import the new page

import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider

function App() {
  const [auth, setAuth] = useState(!!localStorage.getItem("token"));

  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Navbar component */}
        <Navbar />
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login setAuth={setAuth} />} />
            <Route path="/dashboard" element={<Dashboard auth={auth} setAuth={setAuth} />} />
            <Route path="/medical-history" element={<MedicalHistory />} />
            <Route path="/add-prescription" element={<AddPrescription />} />
            <Route path="/scan-prescription" element={<ScanPrescription />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
