import React from "react";
import { useNavigate } from "react-router-dom";
import LandingNavbar from "../components/LandingNavbar";
import Footer from "../components/Footer";
import image from "../images/10.jpg";

function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/chat"); // Directs user to chat page on Get Started click
  };

  return (
    <div className="min-h-screen min-w-screen">
      <div className ="flex flex-col min-h-screen">
  <LandingNavbar />
  <div className="flex-1 flex flex-row lg:flex-col items-center justify-center bg-gradient-to-r from-primary-light to-secondary-light text-center"
    style={{ 
      backgroundImage: `url(${image})`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat'
    }}
  >
    <div className="p-8 lg:p-12 bg-[#141F0E] bg-opacity-60 flex lg:flex-1 flex-col items-center justify-center">
      <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 text-center">
        Welcome to AgriLLM
      </h1>
      <p className="text-base md:text-2xl text-neutral-light mb-3 md:mb-8 text-center">
        Your AI-powered chatbot solution.
      </p>
      <button
        onClick={handleGetStarted}
        className="bg-white text-[#141F0E] py-3 px-6 rounded-full shadow-lg hover:bg-neutral-light transition duration-300"
      >
        Get Started
      </button>
    </div>
  </div>
  </div>
  <Footer />
</div>

  );
}

export default LandingPage;