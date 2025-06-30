import React from "react";
import "./Newsletter.css";
import envelopeIcon from "../../assets/mail.png"; 

const Newsletter = () => {
  return (
    <div className="newsletter-wrapper">
    <section className="newsletter">
      <div className="newsletter-content">
        <img
          src={envelopeIcon}
          alt="Envelope with checkmark"
          className="newsletter-icon"
        />
        <div className="newsletter-text">
          <p className="newsletter-subtitle">Биди во тек со</p>
          <h2 className="newsletter-title">НАЈНОВИТЕ ВЕСТИ</h2>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <div className="newsletter-input-group">
              <input
                type="email"
                placeholder="е-пошта"
                required
                className="newsletter-input"
              />
              <button type="submit" className="newsletter-button">
                ПРИЈАВИ СЕ
              </button>
            </div>
          </form>
        </div>
      </div>
    </section></div>
  );
};

export default Newsletter;
