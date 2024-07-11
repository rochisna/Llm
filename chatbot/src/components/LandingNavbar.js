import React from "react";
import { Link } from "react-router-dom";


function LandingNavbar() {
  return (
    <nav className="landing-navbar">
      <div className="logo">AgriLLM</div>
      <div className="nav-links">
        <Link to="/login" className="nav-link">
          Login
        </Link>
        <Link to="/signup" className="nav-link">
          Signup
        </Link>
      </div>
    </nav>
  );
}

export default LandingNavbar;
