import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

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

  // ✅ Ensure we correctly receive the extracted data from the scan page
  useEffect(() => {
    if (location.state && location.state.formData) {
      console.log("✅ Received Data:", location.state.formData);
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

  return (
    <div>
      <h2>Add Prescription</h2>
      <form>
        <label>Medication Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} />

        <label>Dosage:</label>
        <input type="text" name="dosage" value={formData.dosage} onChange={handleChange} />

        <label>Frequency:</label>
        <input type="text" name="frequency" value={formData.frequency} onChange={handleChange} />

        <label>Quantity:</label>
        <input type="text" name="quantity" value={formData.quantity} onChange={handleChange} />

        {formData.refills && (
          <>
            <label>Refills Remaining:</label>
            <input type="text" name="refills" value={formData.refills} onChange={handleChange} />
          </>
        )}

        <label>Days to Take Medication:</label>
        <input type="text" name="days" value={formData.days} onChange={handleChange} />

        <label>Last Taken Date:</label>
        <input type="date" name="last_taken" value={formData.last_taken} onChange={handleChange} />
        
        <button type="button" className="btn-scan" onClick={handleScan}>Scan</button>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddPrescription;
