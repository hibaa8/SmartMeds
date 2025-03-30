import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import for redirecting

// Create the authentication context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate(); // ✅ Initialize navigation

  useEffect(() => {
    // ✅ Check if token exists in localStorage when the app loads
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  // ✅ Function to log in
  const login = (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  // ✅ Function to log out
  const logout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        await fetch("/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }

      // ✅ Remove all session data
      localStorage.removeItem("token");
      setIsAuthenticated(false);

      // ✅ Redirect user to landing page
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
