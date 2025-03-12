import React from "react";
import "./Navbar.css";
import logo from "/logo.png";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo-container">
        <div className="navbar-logo-circle">
          <img src={logo} alt="Logo" className="navbar-logo-image" />
        </div>
      </div>
      <div className="navbar-brand" style={{ fontFamily: "Abhaya Libre" }}>
        Виножито
      </div>

      <ul className="navbar-links">
        <li><a href="#">Дома</a></li>
        <li><a href="#">За нас</a></li>
        <li className="login-button"><a href="#">Најави се</a></li>
      </ul>
    </nav>
  );
}
