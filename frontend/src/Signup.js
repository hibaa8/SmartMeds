import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext"; 
import Navbar from "./components/Navbar"; 

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    number: ""  /
  });
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/signup", formData);
      login(res.data.token); 
      navigate("/medical-history", { state: { email: formData.email } });
    } catch (error) {
      alert(error.response?.data?.error || "Signup failed. Please try again.");
    }
  };

  return (
    <div>
      <Navbar />

      <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
        <div className="card shadow-lg p-4" style={{ width: "400px" }}>
          <h2 className="text-center text-dark fw-bold mb-3">Sign Up</h2>
          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              className="form-control p-2"
              required
            />
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
            <input
              type="tel"
              name="phone_number"
              placeholder="Phone Number"
              onChange={handleChange}
              className="form-control p-2"
              required
            />
            <button type="submit" className="btn btn-dark fw-semibold py-2">
              Sign Up
            </button>
          </form>
          <div className="text-center mt-3">
            <small className="text-muted">
              Already have an account?{" "}
              <a href="/login" className="text-decoration-none fw-semibold">
                Log in
              </a>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
