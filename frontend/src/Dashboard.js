import { useEffect, useState, useContext } from "react";
import { AuthContext } from "./context/AuthContext"; // Import AuthContext
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [message, setMessage] = useState("");
  const { isAuthenticated } = useContext(AuthContext); // Get auth state
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login"); // Redirect if not logged in
      return;
    }

    fetch("http://localhost:5000/dashboard", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      },
      credentials: "include"
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setMessage(data.message))
      .catch((err) => console.error("Fetch error:", err));
  }, [isAuthenticated, navigate]);

  return (
    <div>
      <h2>Dashboard</h2>
      <p>{message}</p>
    </div>
  );
};

export default Dashboard;
