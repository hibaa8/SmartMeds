"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { medicationService } from "../services/medicationService"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import Label from "../components/ui/Label"
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "../components/ui/Card"
import { Select, SelectItem } from "../components/ui/Select"
import { Camera, ArrowLeft, Bell } from "react-feather"

const AddMedicationPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    frequency: "",
    dosage: "",
    notes: "",
    notificationTime: "30", // Default to 30 minutes
    reminderTimes: [], // Array of specific times for reminders
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleScan = async () => {
    setIsScanning(true)
    setError(null)

    try {
      // BACKEND INTEGRATION POINT:
      // This would integrate with OCR API via Flask backend
      const scanResult = await medicationService.scanMedication(null)
      setFormData(scanResult)
    } catch (err) {
      console.error("Error scanning medication:", err)
      setError("Failed to scan medication. Please try again or enter details manually.")
    } finally {
      setIsScanning(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Check for potential interactions
      const hasInteraction = await medicationService.checkInteractions(formData.name)

      if (hasInteraction) {
        // Redirect to warning page
        navigate("/home/add-medication/warning", { state: { medication: formData } })
      } else {
        // Add medication and redirect to success page
        await medicationService.addMedication(formData)
        navigate("/home/add-medication/success")
      }
    } catch (err) {
      console.error("Error adding medication:", err)
      setError("Failed to add medication. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link to="/home" className="flex items-center text-green-600 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Medications
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Medication</CardTitle>
          <CardDescription>Enter medication details or scan your prescription label</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 bg-red-100 border border-red-200 text-red-800 rounded-md text-sm">{error}</div>
            )}

            <div className="flex justify-center mb-4">
              <Button
                type="button"
                variant="outline"
                className="flex items-center"
                onClick={handleScan}
                disabled={isScanning}
              >
                <Camera className="mr-2 h-5 w-5" />
                {isScanning ? "Scanning..." : "Scan Medication Label"}
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Medication Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Lisinopril"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g., 3 months, ongoing"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select value={formData.frequency} onValueChange={(value) => handleSelectChange("frequency", value)}>
                  <SelectItem value="Once daily">Once daily</SelectItem>
                  <SelectItem value="Twice daily">Twice daily</SelectItem>
                  <SelectItem value="Three times daily">Three times daily</SelectItem>
                  <SelectItem value="Four times daily">Four times daily</SelectItem>
                  <SelectItem value="As needed">As needed</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dosage">Dosage</Label>
              <Input
                id="dosage"
                name="dosage"
                value={formData.dosage}
                onChange={handleChange}
                placeholder="e.g., 10mg"
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Reminder Settings</Label>
                <Bell className="h-5 w-5" style={{ color: 'var(--color-primary)' }} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notificationTime">Notify me before intake</Label>
                <Select 
                  value={formData.notificationTime} 
                  onValueChange={(value) => handleSelectChange("notificationTime", value)}
                >
                  <SelectItem value="10">10 minutes before</SelectItem>
                  <SelectItem value="15">15 minutes before</SelectItem>
                  <SelectItem value="30">30 minutes before</SelectItem>
                  <SelectItem value="60">1 hour before</SelectItem>
                </Select>
              </div>

              {formData.frequency !== "As needed" && (
                <div className="space-y-2">
                  <Label>Set Reminder Times</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {formData.frequency === "Once daily" && (
                      <Input
                        type="time"
                        name="reminderTime1"
                        onChange={(e) => {
                          const newTimes = [e.target.value];
                          setFormData(prev => ({ ...prev, reminderTimes: newTimes }));
                        }}
                        required
                      />
                    )}
                    {formData.frequency === "Twice daily" && (
                      <>
                        <Input
                          type="time"
                          name="reminderTime1"
                          placeholder="First dose"
                          onChange={(e) => {
                            const newTimes = [...formData.reminderTimes];
                            newTimes[0] = e.target.value;
                            setFormData(prev => ({ ...prev, reminderTimes: newTimes }));
                          }}
                          required
                        />
                        <Input
                          type="time"
                          name="reminderTime2"
                          placeholder="Second dose"
                          onChange={(e) => {
                            const newTimes = [...formData.reminderTimes];
                            newTimes[1] = e.target.value;
                            setFormData(prev => ({ ...prev, reminderTimes: newTimes }));
                          }}
                          required
                        />
                      </>
                    )}
                    {formData.frequency === "Three times daily" && (
                      <>
                        <Input
                          type="time"
                          name="reminderTime1"
                          placeholder="First dose"
                          onChange={(e) => {
                            const newTimes = [...formData.reminderTimes];
                            newTimes[0] = e.target.value;
                            setFormData(prev => ({ ...prev, reminderTimes: newTimes }));
                          }}
                          required
                        />
                        <Input
                          type="time"
                          name="reminderTime2"
                          placeholder="Second dose"
                          onChange={(e) => {
                            const newTimes = [...formData.reminderTimes];
                            newTimes[1] = e.target.value;
                            setFormData(prev => ({ ...prev, reminderTimes: newTimes }));
                          }}
                          required
                        />
                        <Input
                          type="time"
                          name="reminderTime3"
                          placeholder="Third dose"
                          onChange={(e) => {
                            const newTimes = [...formData.reminderTimes];
                            newTimes[2] = e.target.value;
                            setFormData(prev => ({ ...prev, reminderTimes: newTimes }));
                          }}
                          required
                        />
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Input
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="e.g., Take with food"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Medication"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default AddMedicationPage

