import React, { useState, useRef, useEffect } from "react";
import "./Navbar.css";
import logo from "/logo.png";
import back from "/back1.png";
import { Link, useLocation, useNavigate, useMatch } from "react-router-dom";
import Padlock from "./Padlock";

import placeholderImg from "/placeholder2.png";

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

  const [profilePic, setProfilePic] = useState(placeholderImg);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  // loads the initial profile picture
  useEffect(() => {
    const savedPic = localStorage.getItem("profilePic");
    if (savedPic && savedPic !== "null" && savedPic !== "undefined") {
      setProfilePic(savedPic);
    } else {
      setProfilePic(placeholderImg);
    }
  }, []);

  useEffect(() => {
    function handleProfilePicChange() {
      const savedPic = localStorage.getItem("profilePic");
      if (savedPic && savedPic !== "null" && savedPic !== "undefined") {
        setProfilePic(savedPic);
      } else {
        setProfilePic(placeholderImg);
      }
    }

    window.addEventListener("profilePicChanged", handleProfilePicChange);
    return () => {
      window.removeEventListener("profilePicChanged", handleProfilePicChange);
    };
  }, []);

  function showPadlockMessage(message) {
    setPadlockMessage(message);
    padlockMessageTimeoutRef.current = setTimeout(() => {
      setPadlockMessage(null);
      padlockMessageTimeoutRef.current = null;
    }, 2000);
  }

  const handlePadlockClick = () => {
    const now = Date.now();
    if (now - lastClickTime < 250) return;

    setLastClickTime(now);

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

      clickResetTimerRef.current = setTimeout(() => {
        setClickCount(0);
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
  const isEditProfile = location.pathname === "/profile/edit";

  // ✅ New combined flag
  const isEditCardsPage = isParentPage || isEditProfile;

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
    if (isEditCardsPage) {
      navigate("/menu"); // ✅ always go to kids menu
    } else if (isCanvasPage) {
      if (window.hasUnsavedCanvasChanges) {
        const confirmEvent = new CustomEvent("confirm-canvas-back", {
          detail: {
            onConfirm: (shouldSave) => {
              if (shouldSave) {
                window.dispatchEvent(new Event("save-coloring-progress"));
              }
              navigate(-1);
            },
          },
        });
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
          } ${isMenuPage ? "no-pointer" : ""}`} // prevent pointer in menu
          onClick={
            isMenuPage ? undefined : handleLogoClick // 🚀 disable click in menu
          }
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
          isEditCardsPage ? ( 
          <div className="navbar-home-link" onClick={() => navigate("/menu")}>
            {renderLogo()}
            <div className="navbar-brand">Виножито</div>
          </div>
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
                <Link to="/" className="">
                  Дома
                </Link>
              </li>
              <li>
                <Link to="/about" className="">
                  За нас
                </Link>
              </li>
            </>
          )}
          {!isLandingPage &&
          !isAbout &&
          !isLoginPage &&
          !isDownloadApp &&
          !isParentPage &&
          !isEditProfile ? (
            <div className="lock-wrapper">
              <li
                className={`login-button ${
                  !isLandingPage &&
                  !isAbout &&
                  !isLoginPage &&
                  !isDownloadApp &&
                  !isParentPage &&
                  !isEditProfile
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

                {username ? (
                  <div
                    className={`parent-profile ${
                      !isUnlocked ? "disabled" : ""
                    }`}
                    onClick={(e) => {
                      if (!isUnlocked) return;
                      setShowDropdown(!showDropdown);
                    }}
                  >
                    <img
                      src={profilePic || placeholderImg}
                      alt="Profile"
                      className="profile-image"
                    />
                    <span className="greeting-text username-text">
                      {username}
                    </span>
                    {/* <span className="dropdown-icon"></span> */}
                    <span
                      className={`dropdown-icon ${
                        showDropdown ? "rotated" : ""
                      }`}
                    ></span>

                    {showDropdown && isUnlocked && (
                      <div className="dropdown-menu" ref={dropdownRef}>
                        <button
                          onClick={() => {
                            setShowDropdown(false);
                            navigate("/parent");
                          }}
                        >
                          Мои картички
                        </button>
                        {/* <button
                          onClick={() => {
                            setShowDropdown(false);
                            navigate("/analytics");
                          }}
                        >
                          Анализа
                        </button> */}
                        {/* <button
                          onClick={() => {
                            setShowDropdown(false);
                            navigate("/profile");
                          }}
                        >
                          Уреди профил
                        </button> */}
                        <button onClick={() => navigate("/profile/edit")}>
                          Уреди профил
                        </button>

                        <button
                          onClick={() => {
                            localStorage.removeItem("token");
                            localStorage.removeItem("username");
                            localStorage.removeItem("profilePic");
                            setShowDropdown(false);
                            navigate("/login");
                          }}
                        >
                          Одјави се
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className={!isUnlocked ? "disabled" : ""}
                    onClick={(e) => {
                      if (!isUnlocked) e.preventDefault();
                    }}
                  >
                    Најави се
                  </Link>
                )}
              </li>
            </div>
          ) : username ? (
            <li className="parent-dropdown">
              <div
                className="parent-profile"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <img
                  src={profilePic || placeholderImg}
                  alt="Profile"
                  className="profile-image"
                />
                <span className="greeting-text username-text">{username}</span>
                {/* <span className="dropdown-icon"></span> */}
                <span
                  className={`dropdown-icon ${showDropdown ? "rotated" : ""}`}
                ></span>
              </div>
              {showDropdown && (
                <div className="dropdown-menu" ref={dropdownRef}>
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      navigate("/parent");
                    }}
                  >
                    Мои картички
                  </button>
                  {/* <button
                    onClick={() => {
                      setShowDropdown(false);
                      navigate("/analytics");
                    }}
                  >
                    Анализа
                  </button> */}
                  <button onClick={() => navigate("/profile/edit")}>
                    Уреди профил
                  </button>
                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("username");
                      localStorage.removeItem("profilePic");
                      setShowDropdown(false);
                      navigate("/login");
                    }}
                  >
                    Одјави се
                  </button>
                </div>
              )}
            </li>
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
