import React, { useState, useEffect } from "react";
import { FaFacebookF, FaGoogle } from "react-icons/fa";
import Banner from "../components/Banner/Banner";
import "./LoginPage.css";

export default function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  

  return (
    <div className="login-background">
      <Banner className="banner-background" />

      <div className="login-page">
        <div className={`flip-container ${isRegistering ? "flipped" : ""}`}>
          <div className="flipper">
            
            {/* FRONT: LOGIN */}
            <div className="login-card front">
              <div className="card-top-circle">
                <img src="bounce.gif" alt="Logo" />
              </div>
              <h2>Најави се</h2>
              <form>
                <label htmlFor="email">Е-пошта</label>
                <input type="email" placeholder="example@mail.com" required />

                <label htmlFor="password">Лозинка</label>
                <input type="password" placeholder="********" required />

                <div className="remember-forgot">
                  <label className="custom-checkbox">
                    <input type="checkbox" />
                    <span className="checkmark"></span>
                    <span className="checkbox-label-text">Запамти ме</span>
                  </label>
                  <a href="/forgot-password">Заборавена Лозинка ?</a>
                </div>

                <button className="submit-button">Најави се</button>
              </form>

              <div className="divider"><span>или</span></div>

              <div className="social-buttons">
                <button className="social-icon google"><FaGoogle size={44} /></button>
                <button className="social-icon facebook"><FaFacebookF size={44} /></button>
              </div>

              <div className="signup-link switch-link ">
                Немате профил?{" "}
                <a onClick={() => setIsRegistering(true)}>Регистрирај се</a>

              </div>
            </div>

            {/* BACK: REGISTER */}
            <div className="login-card back">
              <div className="card-top-circle">
                <img src="bounce.gif" alt="Logo" />
              </div>
              <h2>Регистрирај се</h2>
              <form className="register-form">
                <label htmlFor="username">Корисничко име</label>
                <input type="text" placeholder="корисник123" required />

                <label htmlFor="email">Е-пошта</label>
                <input type="email" placeholder="пример@mail.com" required />

                <label htmlFor="password">Лозинка</label>
                <input type="password" placeholder="********" required />

                <label className="custom-checkbox">
                  <input type="checkbox" required />
                  <span className="checkmark"></span>
                  <span className="checkbox-label-text">
                    Ги прифаќам условите
                  </span>
                </label>

                <button className="submit-button register-button">Регистрирај се</button>
              </form>

              <div className="divider"><span>или</span></div>

              <div className="social-buttons">
                <button className="social-icon google"><FaGoogle size={20} /></button>
                <button className="social-icon facebook"><FaFacebookF size={20} /></button>
              </div>

              <div className="signup-link switch-link">
                Веќе имате профил?{" "}
                <a className="register-link" onClick={() => setIsRegistering(false)}>Најави се</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
