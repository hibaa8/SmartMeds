// import { useEffect, useState, useContext } from "react";
// import { AuthContext } from "./context/AuthContext"; // Import AuthContext
// import { useNavigate } from "react-router-dom";

// const Dashboard = () => {
//   const [prescriptions, setPrescriptions] = useState([]);
//   const { isAuthenticated } = useContext(AuthContext); // Get auth state
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!isAuthenticated) {
//       navigate("/login"); // Redirect if not logged in
//       return;
//     }

//     fetch("/dashboard", {
//       method: "GET",
//       headers: {
//         "Authorization": `Bearer ${localStorage.getItem("token")}`,
//         "Content-Type": "application/json"
//       },
//       credentials: "include"
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         console.log("Prescriptions:", data.prescriptions);
//         setPrescriptions(data.prescriptions);
//       })
//       .catch((err) => console.error("Fetch error:", err));
//   }, [isAuthenticated, navigate]);

//   return (
//     <div className="dashboard-container">
//       <h2>Dashboard</h2>
//       <h3>Your Prescriptions</h3>
//       <button onClick={() => navigate("/add-prescription")} className="btn-add">
//         Add Prescription
//       </button>
//       <div className="prescription-grid">
//         {prescriptions.length > 0 ? (
//           prescriptions.map((prescription) => (
//             <div key={prescription._id} className="prescription-card">
//               <h4>{prescription.name}</h4>
//               <p><strong>Duration:</strong> {prescription.duration} days</p>
//               <p><strong>Frequency:</strong> {prescription.frequency_per_day} times/day</p>
//               <p><strong>Last Taken:</strong> {new Date(prescription.last_taken).toLocaleString()}</p>
//             </div>
//           ))
//         ) : (
//           <p>No prescriptions found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
