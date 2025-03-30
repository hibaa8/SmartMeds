import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext"; // Import AuthContext
import Navbar from "./components/Navbar"; // Import Navbar

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Get login function from context

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/login", formData);
      login(res.data.token); // Update authentication state
      navigate("/dashboard"); // Redirect to dashboard
    } catch (error) {
      alert(error.response?.data?.error || "Login failed. Please try again.");
    }
  };

  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Login Form Section */}
      <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
        <div className="card shadow-lg p-4" style={{ width: "380px" }}>
          <h2 className="text-center text-dark fw-bold mb-3">Login</h2>
          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="form-control p-2"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="form-control p-2"
              required
            />
            <button type="submit" className="btn btn-dark fw-semibold py-2">
              Login
            </button>
          </form>
          <div className="text-center mt-3">
            <small className="text-muted">
              Don't have an account? <a href="/signup" className="text-decoration-none fw-semibold">Sign up</a>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
