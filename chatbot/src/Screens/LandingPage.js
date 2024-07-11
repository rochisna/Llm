import React from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/LandingPage.css";
import LandingNavbar from "../components/LandingNavbar";
import Footer from "../components/Footer";

function LandingPage() {
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    navigate("/chatunregistered");
  };

  return (
    <div className="landing-page-container">
      <LandingNavbar />
      <div className="landing-page-content">
        <h1 className="landing-page-title">Welcome to AgriLLM</h1>
        <p className="landing-page-description">
          Your AI-powered chatbot solution.
        </p>
        <button className="landing-page-button" onClick={handleGetStartedClick}>
          Get Started
        </button>
      </div>
      <Footer />
    </div>
  );
}

export default LandingPage;
