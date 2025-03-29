"use client"

import { useState, useEffect } from "react"
import { travelService } from "../services/travelService"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "../components/ui/Card"
import Badge from "../components/ui/Badge"
import { Alert, AlertTitle, AlertDescription } from "../components/ui/Alert"
import { AlertTriangle, CheckCircle, XCircle, Info } from "react-feather"

const TravelPage = () => {
  const [travelPlans, setTravelPlans] = useState([])
  const [medicationRegulations, setMedicationRegulations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTravelData = async () => {
      try {
        // BACKEND INTEGRATION POINT:
        // Fetch travel plans and medication regulations from Flask backend
        const [plansData, regulationsData] = await Promise.all([
          travelService.getTravelPlans(),
          travelService.getMedicationRegulations(),
        ])

        setTravelPlans(plansData)
        setMedicationRegulations(regulationsData)
      } catch (err) {
        console.error("Error fetching travel data:", err)
        setError("Failed to load travel information. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchTravelData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (error) {
    return <div className="p-4 bg-red-100 border border-red-200 text-red-800 rounded-md">{error}</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Medicinal Travel Planning</h1>
        <p className="text-gray-500">Plan your trips with your medical needs in mind</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Trips</CardTitle>
          <CardDescription>Your scheduled travel plans</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {travelPlans.length === 0 ? (
              <p className="text-gray-500">No upcoming trips scheduled.</p>
            ) : (
              travelPlans.map((trip) => (
                <div key={trip.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{trip.destination}</h3>
                      <p className="text-sm text-gray-500">
                        {trip.departureDate} - {trip.returnDate}
                      </p>
                      <p className="text-sm text-gray-500">Airline: {trip.airline}</p>
                    </div>
                    <Badge>{new Date(trip.departureDate) > new Date() ? "Upcoming" : "Past"}</Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Medication Travel Regulations</CardTitle>
          <CardDescription>Check if your medications are allowed at your destinations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {medicationRegulations.map((med) => (
              <div key={med.id} className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3">{med.medication}</h3>

                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Airline Regulations</h4>
                  <div
                    className={`flex items-center p-3 rounded-md ${
                      med.airline.status === "allowed"
                        ? "bg-green-50"
                        : med.airline.status === "restricted"
                          ? "bg-amber-50"
                          : "bg-red-50"
                    }`}
                  >
                    {med.airline.status === "allowed" ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    ) : med.airline.status === "restricted" ? (
                      <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mr-2" />
                    )}
                    <div>
                      <p className="font-medium">
                        {med.airline.status === "allowed"
                          ? "Allowed on flights"
                          : med.airline.status === "restricted"
                            ? "Restrictions apply"
                            : "Not allowed on flights"}
                      </p>
                      <p className="text-sm">{med.airline.notes}</p>
                    </div>
                  </div>
                </div>

                <h4 className="text-sm font-medium mb-2">Country Regulations</h4>
                <div className="space-y-3">
                  {med.countries.map((country, index) => (
                    <div
                      key={index}
                      className={`flex items-center p-3 rounded-md ${
                        country.status === "allowed"
                          ? "bg-green-50"
                          : country.status === "restricted"
                            ? "bg-amber-50"
                            : "bg-red-50"
                      }`}
                    >
                      {country.status === "allowed" ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      ) : country.status === "restricted" ? (
                        <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mr-2" />
                      )}
                      <div>
                        <p className="font-medium">{country.name}</p>
                        <p className="text-sm">{country.notes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Important Information</AlertTitle>
        <AlertDescription>
          Regulations can change. Always verify with your airline and embassy before traveling with medications.
        </AlertDescription>
      </Alert>
    </div>
  )
}

export default TravelPage

