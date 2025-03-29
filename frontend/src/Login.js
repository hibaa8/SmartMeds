import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext"; // Import AuthContext

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
      alert(error.response.data.error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold">Login</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="email" name="email" placeholder="Email" onChange={handleChange} className="border p-2"/>
        <input type="password" name="password" placeholder="Password" onChange={handleChange} className="border p-2"/>
        <button type="submit" className="bg-green-500 text-white p-2">Login</button>
      </form>
    </div>
  );
};

export default Login;
