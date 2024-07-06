import React from "react";
import "../CSS/LandingPage.css";
import LandingNavbar from "../components/LandingNavbar";
import Footer from "../components/Footer";

function LandingPage() {
  return (
    <div>
      <LandingNavbar/>
      <div className="landing-page">
        <h1>Welcome to AgriLLM</h1>
        <p>Your AI-powered chatbot solution.</p>
        <button className="get-started-button">Get Started</button>
      </div>
      <Footer/>
    </div>
  );
}

export default LandingPage;
