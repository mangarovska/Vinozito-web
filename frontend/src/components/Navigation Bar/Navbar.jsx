import React from "react";
import "./Navbar.css";
import logo from "/logo.png";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";
  const isAbout = location.pathname === "/about";

  const logoElement = (
    <div className="navbar-logo-container">
      <div className="navbar-logo-circle">
        <img src={logo} alt="Logo" className="navbar-logo-image" />
      </div>
    </div>
  );

  const brandElement = <div className="navbar-brand">Виножито</div>;

  return (
    <div className="navbar-container">
      <svg
        className="navbar-shape"
        viewBox="0 0 100 10"
        preserveAspectRatio="none"
      >
        <path d="M5,0 L100,0 L100,10 L5,10 A5,5 0 0,1 5,0 Z" fill="white" />
      </svg>

      <nav className="navbar">
        {isAbout ? <Link to="/">{logoElement}</Link> : logoElement}
        {isAbout ? <Link to="/" className="navbar-brand">Виножито</Link> : brandElement}

        <ul className="navbar-links">
          {(isLandingPage || isAbout) && (
            <>
              <li>
                <Link to="/">Дома</Link>
              </li>
              <li>
                <Link to="/about">За нас</Link>
              </li>
            </>
          )}
          <li className="login-button">
            <Link to="/login">Најави се</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
