export const aiService = {
  // Send a message to the AI assistant
  sendMessage: async (message) => {
    try {
      // BACKEND INTEGRATION POINT:
      // const response = await apiService.sendMessage(message);
      // return response.data;

      // For now, simulate AI response based on message content
      let response = ""

      if (message.toLowerCase().includes("headache")) {
        response =
          "Headaches can be caused by various factors including stress, dehydration, or medication side effects. If you're taking any medications, check if headaches are listed as a potential side effect. Staying hydrated and getting adequate rest may help. If headaches persist or are severe, please consult your healthcare provider."
      } else if (message.toLowerCase().includes("side effect") || message.toLowerCase().includes("interaction")) {
        response =
          "Medication side effects and interactions are important to monitor. Common side effects include nausea, drowsiness, or headaches. If you're experiencing concerning symptoms, please contact your healthcare provider. Remember that this information is not a substitute for professional medical advice."
      } else {
        response =
          "Thank you for your question. While I can provide general health information, I recommend consulting with your healthcare provider for personalized medical advice. Is there anything specific about your medications or health condition you'd like to know more about?"
      }

      return {
        id: Date.now().toString(),
        content: response,
        sender: "bot",
        timestamp: new Date(),
      }
    } catch (error) {
      console.error("Error sending message to AI:", error)
      throw error
    }
  },
}

