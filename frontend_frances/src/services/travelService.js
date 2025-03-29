export const travelService = {
  // Get travel plans for the current user
  getTravelPlans: async () => {
    try {
      // BACKEND INTEGRATION POINT:
      // const response = await apiService.getTravelPlans();
      // return response.data;

      // For now, return mock data
      return [
        {
          id: "1",
          destination: "Japan",
          departureDate: "April 15, 2025",
          returnDate: "April 30, 2025",
          airline: "ANA",
        },
        {
          id: "2",
          destination: "France",
          departureDate: "June 10, 2025",
          returnDate: "June 20, 2025",
          airline: "Air France",
        },
      ]
    } catch (error) {
      console.error("Error fetching travel plans:", error)
      throw error
    }
  },

  // Get medication regulations for different countries
  getMedicationRegulations: async () => {
    try {
      // BACKEND INTEGRATION POINT:
      // const response = await apiService.getMedicationRegulations();
      // return response.data;

      // For now, return mock data
      return [
        {
          id: "1",
          medication: "Lisinopril",
          countries: [
            { name: "Japan", status: "allowed", notes: "Bring prescription and doctor's note" },
            { name: "France", status: "allowed", notes: "No restrictions" },
          ],
          airline: { status: "allowed", notes: "Carry in original packaging" },
        },
        {
          id: "2",
          medication: "Adderall",
          countries: [
            { name: "Japan", status: "restricted", notes: "Strictly prohibited without special import certificate" },
            { name: "France", status: "restricted", notes: "Limited quantity, prescription required" },
          ],
          airline: { status: "allowed", notes: "Carry in original packaging with prescription" },
        },
        {
          id: "3",
          medication: "Metformin",
          countries: [
            { name: "Japan", status: "allowed", notes: "No restrictions" },
            { name: "France", status: "allowed", notes: "No restrictions" },
          ],
          airline: { status: "allowed", notes: "No restrictions" },
        },
      ]
    } catch (error) {
      console.error("Error fetching medication regulations:", error)
      throw error
    }
  },
}

