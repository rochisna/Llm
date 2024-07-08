import React from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/LandingPage.css";
import LandingNavbar from "../components/LandingNavbar";
import Footer from "../components/Footer";

function LandingPage() {
  const navigate = useNavigate();
  const handleGetStartedClick = () => {
    navigate("/chatunregistered");
  }
  return (
    <div>
      <LandingNavbar />
      <div className="landing-page">
        <h1>Welcome to AgriLLM</h1>
        <p>Your AI-powered chatbot solution.</p>
        <button className="get-started-button" onClick={handleGetStartedClick}>Get Started</button>
      </div>
      <Footer />
    </div>
  );
}

export default LandingPage;
