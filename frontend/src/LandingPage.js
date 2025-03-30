// src/pages/LandingPage.js
import { Link } from "react-router-dom";
import Navbar from "./components/Navbar"; // Import the Navbar

const LandingPage = () => {
  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <header
        className="hero-section d-flex align-items-center text-center text-white"
        style={{
          backgroundImage: "url('https://source.unsplash.com/1600x900/?medicine,healthcare')",
          height: "65vh",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
          backgroundColor: "black", // Soft blue overlay
        }}
      >
        <div className="container">
          <h1 className="display-4 fw-bold">Your Health, Simplified</h1>
          <p className="lead mb-4">
            A smart way to manage medications, receive timely reminders, and stay informed about your health.
          </p>
          <Link to="/signup" className="btn btn-lg btn-light fw-semibold">
            Get Started
          </Link>
        </div>
      </header>

      {/* About Section */}
      <section className="container text-center py-5">
        <h2 className="text-grey fw-bold mb-3 h3">Why Choose Smart Med Assistant?</h2>
        <p className="text-muted mx-auto w-75 h4">
          Stay on top of your health with AI-powered medication tracking, smart reminders, and personalized insights.
          Designed to keep you in control.
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-light text-center py-4">
        <p className="text-muted mb-0">&copy; {new Date().getFullYear()} Smart Med Assistant. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
