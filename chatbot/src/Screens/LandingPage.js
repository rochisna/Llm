import React from "react";
import { useNavigate } from "react-router-dom";
import LandingNavbar from "../components/LandingNavbar";
import Footer from "../components/Footer";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <LandingNavbar />
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-100 text-center p-4">
        <h1 className="text-4xl font-bold mb-4">Welcome to AgriLLM</h1>
        <p className="text-xl mb-8">Your AI-powered chatbot solution.</p>
        <button
          onClick={() => navigate("/chat")}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Get Started
        </button>
      </div>
      <Footer />
    </div>
  );
}

export default LandingPage;
