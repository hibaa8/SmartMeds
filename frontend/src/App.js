import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import Dashboard from "./Dashboard";
import MedicalHistory from "./MedicalHistory";
import Navbar from "./components/Navbar";
import LandingPage from "./LandingPage";
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider

function App() {
  const [auth, setAuth] = useState(!!localStorage.getItem("token"));

  // useEffect(() => {
  //   fetch("/members")  // ✅ Explicitly set Flask's URL
  //     .then(res => res.json())
  //     .then(data => {
  //       console.log("Received JSON:", data);
  //       setData(data);
  //     })
  //     .catch(err => console.error("Fetch error:", err));
  // }, []);
  return (
    <AuthProvider>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login setAuth={setAuth} />} />
        <Route path="/dashboard" element={<Dashboard auth={auth} setAuth={setAuth} />} />
        <Route path="/medical-history" element={<MedicalHistory />} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
