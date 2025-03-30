import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const AddPrescription = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequency: "",
    quantity: "",
    refills: "",
    days: "",
    last_taken: ""
  });

  // ✅ Pre-fill form if redirected from ScanPrescription
  useEffect(() => {
    if (location.state && location.state.formData) {
      console.log("✅ Received Data from Scan:", location.state.formData);
      setFormData({ ...location.state.formData, last_taken: "" });
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleScan = () => {
    // Redirect to scanning page, passing current form data in state
    navigate("/scan-prescription", { state: { formData } });
  };


  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     await axios.post("/add-prescription", formData, {
  //       headers: {
  //         "Authorization": `Bearer ${localStorage.getItem("token")}`,
  //         "Content-Type": "application/json"
  //       },
  //       credentials: "include"
  //     });
  //     navigate("/dashboard"); // Redirect back to Dashboard
  //   } catch (error) {
  //     alert("Error adding prescription.");
  //     console.error(error);
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/add-prescription", formData, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        console.log("✅ Prescription Added:", response.data);
        
        // ✅ Store analysis message in localStorage
        if (response.data.analysis) {
          localStorage.setItem("analysisMessage", response.data.analysis);
        }

        navigate("/dashboard"); // ✅ Redirect to Dashboard
      }
    } catch (error) {
      console.error("Error adding prescription:", error);
      alert("Error adding prescription.");
    }
  };

  return (
    <div>
      <h2>Add New Prescription</h2>
      <form onSubmit={handleSubmit} className="prescription-form">
        <label>Medication Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label>Dosage:</label>
        <input type="text" name="dosage" value={formData.dosage} onChange={handleChange} required />

        <label>Frequency:</label>
        <input type="text" name="frequency" value={formData.frequency} onChange={handleChange} required />

        <label>Quantity:</label>
        <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required />

        <label>Days to Take Medication:</label>
        <input type="number" name="days" value={formData.days} onChange={handleChange} required />

        {formData.refills && (
          <>
            <label>Refills Remaining:</label>
            <input type="number" name="refills" value={formData.refills} onChange={handleChange} />
          </>
        )}

        <label>Last Taken Date:</label>
        <input type="date" name="last_taken" value={formData.last_taken} onChange={handleChange} required />
        <button type="button" className="btn-scan" onClick={handleScan}>Scan</button>
        <button type="submit" className="btn-submit">Submit</button>
      </form>
    </div>
  );
};

export default AddPrescription;
