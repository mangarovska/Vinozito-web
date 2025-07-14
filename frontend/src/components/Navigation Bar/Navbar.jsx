import React, { useState, useRef, useEffect } from "react";
import "./Navbar.css";
import logo from "/logo.png";
import back from "/back1.png";
import { Link, useLocation, useNavigate, useMatch } from "react-router-dom";
import Padlock from "./Padlock"; // Adjust path if needed

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [clickCount, setClickCount] = useState(0);
  const [padlockMessage, setPadlockMessage] = useState(null);
  const [hoverMessage, setHoverMessage] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const [lastClickTime, setLastClickTime] = useState(0);

  const isUnlocked = clickCount >= 4;

  const clickResetTimerRef = useRef(null);
  const padlockMessageTimeoutRef = useRef(null);

  function showPadlockMessage(message) {
    setPadlockMessage(message);

    // if (padlockMessageTimeoutRef.current) {
    //   clearTimeout(padlockMessageTimeoutRef.current);
    // }

    padlockMessageTimeoutRef.current = setTimeout(() => {
      setPadlockMessage(null);
      padlockMessageTimeoutRef.current = null;
    }, 2000);
  }

  const handlePadlockClick = () => {
    const now = Date.now();
    if (now - lastClickTime < 250) return; // debounce quick clicks

    setLastClickTime(now);

    // Reset click count timeout timer on every click
    if (clickResetTimerRef.current) {
      clearTimeout(clickResetTimerRef.current);
    }

    if (isUnlocked) {
      setClickCount(0);
      showPadlockMessage("Заклучено");
      return;
    }

    const nextCount = clickCount + 1;
    setClickCount(nextCount);

    if (nextCount < 4) {
      showPadlockMessage(
        `${4 - nextCount} клик${4 - nextCount === 1 ? "" : "а"} до отклучување`
      );

      // Reset click count after 5 seconds of inactivity
      clickResetTimerRef.current = setTimeout(() => {
        setClickCount(0);
        // Do NOT clear message here
      }, 5000);
    } else {
      showPadlockMessage("Отклучено");
    }
  };

  const handlePadlockHover = () => {
    setIsHovering(true);
    if (!padlockMessage) {
      setHoverMessage(isUnlocked ? "Заклучи" : "Отклучи");
    }
  };

  const handlePadlockLeave = () => {
    setIsHovering(false);
    setHoverMessage(null);
  };

  useEffect(() => {
    if (isHovering && !padlockMessage) {
      setHoverMessage(isUnlocked ? "Заклучи" : "Отклучи");
    }
  }, [isUnlocked, isHovering, padlockMessage]);

  // Define route flags
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
  const isParentPage = location.pathname === "/parent";

  const showBackButton =
    isCommunicationPage ||
    isColoringPage ||
    isRelaxPage ||
    isCanvasPage ||
    isMemoryPage ||
    isGamesPage ||
    isConnectPage;

  const username = localStorage.getItem("username");

  const handleLogoClick = () => {
    if (isCanvasPage) {
      if (window.hasUnsavedCanvasChanges) {
        const confirmEvent = new CustomEvent("confirm-canvas-back");
        window.dispatchEvent(confirmEvent);
      } else {
        navigate(-1);
      }
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
        ) : isLandingPage ||
          isAbout ||
          isLoginPage ||
          isDownloadApp ||
          isParentPage ? (
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
          {isParentPage ? (
            <li className="login-button parent-logout-section">
              <span className="greeting-text">
                Здраво{username ? `, ${username}` : ""}!
              </span>
              <Link
                to="/"
                onClick={(e) => {
                  e.preventDefault();
                  localStorage.removeItem("authToken");
                  localStorage.removeItem("username");
                  navigate("/login");
                }}
              >
                Одјави се
              </Link>
            </li>
          ) : !isLandingPage && !isAbout && !isLoginPage && !isDownloadApp ? (
            <div className="lock-wrapper">
              <li
                className={`login-button ${
                  !isLandingPage && !isAbout && !isLoginPage && !isDownloadApp
                    ? "with-padlock"
                    : ""
                }`}
              >
                <div
                  className="padlock-with-message"
                  onMouseEnter={handlePadlockHover}
                  onMouseLeave={handlePadlockLeave}
                >
                  <Padlock
                    clickCount={clickCount}
                    handleClick={handlePadlockClick}
                    isUnlocked={!isUnlocked}
                  />
                  {padlockMessage ? (
                    <div className="padlock-message below temporary">
                      {padlockMessage}
                    </div>
                  ) : hoverMessage ? (
                    <div className="padlock-message below persistent">
                      {hoverMessage}
                    </div>
                  ) : null}
                </div>

                <Link
                  to="/login"
                  className={!isUnlocked ? "disabled" : ""}
                  onClick={(e) => {
                    if (!isUnlocked) e.preventDefault();
                  }}
                >
                  Најави се
                </Link>
              </li>
            </div>
          ) : (
            <li className="login-button">
              <Link to="/login">Најави се</Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}
