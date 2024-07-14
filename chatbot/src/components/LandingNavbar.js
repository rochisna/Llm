import React from "react";
import { Link } from "react-router-dom";

function LandingNavbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-primary">
          <Link to="/">AgriLLM</Link>
        </div>
        <div className="space-x-4">
          <Link
            to="/login"
            className="text-primary hover:text-primary-dark transition duration-300"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-primary text-white py-2 px-4 rounded-full hover:bg-primary-dark transition duration-300"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default LandingNavbar;
