import { Link } from "react-router-dom"
import Button from "../components/ui/Button"
import { ArrowRight } from "react-feather"
import Logo from "../components/ui/Logo"

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Logo size="small" />
            <h1 className="text-2xl font-bold" style={{ color: 'var(--color-primary-dark)' }}>Smart Med Assistant</h1>
          </div>
          <div className="space-x-4">
            <Link to="/login">
              <Button variant="outline" className="border-opacity-20 hover:bg-opacity-10" style={{ 
                borderColor: 'var(--color-primary)',
                ['--tw-hover-bg']: 'var(--color-primary)',
              }}>Login</Button>
            </Link>
            <Link to="/signup">
              <Button style={{ 
                backgroundColor: 'var(--color-primary)',
                ['--tw-hover-bg']: 'var(--color-primary-dark)',
              }}>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16 bg-gradient-to-b from-opacity-10 to-white" style={{ '--tw-gradient-from': 'var(--color-primary-light)' }}>
        <h1 className="text-5xl font-bold mb-6" style={{ color: 'var(--color-primary-dark)' }}>Your Personal Health Companion</h1>
        <p className="text-xl text-gray-600 max-w-2xl mb-8">
          Manage your medications, get AI-powered health advice, and plan your travels with medical considerations in
          mind.
        </p>
        <Link to="/signup">
          <Button size="lg" className="text-lg px-8" style={{ 
            backgroundColor: 'var(--color-primary)',
            ['--tw-hover-bg']: 'var(--color-primary-dark)',
          }}>
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16" style={{ color: 'var(--color-primary-dark)' }}>Our Features</h2>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl shadow-md p-6 transition-transform hover:scale-105">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto bg-opacity-10" style={{ backgroundColor: 'var(--color-primary-light)' }}>
                <svg
                  className="w-8 h-8"
                  style={{ color: 'var(--color-primary)' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-3" style={{ color: 'var(--color-primary-dark)' }}>Medication Management</h3>
              <p className="text-gray-600 text-center">
                Track your medications, dosages, and schedules. Get reminders and avoid dangerous drug interactions.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl shadow-md p-6 transition-transform hover:scale-105">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto bg-opacity-10" style={{ backgroundColor: 'var(--color-primary-light)' }}>
                <svg
                  className="w-8 h-8"
                  style={{ color: 'var(--color-primary)' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-3" style={{ color: 'var(--color-primary-dark)' }}>AI Health Assistant</h3>
              <p className="text-gray-600 text-center">
                Get answers to your health questions from our AI assistant. Learn about medications and symptoms.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl shadow-md p-6 transition-transform hover:scale-105">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto bg-opacity-10" style={{ backgroundColor: 'var(--color-primary-light)' }}>
                <svg
                  className="w-8 h-8"
                  style={{ color: 'var(--color-primary)' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-3" style={{ color: 'var(--color-primary-dark)' }}>Travel Planning</h3>
              <p className="text-gray-600 text-center">
                Plan your travels with medical considerations in mind. Find pharmacies and healthcare facilities abroad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">© 2025 Smart Med Assistant. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage

