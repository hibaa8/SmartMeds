import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const Dashboard = () => {
  const [prescriptions, setPrescriptions] = useState([])
  const [analysisMessage, setAnalysisMessage] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await axios.get("/get-prescriptions", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })

        if (response.data.success) {
          setPrescriptions(response.data.prescriptions)
        }
      } catch (error) {
        console.error("Error fetching prescriptions:", error)
      }
    }

    fetchPrescriptions()

    // Retrieve analysis message from localStorage (if available)
    const savedAnalysis = localStorage.getItem("analysisMessage")
    if (savedAnalysis) {
      setAnalysisMessage(savedAnalysis)
      localStorage.removeItem("analysisMessage") // Clear message after first render
    }
  }, [])

  const handleDelete = async (id) => {
    try {
      console.log(`Deleting prescription with ID: ${id}`)

      const response = await axios.delete(`/delete-prescription/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      })

      if (response.data.success) {
        setPrescriptions(prescriptions.filter((p) => p.id !== id))
      }
    } catch (error) {
      console.error("Error deleting prescription:", error.response ? error.response.data : error.message)
    }
  }

  return (
    <div className="container py-5">
      <div className="card shadow-lg p-4 mx-auto" style={{ maxWidth: "800px" }}>
        <h2 className="text-center text-dark fw-bold mb-4">Your Prescriptions</h2>

        {/* AI Analysis Alert */}
        {analysisMessage && (
          <div className="alert alert-info mb-4" role="alert">
            <strong>AI Drug Interaction Analysis:</strong> {analysisMessage}
          </div>
        )}

        {/* Add Prescription Button */}
        <div className="d-flex justify-content-end mb-4">
          <button onClick={() => navigate("/add-prescription")} className="btn btn-dark fw-semibold">
            + Add Prescription
          </button>
        </div>

        {prescriptions.length === 0 ? (
          <p className="text-center text-muted">No prescriptions found.</p>
        ) : (
          <div className="row g-4">
            {prescriptions.map((prescription) => (
              <div key={prescription.id} className="col-md-6">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h3 className="card-title fw-bold">{prescription.name}</h3>
                    <div className="card-text">
                      <p>
                        <strong>Dosage:</strong> {prescription.dosage}
                      </p>
                      <p>
                        <strong>Frequency:</strong> {prescription.frequency}
                      </p>
                      <p>
                        <strong>Quantity:</strong> {prescription.quantity}
                      </p>
                      <p>
                        <strong>Days Remaining:</strong> {prescription.days}
                      </p>
                      <p>
                        <strong>Last Taken:</strong> {prescription.last_taken}
                      </p>
                      {prescription.refills > 0 && (
                        <p>
                          <strong>Refills Remaining:</strong> {prescription.refills}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="card-footer bg-white border-top-0 d-flex justify-content-end">
                    <button onClick={() => handleDelete(prescription.id)} className="btn btn-outline-danger">
                      🗑 Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard

