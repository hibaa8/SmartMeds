"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { userService } from "../services/userService"
import { authService } from '../services/api'
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import Label from "../components/ui/Label"
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "../components/ui/Card"
import { X, Plus } from "react-feather"

const CompleteAccountPage = () => {
  const navigate = useNavigate()
  const [conditions, setConditions] = useState([])
  const [newCondition, setNewCondition] = useState("")
  const [newAllergy, setNewAllergy] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [allergies, setAllergies] = useState([])

  const handleAddCondition = () => {
    if (newCondition.trim()) {
      setConditions((prev) => [...prev, newCondition.trim()])
      setNewCondition("")
    }
  }

  const handleRemoveCondition = (index) => {
    setConditions((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await authService.updateMedicalInfo({
        medical_conditions: conditions,
        allergies: allergies
      })

      if (response.message) {
        navigate("/home")
      } else {
        setError("Failed to update your medical information. Please try again.")
      }
    } catch (error) {
      console.error("Error updating medical info:", error)
      setError(error.response?.data?.error || "Failed to update your medical information. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 relative">
      <div className="grid-pattern absolute inset-0"></div>
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Complete Your Profile</h1>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="conditions" style={{ color: 'var(--color-primary-dark)' }}>Medical Conditions</Label>
              <div className="flex space-x-2">
                <Input
                  id="newCondition"
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  placeholder="e.g., Diabetes, Hypertension"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon" 
                  onClick={handleAddCondition}
                  style={{ 
                    borderColor: 'var(--color-primary)',
                    color: 'var(--color-primary)',
                    ['--tw-hover-bg']: 'var(--color-primary-light)',
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm" style={{ color: 'var(--color-primary)' }}>This information helps us provide better recommendations</p>
            </div>

            {conditions.length > 0 && (
              <div className="space-y-2">
                <Label style={{ color: 'var(--color-primary-dark)' }}>Added Conditions</Label>
                <div className="flex flex-wrap gap-2">
                  {conditions.map((condition, index) => (
                    <div 
                      key={index} 
                      className="px-3 py-1 rounded-full flex items-center"
                      style={{ 
                        backgroundColor: 'var(--color-primary-light)',
                        color: 'var(--color-primary-dark)',
                      }}
                    >
                      <span>{condition}</span>
                      <button
                        type="button"
                        className="ml-2 hover:opacity-75 transition-opacity"
                        onClick={() => handleRemoveCondition(index)}
                        style={{ color: 'var(--color-primary)' }}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
                isLoading 
                  ? 'bg-green-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700'
              } transition-colors duration-200`}
            >
              {isLoading ? 'Updating...' : 'Complete Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CompleteAccountPage

