import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await axios.get("/get-prescriptions", {
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });

        if (response.data.success) {
          setPrescriptions(response.data.prescriptions);
        }
      } catch (error) {
        console.error("Error fetching prescriptions:", error);
      }
    };

    fetchPrescriptions();
  }, []);

  // const handleDelete = async (id) => {
  //   try {
  //     console.log(`Deleting prescription: ${id}`); // ✅ Debugging log
  //     const response = await axios.delete(`/delete-prescription/${id})}`, {
  //       headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
  //       withCredentials: true  // ✅ Ensures authentication cookies are included
  //     });

  //     if (response.data.success) {
  //       setPrescriptions(prescriptions.filter(p => p.id !== id));
  //     }
  //   } catch (error) {
  //     console.error("Error deleting prescription:", error);
  //   }
  // };
  const handleDelete = async (id) => {
    try {
      console.log(`Deleting prescription with ID: ${id}`); // ✅ Debugging log
  
      const response = await axios.delete(`http://127.0.0.1:5000/delete-prescription/${id}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,  // ✅ Ensures authentication cookies are included
      });
  
      if (response.data.success) {
        console.log("✅ Prescription deleted successfully");
        setPrescriptions(prescriptions.filter(p => p.id !== id)); // ✅ Remove from UI
      }
    } catch (error) {
      console.error("Error deleting prescription:", error.response ? error.response.data : error.message);
    }
  };
  

  return (
    <div className="dashboard-container">
      <h2>Your Prescriptions</h2>

      {/* ✅ Add Prescription Button */}
      <button onClick={() => navigate("/add-prescription")} className="btn-add">
        + Add Prescription
      </button>

      {prescriptions.length === 0 ? (
        <p>No prescriptions found.</p>
      ) : (
        <div className="prescription-list">
          {prescriptions.map((prescription) => (
            <div key={prescription.id} className="prescription-card">
              <h3>{prescription.name}</h3>
              <p><strong>Dosage:</strong> {prescription.dosage}</p>
              <p><strong>Frequency:</strong> {prescription.frequency}</p>
              <p><strong>Quantity:</strong> {prescription.quantity}</p>
              <p><strong>Days Remaining:</strong> {prescription.days}</p>
              <p><strong>Last Taken:</strong> {prescription.last_taken}</p>
              {prescription.refills > 0 && <p><strong>Refills Remaining:</strong> {prescription.refills}</p>}

              {/* ✅ Delete Button */}
              <button onClick={() => handleDelete(prescription.id)} className="btn-delete">
                🗑 Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
