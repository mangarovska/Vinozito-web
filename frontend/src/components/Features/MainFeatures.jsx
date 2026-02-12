import React, { useState, useEffect, useRef } from "react";
import "./MainFeatures.css";
import Phone from "../Phone";
import { MainFeatures } from "../../data";
import grey from "/landing-assets/grey.svg";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const FeatureSelector = () => {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [hasSelected, setHasSelected] = useState(false);
  const [imageAnimationKey, setImageAnimationKey] = useState(0);
  const [slideDirection, setSlideDirection] = useState("slide-top-left");
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const directionMap = {
    feature1: "slide-top-left",
    feature2: "slide-left",
    feature3: "slide-bottom-left",
    feature4: "slide-top-right",
    feature5: "slide-right",
    feature6: "slide-bottom-right",
  };

  useEffect(() => {
    if (selectedFeature) {
      setImageAnimationKey((prev) => prev + 1);
      setSlideDirection(directionMap[selectedFeature] || "slide-top-left");
    }
  }, [selectedFeature]);

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

  useEffect(() => {
    if (transitioning) {
      const timeout = setTimeout(() => {
        setTransitioning(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [transitioning]);

  // Auto-select first feature on mobile if none selected
  useEffect(() => {
    if (isMobile && !hasSelected && MainFeatures.length > 0) {
      setSelectedFeature(MainFeatures[0].id);
      setHasSelected(true);
    }
  }, [isMobile, hasSelected]);

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
  };

  const handleNext = () => {
    if (transitioning) return;
    setTransitioning(true);
    const newIndex = (carouselIndex + 1) % MainFeatures.length;
    setCarouselIndex(newIndex);
    if (hasSelected) setSelectedFeature(MainFeatures[newIndex].id);
  };

  const handleDotClick = (index) => {
    if (transitioning || index === carouselIndex) return;
    setTransitioning(true);
    setCarouselIndex(index);
    if (hasSelected) setSelectedFeature(MainFeatures[index].id);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;
    if (diff > minSwipeDistance) {
      handleNext();
    } else if (diff < -minSwipeDistance) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const selectedFeatureData =
    MainFeatures.find((f) => f.id === selectedFeature) || {};

  if (isMobile) {
    return (
      <div className="mobile-feature-container">
        <div className="mobile-feature-text-container">
          <h3 className="mobile-feature-title">{selectedFeatureData?.name}</h3>
          <p className="mobile-feature-description">
            {selectedFeatureData?.description}
          </p>
        </div>

        <div 
          className="mobile-phone-carousel"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <button className="carousel-arrow left" onClick={handlePrev} aria-label="Previous feature">
            <FaChevronLeft />
          </button>

          <div className="mobile-phone-wrapper">
            <Phone
              image={selectedFeatureData?.screen}
              background={selectedFeatureData?.background || grey}
              animationKey={imageAnimationKey}
              animationClass={slideDirection}
            />
          </div>

          <button className="carousel-arrow right" onClick={handleNext} aria-label="Next feature">
            <FaChevronRight />
          </button>
        </div>

        <div className="mobile-carousel-dots">
          {MainFeatures.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === carouselIndex ? "active" : ""}`}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to feature ${index + 1}`}
            />
          ))}
        </div>
      </div>
    );
  }

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
          animationKey={imageAnimationKey}
          animationClass={slideDirection}
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
                    : "0",
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
