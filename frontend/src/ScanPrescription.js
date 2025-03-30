import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar"; // Import Navbar

const ScanPrescription = () => {
  const [image, setImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const extractTextFromImage = async () => {
    if (!image) {
      alert("Please upload an image first.");
      return;
    }

    setIsProcessing(true);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch("/scan-prescription", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        console.log("✅ Extracted Data from Scan:", data.data);
        
        // Redirect to Add Prescription page with extracted data
        navigate("/add-prescription", { state: { formData: data.data } });
      } else {
        alert("Error extracting prescription details.");
      }
    } catch (error) {
      alert("Error processing image.");
      console.error(error);
    }

    setIsProcessing(false);
  };

  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Scan Form Section */}
      <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
        <div className="card shadow-lg p-4 text-center" style={{ width: "400px" }}>
          <h2 className="fw-bold text-dark mb-3">Scan Prescription</h2>

          {/* Upload Input */}
          <label className="form-label text-muted">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="form-control"
          />

          {/* Image Preview */}
          {image && (
            <div className="mt-3">
              <img
                src={URL.createObjectURL(image)}
                alt="Uploaded"
                className="img-fluid rounded shadow"
                style={{ maxWidth: "100%", maxHeight: "200px", objectFit: "contain" }}
              />
            </div>
          )}

          {/* Buttons */}
          <div className="d-flex flex-column gap-3 mt-4">
            <button
              className="btn btn-dark fw-semibold py-2"
              onClick={extractTextFromImage}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Extract Data"}
            </button>

            <button
              className="btn btn-dark fw-semibold py-2"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanPrescription;
