import React from "react";
import './FeatureCard.css';

export default function FeatureCard({ image, title, description }) {
    return (
        <li className="feature-card">
            <img src={image} alt={title} className="feature-card-image" />
            <p className="feature-card-description">{description}</p>
        </li>
    );
}