import React, { useState } from "react";
import { Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import "../CSS/Navbar.css";

export default function Navbar() {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  return (
    <>
      <div className="navbar">
        <Link to="#" className="menu-bars">
          <FaIcons.FaBars onClick={showSidebar} />
        </Link>
      </div>
      <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
        <ul className="nav-menu-items" onClick={showSidebar}>
          <li className="navbar-toggle">
            <Link to="#" className="menu-bars">
              <FaIcons.FaTimes />
            </Link>
          </li>
          <li className="nav-text">
            <Link to="/">
              <FaIcons.FaHome />
              <span>Home</span>
            </Link>
          </li>
          <li className="nav-text">
            <Link to="/login">
              <FaIcons.FaInfoCircle />
              <span>About</span>
            </Link>
          </li>
          <li className="nav-text">
            <Link to="/signup">
              <FaIcons.FaEnvelope />
              <span>Contact</span>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
