import React from "react";
import { useNavigate } from "react-router-dom";
import LandingNavbar from "../components/LandingNavbar";
import Footer from "../components/Footer";

function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/chat"); // Directs user to chat page on Get Started click
  };

  return (
    <div className="flex flex-col min-h-screen">
      <LandingNavbar />
      <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-r from-primary-light to-secondary-light text-center p-4">
        <h1 className="text-5xl font-extrabold text-white mb-4">
          Welcome to AgriLLM
        </h1>
        <p className="text-2xl text-neutral-light mb-8">
          Your AI-powered chatbot solution.
        </p>
        <button
          onClick={handleGetStarted}
          className="bg-white text-primary py-3 px-6 rounded-full shadow-lg hover:bg-neutral-light transition duration-300"
        >
          Get Started
        </button>
      </div>
      <Footer />
    </div>
  );
}

export default LandingPage;
