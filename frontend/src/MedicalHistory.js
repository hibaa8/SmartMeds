import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const MedicalHistory = () => {
  const [medicalHistory, setMedicalHistory] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/update_medical_history", {
        email: email,
        medical_history: medicalHistory.split(",")  // Store as array
      });
      navigate("/dashboard");
    } catch (error) {
      alert("Error updating medical history");
    }
  };

  return (
    <div >
      <h2 >Enter Medical History</h2>
      <form onSubmit={handleSubmit} >
        <textarea
          placeholder="Enter medical conditions (comma-separated)"
          onChange={(e) => setMedicalHistory(e.target.value)}
          
        />
        <button type="submit" >Submit</button>
      </form>
    </div>
  );
};

export default MedicalHistory;
