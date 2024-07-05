import React from "react";
import { Link } from "react-router-dom";
import "../CSS/LandingNavbar.css";

function LandingNavbar() {
  return (
    <div className="landing-navbar">
      <Link to="/" className="landing-navbar-logo">
        YourLogo
      </Link>
      <div className="landing-navbar-links">
        <Link to="/login">Login</Link>
        <Link to="/signup">Sign Up</Link>
      </div>
    </div>
  );
}

export default LandingNavbar;
