import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: formData
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
    <div className="scan-container">
      <h2>Scan Prescription Label</h2>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {image && <img src={URL.createObjectURL(image)} alt="Uploaded" className="preview-image" />}
      <button className="btn-process" onClick={extractTextFromImage} disabled={isProcessing}>
        {isProcessing ? "Processing..." : "Extract Data"}
      </button>
    </div>
  );
};

export default ScanPrescription;
