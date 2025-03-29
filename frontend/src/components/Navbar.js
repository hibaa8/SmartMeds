// src/components/Navbar.js
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-green-700 text-white shadow-md p-4">
      <div className="flex justify-between items-center container mx-auto">
        <h1 className="text-3xl font-bold">
          <Link to={isAuthenticated ? "/dashboard" : "/"}>Smart Med Assistant</Link>
        </h1>

        <div className="space-x-6">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="hover:text-green-300 transition-all">Home</Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/" className="hover:text-green-300 transition-all">Home</Link>
              <Link to="/login" className="hover:text-green-300 transition-all">Login</Link>
              <Link to="/signup" className="hover:text-green-300 transition-all">Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
