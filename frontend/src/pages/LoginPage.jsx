import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaFacebookF,
  FaGoogle,
  FaEnvelope,
  FaLock,
  FaUser,
} from "react-icons/fa";
import Banner from "../components/Banner/Banner";
import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const [isRegistering, setIsRegistering] = useState(false);

  // const [loginEmail, setLoginEmail] = useState("");
  const [loginInput, setLoginInput] = useState(""); // email or username

  const [loginPassword, setLoginPassword] = useState("");

  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("mode") === "register") {
      setIsRegistering(true);
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/parent");
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:5100/api/user/protected", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Unauthorized");
      })
      .then((data) => alert(data.message))
      .catch(() => alert("Unauthorized"));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5100/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: loginInput,
        password: loginPassword,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Login successful!");
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      navigate("/parent");
    } else {
      alert(data.message || "Login failed");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5100/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: registerUsername,
        email: registerEmail,
        password: registerPassword,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Registration successful!");
      setIsRegistering(false);
    } else {
      alert(data.message || "Registration failed");
    }
  };

  return (
    <div className="login-background">
      <Banner className="banner-background" />
      <div className="login-page">
        <div className={`flip-container ${isRegistering ? "flipped" : ""}`}>
          <div className="flipper">
            {/* LOGIN */}
            <div className="login-card front">
              <div className="card-top-circle">
                <img src="bounce.gif" alt="Logo" />
              </div>
              <h2>Најави се</h2>
              <form onSubmit={handleLogin}>
                <label htmlFor="email">Е-пошта</label>
                <input
                  type="text"
                  placeholder="example@mail.com"
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  required
                />

                <label htmlFor="password">Лозинка</label>
                <input
                  type="password"
                  placeholder="********"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />

                <div className="remember-forgot">
                  <label className="custom-checkbox">
                    <input type="checkbox" />
                    <span className="checkmark"></span>
                    <span className="checkbox-label-text">Запамти ме</span>
                  </label>
                  <a href="/forgot-password">Заборавена Лозинка ?</a>
                </div>

                <button className="confirm-button-login submit-button">
                  Најави се
                </button>
              </form>

              <div className="divider">
                <span>или</span>
              </div>

              <div className="social-buttons">
                <button className="social-icon google">
                  <FaGoogle size={44} />
                </button>
                <button className="social-icon facebook">
                  <FaFacebookF size={44} />
                </button>
              </div>

              <div className="signup-link switch-link">
                Немате профил?{" "}
                <a onClick={() => setIsRegistering(true)}>Регистрирај се</a>
              </div>
            </div>

            {/* REGISTER */}
            <div className="login-card back">
              <div className="card-top-circle">
                <img src="bounce.gif" alt="Logo" />
              </div>
              <h2>Регистрирај се</h2>
              <form className="register-form" onSubmit={handleRegister}>
                <label htmlFor="username">Корисничко име</label>
                <input
                  type="text"
                  placeholder="корисник123"
                  value={registerUsername}
                  onChange={(e) => setRegisterUsername(e.target.value)}
                  required
                />

                <label htmlFor="login">Корисничко име / Е-пошта</label>
                <input
                  type="email"
                  placeholder="пример@mail.com"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                />

                <label htmlFor="password">Лозинка</label>
                <input
                  type="password"
                  placeholder="********"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                />

                <label className="custom-checkbox">
                  <input type="checkbox" required />
                  <span className="checkmark"></span>
                  <span className="checkbox-label-text">
                    Ги прифаќам условите
                  </span>
                </label>

                <button className="confirm-button-register submit-button register-button">
                  Регистрирај се
                </button>
              </form>

              <div className="divider">
                <span>или</span>
              </div>

              <div className="social-buttons">
                <button className="social-icon google">
                  <FaGoogle size={20} />
                </button>
                <button className="social-icon facebook">
                  <FaFacebookF size={20} />
                </button>
              </div>

              <div className="signup-link switch-link">
                Веќе имате профил?{" "}
                <a
                  className="register-link"
                  onClick={() => setIsRegistering(false)}
                >
                  Најави се
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
