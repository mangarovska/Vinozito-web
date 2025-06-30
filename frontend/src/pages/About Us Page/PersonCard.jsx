// PersonCard.js
import React from "react";
import "./PersonCard.css";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaEnvelope,
} from "react-icons/fa";

const PersonCard = ({ name, title, description, image }) => (
  <div className="profile-card">
    <div className="flower-wrapper">
      <div className="flower-border">
        <div
          className="flower"
          style={{ backgroundImage: `url(${image})` }}
        ></div>
      </div>
    </div>
    <div className="profile-info">
      <h2>{name}</h2>
      {title && <p className="profile-title">{title}</p>}
      {description && <p className="profile-desc">{description}</p>}
      <div className="profile-socials mt-8">
        <a href="#" aria-label="Facebook">
          <FaFacebookF />
        </a>
        {/* <a href="#" aria-label="Twitter"><FaTwitter /></a> */}
        {/* <a href="#" aria-label="Instagram"><FaInstagram /></a> */}
        <a href="#" aria-label="E-mail">
          <FaEnvelope />
        </a>
        <a href="#" aria-label="LinkedIn">
          <FaLinkedinIn />
        </a>
      </div>
    </div>
  </div>
);

export default PersonCard;
