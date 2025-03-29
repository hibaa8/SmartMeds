"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { medicationService } from "../services/medicationService"
import Button from "../components/ui/Button"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "../components/ui/Card"
import { Plus } from "react-feather"
import MedicationTable from "../components/MedicationTable"

const HomePage = () => {
  const [medications, setMedications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const data = await medicationService.getAllMedications()
        setMedications(data)
      } catch (err) {
        console.error("Error fetching medications:", err)
        setError("Failed to load medications. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchMedications()
  }, [])

  const handleTakeDose = async (id) => {
    try {
      const result = await medicationService.takeDose(id)
      if (result.success) {
        // Update the medication in the list with the new lastTaken time
        setMedications((prevMeds) =>
          prevMeds.map((med) => (med.id === id ? { ...med, lastTaken: result.lastTaken } : med)),
        )
      }
    } catch (err) {
      console.error("Error recording dose:", err)
      setError("Failed to record dose. Please try again.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Medication Management</h1>
        <Link to="/home/add-medication">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Medication
          </Button>
        </Link>
      </div>

      {error && <div className="p-4 bg-red-100 border border-red-200 text-red-800 rounded-md">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Medications</CardTitle>
            <CardDescription>Active prescriptions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{medications.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Next Dose</CardTitle>
            <CardDescription>Upcoming medication</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-medium">Metformin</div>
            <div className="text-sm text-gray-500">Today, 8:00 PM</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Refills Needed</CardTitle>
            <CardDescription>Low supply medications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Medications</CardTitle>
          <CardDescription>Track and manage your current medications</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <MedicationTable medications={medications} onTakeDose={handleTakeDose} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default HomePage

