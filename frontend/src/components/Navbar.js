import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";// Import AuthContext

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();  // Call logout function from context
    navigate("/");  // Redirect to home after logout
  };

  return (
    <nav >
      <h1 >
        <Link to={isAuthenticated ? "/dashboard" : "/"}>Smart Med Assistant</Link>
      </h1>
      <div>
        {isAuthenticated ? (
          <>
            <Link  to="/dashboard">Home</Link>
            <button onClick={handleLogout} >Logout</button>
          </>
        ) : (
          <>
            <Link to="/">Home</Link>
            <Link  to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
