import { Link } from "react-router-dom"

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-600">Smart Med Assistant</h1>
          <div className="space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 border border-green-500 rounded text-green-500 hover:bg-green-500 hover:text-white transition"
            >
              Login
            </Link>
            <Link to="/signup" className="px-4 py-2 bg-green-500 rounded text-white hover:bg-green-600 transition">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="text-center mb-16">
          <h2 className="text-4xl font-bold text-green-700 mb-4">Your Personal Health Companion</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Smart Med Assistant helps you manage your medications, provides AI-powered health advice, and assists with
            travel planning for your medical needs.
          </p>
        </section>

        <section className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">Medication Management</h3>
            <p className="text-gray-600 text-center">
              Keep track of all your medications, dosages, and schedules in one place. Receive reminders when it's time
              to take your medicine.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">AI Health Assistant</h3>
            <p className="text-gray-600 text-center">
              Get answers to your health questions from our AI assistant. Learn about medications, symptoms, and general
              health advice.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">Medicinal Travel Planning</h3>
            <p className="text-gray-600 text-center">
              Plan your trips with confidence. Check medication regulations for different countries and get
              travel-specific health advice.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default LandingPage

