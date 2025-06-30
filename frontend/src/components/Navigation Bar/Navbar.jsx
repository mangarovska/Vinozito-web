import React from "react";
import "./Navbar.css";
import logo from "/logo.png";
import back from "/back1.png";
import { Link, useLocation, useNavigate, useMatch } from "react-router-dom";
import { useLoading } from "../../LoadingContext";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  // const { isLoading } = useLoading();

  const isLandingPage = location.pathname === "/";
  const isAbout = location.pathname === "/about";
  const isRelaxPage = location.pathname === "/relax";
  const isColoringPage = location.pathname === "/coloring";
  const isCanvasPage = useMatch("/canvas/:imageSrc");
  const isCommunicationPage = location.pathname === "/communication";
  const isMemoryPage = location.pathname === "/memory";
  const isConnectPage = location.pathname === "/connect";
  const isGamesPage = location.pathname === "/games";
  const isMenuPage = location.pathname === "/menu";
  const isLoginPage = location.pathname === "/login";
  const isDownloadApp = location.pathname === "/app";

  const showBackButton =
    isCommunicationPage ||
    isColoringPage ||
    isRelaxPage ||
    isCanvasPage ||
    isMemoryPage ||
    isGamesPage ||
    isConnectPage;

  // const handleLogoClick = () => {
  //   if (showBackButton) {
  //     //window.history.length > 1
  //     navigate(-1); // unmount the previuos component
  //   } else {
  //     // at menu page
  //     navigate("/");
  //   }
  // };

  const handleLogoClick = () => {
    if (location.pathname.startsWith("/canvas/")) {
      window.dispatchEvent(new Event("save-coloring-progress"));
      setTimeout(() => navigate(-1), 50); // give the event a moment to finish
    } else if (showBackButton) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  function renderLogo() {
    return (
      <div className="navbar-logo-container">
        <div className="navbar-logo-circle">
          <img
            src={showBackButton ? back : logo}
            alt={showBackButton ? "Назад" : "Лого"}
            className={`navbar-logo-image ${
              showBackButton ? "back-button-image" : ""
            } ${isMenuPage ? "no-pointer" : ""}`}
            onClick={showBackButton ? handleLogoClick : undefined}
          />
        </div>
      </div>
    );
  }

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
        {showBackButton ? (
          renderLogo()
        ) : isLandingPage || isAbout || isLoginPage || isDownloadApp ? (
          <Link to="/" className="navbar-home-link">
            {renderLogo()}
            <div className="navbar-brand">Виножито</div>
          </Link>
        ) : (
          <>
            {renderLogo()}
            {isMenuPage && <div className="navbar-brand">Виножито</div>}
          </>
        )}

        <ul className="navbar-links">
          {(isLandingPage || isAbout || isDownloadApp) && (
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
