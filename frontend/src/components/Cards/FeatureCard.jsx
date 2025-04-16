import React from "react";
import "./FeatureCard.css";

export default function FeatureCard({ image, title, description, index }) {
  const colors = ["color1", "color2", "color3"];
  const colorClass = `feature-card-${colors[index % colors.length]}`;

  return (
    <li className={`feature-card ${colorClass}`}>
      <div className="feature-card-image-container">
        <img src={image} alt={title} className="feature-card-image" />
      </div>

      <div className="feature-card-text">
        <h3 className="feature-card-title">{title}</h3>
        <p className="feature-card-description">{description}</p>
      </div>
    </li>
  );
}
