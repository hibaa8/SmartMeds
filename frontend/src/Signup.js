import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext"; // Import AuthContext

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Get login function from context

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/signup", formData);
      login(res.data.token); // Store token in AuthContext
      navigate("/medical-history", { state: { email: formData.email } }); // Redirect to medical history
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  return (
    <div >
      <h2 >Signup</h2>
      <form onSubmit={handleSubmit} >
        <input type="text" name="name" placeholder="Name" onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" onChange={handleChange}/>
        <input type="password" name="password" placeholder="Password" onChange={handleChange} />
        <button type="submit" >Signup</button>
      </form>
    </div>
  );
};

export default Signup;
