import React, { useState } from "react";
import "./MainFeatures.css";
import Phone from "./Phone";
import { MainFeatures } from "../data";
import grey from "/grey.svg";

const FeatureSelector = () => {
  const [selectedFeature, setSelectedFeature] = useState(null);

  const handleSelect = (id) => {
    setSelectedFeature(id);
  };

  const selectedFeatureData = MainFeatures.find((f) => f.id === selectedFeature);

  return (
    <div className="feature-container">
      <div className="features left-features">
        {MainFeatures.slice(0, 3).map((feature) => (
          <div
            key={feature.id}
            className={`feature-item ${selectedFeature === feature.id ? "selected" : ""}`}
            onClick={() => handleSelect(feature.id)}
            style={{ textAlign: feature.alignment }} 
          >
            <div
              className="feature-icon"
              style={{
                borderColor: feature.borderColor,
                backgroundColor: selectedFeature === feature.id ? feature.borderColor : "#ffffff",
              }}
            >
              <img
                src={feature.icon}
                alt={feature.name}
                className="icon-image"
                style={{
                  width: `${feature.size}px`, 
                  height: `${feature.size}px`,
                  paddingLeft: feature.paddingLeft ? `${feature.paddingLeft}px` : "0", // Add paddingLeft if specified
                  paddingTop: feature.paddingTop ? `${feature.paddingTop}px` : "0",
                }}
              />
            </div>
            <div className="feature-text">
              <h3 className="feature-title">{feature.name}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="phone-container">
        <Phone
          image={selectedFeatureData?.screen}
          background={selectedFeatureData?.background || grey}        />
      </div>

      <div className="features right-features">
        {MainFeatures.slice(3).map((feature) => (
          <div
            key={feature.id}
            className={`feature-item ${selectedFeature === feature.id ? "selected" : ""}`}
            onClick={() => handleSelect(feature.id)}
            style={{ textAlign: feature.alignment }}
          >
            <div className="feature-text">
              <h3 className="feature-title">{feature.name}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
            <div
              className="feature-icon"
              style={{
                borderColor: feature.borderColor,
                backgroundColor: selectedFeature === feature.id ? feature.borderColor : "#ffffff",
              }}
            >
              <img
                src={feature.icon}
                alt={feature.name}
                className="icon-image"
                style={{
                  width: `${feature.size}px`, 
                  height: `${feature.size}px`,
                  paddingLeft: feature.paddingLeft ? `${feature.paddingLeft}px` : "0", 
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureSelector;