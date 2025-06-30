import React from "react";
import { useNavigate } from "react-router-dom";
import Blob from "../../components/Blob.jsx";
import Banner from "../../components/Banner/Banner.jsx";
import "./BackgroundDetails.css";
import Title from "../../components/Title/Title.jsx";

import ErrorBoundary from "../../components/ErrorBoundary.jsx";

// import memoryImg from "/memory_start.png";
// import memoryHover from "/memory_hover.webm";

import connect from "/bee3d.png";
import connect_hover from "/bee4.webm";

import memImg from "/crads-first.png";
import memHover from "/cards2.webm";

const gameBlobs = [
  {
    color: "#fcb573",
    label: "меморија",
    imageUrl: memImg,
    hoverVideo: memHover,
    pauseTime: 0.2,
    size: 200,
    contentSize: 1.8,
    bottomPadding: "10px",
  },
  {
    color: "#81C184",
    label: "поврзување",
    imageUrl: connect,
    hoverVideo: connect_hover,
    pauseTime: 0.65,
    size: 220,
    contentSize: 1.7,
    bottomPadding: "0px",
  },
];

const GamesMenu = () => {
  const navigate = useNavigate();

  const handleClick = (index) => {
    if (index === 0) navigate("/memory");
    if (index === 1) navigate("/connect");
  };

  return (
    <div>

      <Banner>
        <Title>Виножито</Title>
      </Banner>

      <div className="menu-page">
     
      
      <section className="w-full py-6 px-4 overflow-hidden">
        <div className="flex flex-col items-center">
          <div className="grid grid-cols-2 gap-10 max-w-[800px] w-full justify-items-center">
            {gameBlobs.map((blob, idx) => (
              <div
                key={`game-blob-${idx}`}
                className="flex justify-center"
                onClick={() => handleClick(idx)}
                style={{ cursor: "pointer" }}
              >
                <ErrorBoundary>
                  <Blob {...blob} />
                </ErrorBoundary>
              </div>
            ))}
          </div>
        </div>
      </section></div>
    </div>
  );
};

export default GamesMenu;
