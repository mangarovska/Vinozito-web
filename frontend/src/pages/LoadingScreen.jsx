import React from "react";
import "./LoadingScreen.css";
import loadingGif from "/f.gif";

export default function LoadingScreen() {
  return (
    <div className="loading-screen">
      <img src={loadingGif} alt="Loading..." className="loading-gif" />
    </div>
  );
}
