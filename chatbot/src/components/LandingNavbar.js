import React from "react";
import { Link } from "react-router-dom";

function LandingNavbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <div className="text-xl font-bold">
        <Link to="/">AgriLLM</Link>
      </div>
      <div>
        <Link to="/login" className="mr-4">
          Login
        </Link>
        <Link to="/signup">Signup</Link>
      </div>
    </nav>
  );
}

export default LandingNavbar;
