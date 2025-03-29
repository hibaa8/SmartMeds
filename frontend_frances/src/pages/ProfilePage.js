"use client"

import { useState, useEffect } from "react"
import { userService } from "../services/userService"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import Label from "../components/ui/Label"
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "../components/ui/Card"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/Avatar"
import Badge from "../components/ui/Badge"
import { X, Plus, Save } from "react-feather"

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    conditions: [],
  })
  const [isEditing, setIsEditing] = useState(false)
  const [newCondition, setNewCondition] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // BACKEND INTEGRATION POINT:
        // Fetch user profile from Flask backend
        const userData = await userService.getUserProfile()
        setUser(userData)
      } catch (err) {
        console.error("Error fetching user profile:", err)
        setError("Failed to load profile information. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  const handleAddCondition = () => {
    if (newCondition.trim() && !user.conditions.includes(newCondition.trim())) {
      setUser((prev) => ({
        ...prev,
        conditions: [...prev.conditions, newCondition.trim()],
      }))
      setNewCondition("")
    }
  }

  const handleRemoveCondition = (condition) => {
    setUser((prev) => ({
      ...prev,
      conditions: prev.conditions.filter((c) => c !== condition),
    }))
  }

  const handleSaveProfile = async () => {
    setLoading(true)
    setSaveSuccess(false)
    setError(null)

    try {
      // BACKEND INTEGRATION POINT:
      // Update user profile in Flask backend
      await userService.updateProfile({
        name: user.name,
        email: user.email,
      })

      // Update medical conditions
      await userService.updateMedicalConditions(user.conditions)

      setIsEditing(false)
      setSaveSuccess(true)

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)
    } catch (err) {
      console.error("Error saving profile:", err)
      setError("Failed to save profile changes. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (loading && !user.name) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <p className="text-gray-500">Manage your personal information and health conditions</p>
      </div>

      {error && <div className="p-4 bg-red-100 border border-red-200 text-red-800 rounded-md">{error}</div>}

      {saveSuccess && (
        <div className="p-4 bg-green-100 border border-green-200 text-green-800 rounded-md">
          Profile updated successfully!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                  alt={user.name}
                />
                <AvatarFallback>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div>
                <h3 className="text-xl font-semibold">{user.name}</h3>
                <p className="text-gray-500">{user.email}</p>
              </div>
            </div>

            {isEditing ? (
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={user.name}
                    onChange={(e) => setUser((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    onChange={(e) => setUser((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>
            ) : (
              <Button variant="outline" className="mt-4" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </CardContent>
          {isEditing && (
            <CardFooter>
              <Button className="w-full" onClick={handleSaveProfile} disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Medical Conditions</CardTitle>
            <CardDescription>Manage your health conditions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {user.conditions.length === 0 ? (
                <p className="text-gray-500">No medical conditions added yet.</p>
              ) : (
                user.conditions.map((condition, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {condition}
                    <button
                      type="button"
                      className="ml-1 text-gray-500 hover:text-gray-700"
                      onClick={() => handleRemoveCondition(condition)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))
              )}
            </div>

            <div className="flex space-x-2">
              <Input
                placeholder="Add condition"
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
              />
              <Button type="button" variant="outline" size="icon" onClick={handleAddCondition}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Change Password</Label>
            <Input id="password" type="password" placeholder="New password" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notifications">Notification Preferences</Label>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="email-notifications" className="rounded border-gray-300" />
              <label htmlFor="email-notifications">Email notifications</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="sms-notifications" className="rounded border-gray-300" />
              <label htmlFor="sms-notifications">SMS notifications</label>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Save Settings</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default ProfilePage

