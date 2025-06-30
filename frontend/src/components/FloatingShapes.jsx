import React from "react";
import "./FloatingShapes.css";

const shapes = [
  {
    className: "sparkle",
    style: {
      top: "5vh",
      left: "57vw",
      transform: "rotate(0deg)",
    },
  },
  {
    className: "wavy-circle",
    style: {
      bottom: "50vh", // stays at same height regardless of content
      right: "5vw",
      width: "140px",
      transform: "rotate(-20deg)",
    },
  },
  {
    className: "arc",
    style: {
      top: "10vh",
      right: "-5vw", // goes fully off-screen when needed
      width: "170px",
      transform: "rotate(45deg)",
    },
    hideOnMobile: true,
  },
  {
    className: "grid-lines",
    style: {
      top: "20vh", // use vh not 110vh if you want it to stay inside
      left: "22vw",
      width: "227px",
      height: "227px",
      transform: "rotate(70deg)",
    },
  },
];

const FloatingShapes = () => {
  return (
    <div className="floating-shapes">
      {shapes.map((shape, index) => (
        <div
          key={index}
          className={`floating-shape ${shape.className} ${
            shape.hideOnMobile ? "hide-mobile" : ""
          }`}
          style={shape.style}
        />
      ))}
    </div>
  );
};

export default FloatingShapes;
