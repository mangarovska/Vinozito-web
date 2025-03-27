import React from "react";
import "./Navbar.css";
import logo from "/logo.png";

export default function Navbar() {
  return (
    <div className="navbar-container">
      <svg 
        className="navbar-shape" 
        viewBox="0 0 100 10" 
        preserveAspectRatio="none"
      >
        {/* the navbar shpe */}
        <path 
          d="M5,0 L100,0 L100,10 L5,10 A5,5 0 0,1 5,0 Z"
          fill="white"
        />
      </svg>

      <nav className="navbar">
        <div className="navbar-logo-container">
          <div className="navbar-logo-circle">
            <img src={logo} alt="Logo" className="navbar-logo-image" />
          </div>
        </div>
        
        <div className="navbar-brand">
          Виножито
        </div>

        <ul className="navbar-links">
          <li><a href="#">Дома</a></li>
          <li><a href="#">За нас</a></li>
          <li className="login-button"><a href="#">Најави се</a></li>
        </ul>
      </nav>
    </div>
  );
}