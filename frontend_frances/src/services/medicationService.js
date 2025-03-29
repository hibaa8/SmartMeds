export const medicationService = {
  // Get all medications for the current user
  getAllMedications: async () => {
    try {
      // BACKEND INTEGRATION POINT:
      // const response = await apiService.getMedications();
      // return response.data;

      // For now, return mock data
      return [
        {
          id: "1",
          name: "Lisinopril",
          duration: "3 months",
          frequency: "Once daily",
          dosage: "10mg",
          lastTaken: "2025-03-29T08:00:00",
        },
        {
          id: "2",
          name: "Metformin",
          duration: "Ongoing",
          frequency: "Twice daily",
          dosage: "500mg",
          lastTaken: "2025-03-29T07:30:00",
        },
      ]
    } catch (error) {
      console.error("Error fetching medications:", error)
      throw error
    }
  },

  // Add a new medication
  addMedication: async (medicationData) => {
    try {
      // BACKEND INTEGRATION POINT:
      // const response = await apiService.addMedication(medicationData);
      // return response.data;

      // For now, return mock data
      return {
        id: Date.now().toString(),
        ...medicationData,
        lastTaken: new Date().toISOString(),
      }
    } catch (error) {
      console.error("Error adding medication:", error)
      throw error
    }
  },

  // Check for medication interactions
  checkInteractions: async (medicationName) => {
    try {
      // BACKEND INTEGRATION POINT:
      // const response = await apiService.post('/medications/check-interactions', { medicationName });
      // return response.data;

      // For now, simulate interaction check
      // Return true if there's an interaction, false otherwise
      return medicationName.toLowerCase() === "warfarin"
    } catch (error) {
      console.error("Error checking interactions:", error)
      throw error
    }
  },

  // Record a dose taken
  takeDose: async (medicationId) => {
    try {
      // BACKEND INTEGRATION POINT:
      // const response = await apiService.takeDose(medicationId);
      // return response.data;

      // For now, return success
      return {
        success: true,
        lastTaken: new Date().toISOString(),
      }
    } catch (error) {
      console.error("Error recording dose:", error)
      throw error
    }
  },

  // Scan medication label (OCR integration)
  scanMedication: async (imageData) => {
    try {
      // BACKEND INTEGRATION POINT:
      // const formData = new FormData();
      // formData.append('image', imageData);
      // const response = await apiService.post('/medications/scan', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // });
      // return response.data;

      // For now, simulate OCR result
      return {
        name: "Atorvastatin",
        dosage: "10mg",
        frequency: "Once daily",
        duration: "6 months",
        notes: "Take with evening meal",
      }
    } catch (error) {
      console.error("Error scanning medication:", error)
      throw error
    }
  },
}

