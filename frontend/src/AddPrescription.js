import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

const AddPrescription = () => {
  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    frequency_per_day: "",
    last_taken: "",
  });

  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleScan = () => {
    // Redirect to scanning page, passing current form data in state
    navigate("/scan-prescription", { state: { formData } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/add-prescription", formData, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include"
      });
      navigate("/dashboard"); // Redirect back to Dashboard
    } catch (error) {
      alert("Error adding prescription.");
    }
  };

  return (
    <div>
      <h2>Add New Prescription</h2>
      <form onSubmit={handleSubmit} className="prescription-form">
        <input type="text" name="name" placeholder="Prescription Name" required onChange={handleChange} />
        <input type="number" name="duration" placeholder="Duration (days)" required onChange={handleChange} />
        <input type="number" name="frequency_per_day" placeholder="Frequency per day" required onChange={handleChange} />
        <input type="datetime-local" name="last_taken" required onChange={handleChange} />
        <button type="button" className="btn-scan" onClick={handleScan}>Scan</button>
        <button type="submit" className="btn-submit">Submit</button>
      </form>
    </div>
  );
};

export default AddPrescription;
