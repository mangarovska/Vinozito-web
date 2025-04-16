import React, { useState, useEffect } from "react";
import "./MainFeatures.css";
import Phone from "../Phone";
import { MainFeatures } from "../../data";
import grey from "/grey.svg";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const FeatureSelector = () => {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [hasSelected, setHasSelected] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (selectedFeature) {
      const index = MainFeatures.findIndex((f) => f.id === selectedFeature);
      if (index !== -1) setCarouselIndex(index);
    }
  }, [selectedFeature]);

  const handleSelect = (id) => {
    setSelectedFeature(id);
    setHasSelected(true);
  };

  const handlePrev = () => {
    if (transitioning) return;
    setTransitioning(true);
    const newIndex =
      (carouselIndex - 1 + MainFeatures.length) % MainFeatures.length;
    setCarouselIndex(newIndex);
    if (hasSelected) setSelectedFeature(MainFeatures[newIndex].id);
    setTimeout(() => setTransitioning(false), 300);
  };

  const handleNext = () => {
    if (transitioning) return;
    setTransitioning(true);
    const newIndex = (carouselIndex + 1) % MainFeatures.length;
    setCarouselIndex(newIndex);
    if (hasSelected) setSelectedFeature(MainFeatures[newIndex].id);
    setTimeout(() => setTransitioning(false), 300);
  };

  const getVisibleFeatures = () => {
    return [-1, 0, 1].map((offset) => {
      const index =
        (carouselIndex + offset + MainFeatures.length) % MainFeatures.length;
      return { ...MainFeatures[index], position: offset };
    });
  };

  const selectedFeatureData =
    MainFeatures.find((f) => f.id === selectedFeature) || {};

  if (isMobile) {
    const visibleFeatures = getVisibleFeatures();

    return (
      <div className="mobile-feature-container">
        <div className="mobile-carousel">
          <button className="carousel-arrow left" onClick={handlePrev}>
            <FaChevronLeft />
          </button>

          <div className="mobile-features-viewport">
            <div
              className={`mobile-features-track ${
                transitioning ? "transitioning" : ""
              }`}
            >
              {visibleFeatures.map((feature, index) => (
                <div
                  key={`${feature.id}-${feature.position}`}
                  className={`mobile-feature-item ${
                    hasSelected && selectedFeature === feature.id
                      ? "center"
                      : ""
                  }`}
                  onClick={() => {
                    if (!hasSelected) setHasSelected(true);
                    setSelectedFeature(feature.id);
                  }}
                >
                  <div
                    className="mobile-feature-icon"
                    style={{
                      borderColor: feature.borderColor,
                      backgroundColor:
                        selectedFeature === feature.id
                          ? feature.borderColor
                          : "#ffffff",
                    }}
                  >
                    <img
                      src={feature.icon}
                      alt={feature.name}
                      className="mobile-icon-image"
                      style={{
                        // width: `${feature.size}px`,
                        // height: `${feature.size}px`,
                        paddingLeft: feature.paddingLeft
                          ? `${feature.paddingLeft}px`
                          : "0",
                        paddingTop: feature.paddingTop
                          ? `${feature.paddingTop}px`
                          : "0",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="carousel-arrow right" onClick={handleNext}>
            <FaChevronRight />
          </button>
        </div>

        <div className="mobile-feature-text-container">
          <h3 className="mobile-feature-title">{selectedFeatureData?.name}</h3>
          <p className="mobile-feature-description">
            {selectedFeatureData?.description}
          </p>
        </div>

        <div className="mobile-phone-container">
          <Phone
            image={selectedFeatureData?.screen}
            background={selectedFeatureData?.background || grey}
          />
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="feature-container">
      <div className="features left-features">
        {MainFeatures.slice(0, 3).map((feature) => (
          <div
            key={feature.id}
            className={`feature-item ${
              selectedFeature === feature.id ? "selected" : ""
            }`}
            onClick={() => handleSelect(feature.id)}
            style={{ textAlign: feature.alignment }}
          >
            <div
              className="feature-icon"
              style={{
                borderColor: feature.borderColor,
                backgroundColor:
                  selectedFeature === feature.id
                    ? feature.borderColor
                    : "#ffffff",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = feature.borderColor)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor =
                  selectedFeature === feature.id
                    ? feature.borderColor
                    : "#ffffff")
              }
            >
              <img
                src={feature.icon}
                alt={feature.name}
                className="icon-image"
                style={{
                  width: `${feature.size}px`,
                  height: `${feature.size}px`,
                  paddingLeft: feature.paddingLeft
                    ? `${feature.paddingLeft}px`
                    : "0",
                  paddingTop: feature.paddingTop
                    ? `${feature.paddingTop}px`
                    : "0",
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
          background={selectedFeatureData?.background || grey}
        />
      </div>

      <div className="features right-features">
        {MainFeatures.slice(3).map((feature) => (
          <div
            key={feature.id}
            className={`feature-item ${
              selectedFeature === feature.id ? "selected" : ""
            }`}
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
                backgroundColor:
                  selectedFeature === feature.id
                    ? feature.borderColor
                    : "#ffffff",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = feature.borderColor)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor =
                  selectedFeature === feature.id
                    ? feature.borderColor
                    : "#ffffff")
              }
            >
              <img
                src={feature.icon}
                alt={feature.name}
                className="icon-image"
                style={{
                  width: `${feature.size}px`,
                  height: `${feature.size}px`,
                  paddingLeft: feature.paddingLeft
                    ? `${feature.paddingLeft}px`
                    : "0",
                  paddingTop: feature.paddingTop
                    ? `${feature.paddingTop}px`
                    : "0", // paddingTop
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
