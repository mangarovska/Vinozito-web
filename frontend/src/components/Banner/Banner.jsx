import React from "react";
import "./Banner.css";

const Banner = ({ children, className = ""  }) => {
  return (
    <div className={`banner ${className}`}>
      {children}
    </div>
  );
};
export default Banner;