import React, { useEffect, useState } from "react";
import loading from "/loading.png";
import "./Phone.css";

const Phone = ({ image, background, video, animationKey, animationClass }) => {
  const defaultScreen = loading;
  const [animateClass, setAnimateClass] = useState("");

  useEffect(() => {
    setAnimateClass(""); // reset animation
    const timeout = setTimeout(() => setAnimateClass(animationClass), 10);
    return () => clearTimeout(timeout);
  }, [animationKey, animationClass]);

  return (
    <div className={`phone-wrapper ${animateClass}`}>
      {background && (
        <div className="background-layer">
          <img
            src={background}
            alt="Feature Background"
            className="background-img"
          />
        </div>
      )}

      <div className="phone-group">
        {/* Elliptical shadow */}
        <div className="phone-shadow" />

        <div className="phone-body">
          {/* Side buttons */}
          <span className="side-button top-1" />
          <span className="side-button top-2" />
          <span className="side-button bottom-1" />

          {/* Phone screen */}
          <div className="phone-screen">
            {video ? (
              <video
                src={video}
                autoPlay
                muted
                loop
                playsInline
                className="media"
              />
            ) : (
              <div
                className="media"
                style={{ backgroundImage: `url(${image || defaultScreen})` }}
              />
            )}

            <span className="notch" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Phone;
