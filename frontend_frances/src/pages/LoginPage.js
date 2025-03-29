"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import Label from "../components/ui/Label"
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "../components/ui/Card"
import { ArrowLeft } from "react-feather"
import Logo from "../components/ui/Logo"
import { authService } from '../services/api'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login, error } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errorState, setErrorState] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorState("")

    try {
      const response = await authService.login(formData)
      if (response.access_token) {
        navigate("/home")
      }
    } catch (error) {
      console.error("Login error:", error)
      setErrorState("Invalid email or password")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4">
      <div className="absolute top-4 left-4">
        <Link to="/">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 bg-white shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all"
            style={{ 
              color: 'var(--color-primary)',
              borderColor: 'var(--color-primary)',
              ['--tw-hover-bg']: 'var(--color-primary-light)',
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            Return
          </Button>
        </Link>
      </div>
      <Card className="w-full max-w-md retro-card">
        <CardHeader className="space-y-1">
          <div className="flex flex-col items-center justify-center space-y-3 mb-4">
            <Logo size="large" className="w-20 h-20" />
            <span className="text-4xl font-bold tracking-tight" style={{ color: 'var(--color-primary)' }}>Smart Med</span>
          </div>
          <CardTitle className="text-2xl font-bold text-center tracking-tight" style={{ color: 'var(--color-primary-dark)' }}>Welcome Back</CardTitle>
          <CardDescription className="text-center" style={{ color: 'var(--color-primary)' }}>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {errorState && (
              <div className="p-3 bg-red-50 border-2 border-red-200 text-red-800 rounded-md text-sm font-medium">{errorState}</div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-green-700">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                value={formData.email}
                onChange={handleChange}
                className="retro-input"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-green-700">Password</Label>
                <Link to="#" className="text-sm text-green-600 hover:text-green-700 hover:underline font-medium">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="retro-input"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full retro-button bg-green-600 hover:bg-green-700 text-white font-medium" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <div className="text-center text-sm text-green-700">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="text-green-600 hover:text-green-700 hover:underline font-medium">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default LoginPage

