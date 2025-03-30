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
    last_taken: "",
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
    navigate("/scan-prescription", { state: { formData } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/add-prescription", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        console.log("✅ Prescription Added:", response.data);
        if (response.data.analysis) {
          localStorage.setItem("analysisMessage", response.data.analysis);
        }
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error adding prescription:", error);
      alert("Error adding prescription.");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ width: "400px" }}>
        <h2 className="text-center text-dark fw-bold mb-3">Add Prescription</h2>
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          
          {/* Medication Name */}
          <label className="fw-semibold text-muted">Medication Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-control p-2"
          />

          {/* Dosage */}
          <label className="fw-semibold text-muted">Dosage</label>
          <input
            type="text"
            name="dosage"
            value={formData.dosage}
            onChange={handleChange}
            required
            className="form-control p-2"
          />

          {/* Frequency */}
          <label className="fw-semibold text-muted">Frequency (e.g., Twice daily)</label>
          <input
            type="text"
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
            required
            className="form-control p-2"
          />

          {/* Quantity & Days */}
          <div className="d-flex gap-3">
            <div className="w-50">
              <label className="fw-semibold text-muted">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                className="form-control p-2"
              />
            </div>
            <div className="w-50">
              <label className="fw-semibold text-muted">Days to Take Medication</label>
              <input
                type="number"
                name="days"
                value={formData.days}
                onChange={handleChange}
                required
                className="form-control p-2"
              />
            </div>
          </div>

          {/* Refills */}
          {formData.refills && (
            <>
              <label className="fw-semibold text-muted">Refills Remaining</label>
              <input
                type="number"
                name="refills"
                value={formData.refills}
                onChange={handleChange}
                className="form-control p-2"
              />
            </>
          )}

          {/* Last Taken Date */}
          <label className="fw-semibold text-muted">Last Taken Date</label>
          <input
            type="date"
            name="last_taken"
            value={formData.last_taken}
            onChange={handleChange}
            required
            className="form-control p-2"
          />

          {/* Buttons */}
          <div className="d-flex justify-content-between mt-3">
            <button
              type="button"
              className="btn btn-dark fw-semibold py-2 px-3 w-40"
              onClick={handleScan}
            >
              Scan Prescription
            </button>
            <button
              type="submit"
              className="btn btn-dark fw-semibold py-2 px-3 w-50"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPrescription;
