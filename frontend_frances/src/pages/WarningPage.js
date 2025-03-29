"use client"

import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { medicationService } from "../services/medicationService"
import Button from "../components/ui/Button"
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "../components/ui/Card"
import { AlertTriangle } from "react-feather"

const WarningPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(false)
  const medication = location.state?.medication || {}

  const handleAddAnyway = async () => {
    setIsLoading(true)

    try {
      // BACKEND INTEGRATION POINT:
      // Add medication despite the warning
      await medicationService.addMedication(medication)
      navigate("/home/add-medication/success")
    } catch (error) {
      console.error("Error adding medication:", error)
      // Stay on the warning page if there's an error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card className="border-red-500">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl text-red-600">Potential Interaction Detected</CardTitle>
          <CardDescription>This medication may interact with your current medications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-700">
              Our system has detected a potential interaction between this medication and one or more medications you
              are currently taking.
            </p>
            <div className="bg-red-50 p-4 rounded-md">
              <h3 className="font-semibold mb-2">Potential Issues:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>May increase risk of bleeding when taken with your current medications</li>
                <li>May reduce effectiveness of your current heart medication</li>
              </ul>
            </div>
            <p className="text-gray-700 font-medium">
              We recommend consulting with your healthcare provider before adding this medication.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Link to="/home" className="w-full">
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </Link>
          <Button
            variant="destructive"
            className="w-full bg-red-600 hover:bg-red-700"
            onClick={handleAddAnyway}
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add Anyway"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default WarningPage

