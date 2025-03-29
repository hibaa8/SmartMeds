"use client"

import { createContext, useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check if token exists in localStorage
        const token = localStorage.getItem("token")

        if (token) {
          // BACKEND INTEGRATION POINT:
          // Verify token with Flask backend
          // const response = await apiService.get('/auth/verify');
          // setCurrentUser(response.data.user);

          // For now, we'll simulate a logged-in user
          setCurrentUser({
            name: "John Doe",
            email: "john.doe@example.com",
          })
        }
      } catch (err) {
        console.error("Auth verification error:", err)
        localStorage.removeItem("token")
        setError("Session expired. Please login again.")
      } finally {
        setLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true)

      // BACKEND INTEGRATION POINT:
      // Make API call to Flask backend
      // const response = await apiService.post('/auth/login', { email, password });
      // const { token, user } = response.data;

      // For now, we'll simulate a successful login
      const token = "fake-jwt-token"
      const user = {
        name: "John Doe",
        email: email,
      }

      // Store token in localStorage
      localStorage.setItem("token", token)
      setCurrentUser(user)
      setError(null)

      return true
    } catch (err) {
      console.error("Login error:", err)
      setError(err.response?.data?.message || "Login failed. Please try again.")
      return false
    } finally {
      setLoading(false)
    }
  }

  // Signup function
  const signup = async (name, email, password) => {
    try {
      setLoading(true)

      // BACKEND INTEGRATION POINT:
      // Make API call to Flask backend
      // const response = await apiService.post('/auth/register', { name, email, password });
      // const { token, user } = response.data;

      // For now, we'll simulate a successful registration
      const token = "fake-jwt-token"
      const user = {
        name: name,
        email: email,
      }

      // Store token in localStorage
      localStorage.setItem("token", token)
      setCurrentUser(user)
      setError(null)

      return true
    } catch (err) {
      console.error("Signup error:", err)
      setError(err.response?.data?.message || "Registration failed. Please try again.")
      return false
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    // BACKEND INTEGRATION POINT:
    // Make API call to Flask backend if needed
    // apiService.post('/auth/logout');

    localStorage.removeItem("token")
    setCurrentUser(null)
    navigate("/")
  }

  const value = {
    currentUser,
    loading,
    error,
    login,
    signup,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}

