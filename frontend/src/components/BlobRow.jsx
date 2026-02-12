import React from "react";
import { useNavigate } from "react-router-dom";
import Blob from "./Blob.jsx";
import "./BlobRow.css";

import ErrorBoundary from "./ErrorBoundary.jsx"; // adjust the path as needed

import speak_hover from "/menu-assets/video/speakerNew.webm";
import staticImage from "/menu-assets/speakerImg_start.png";

import paint from "/menu-assets/paint_start.png";
import paint_hover from "/menu-assets/video/paint_fin.webm";

// import connect from "/bee3d.png";
// import connect_hover from "/bee4.webm";

import connect from "/menu-assets/puzzle_start.png";
import connect_hover from "/menu-assets/video/puzzle2.webm";

import relax from "/menu-assets/jelly.png";
import relax_hover from "/menu-assets/video/jelly3.webm";

const blobsData = [
  {
    color: "#F7A7B6",
    label: "говор",
    imageUrl: staticImage,
    hoverVideo: speak_hover,
    pauseTime: 1.4,
    size: 300,
    contentSize: 1.18,
    bottomPadding: "20px",
  },
  {
    color: "#FDCF72",
    label: "боење",
    imageUrl: paint,
    hoverVideo: paint_hover,
    pauseTime: 0.8,
    size: 200,
    contentSize: 1.65,
    bottomPadding: "0px",
    leftPadding: "8px",
  },
  {
    color: "#c6a6ee",
    label: "забава",
    imageUrl: connect,
    hoverVideo: connect_hover,
    pauseTime: 0.65,
    size: 220,
    contentSize: 1.75, // relative size of content
    bottomPadding: "25px",
    leftPadding: "12 px",
  },
  {
    color: "#91D3DA",
    label: "релаксација",
    imageUrl: relax,
    hoverVideo: relax_hover,
    pauseTime: 0.65,
    size: 200,
    contentSize: 1.8,
    bottomPadding: "20px",
    overflowVisible: true,
  },
];

const BlobsRow = () => {
  const navigate = useNavigate();

  const handleBlobClick = (index) => {
    if (index === 0) {
      navigate("/communication");
    }
    if (index === 2) {
      navigate("/games");
    }
    if (index === 3) {
      navigate("/relax");
    }
    if (index === 1) {
      navigate("/coloring");
    }
  };

  return (
    <section className="w-full py-6 px-4 overflow-hidden">
      <div className="flex flex-col items-center">
        <div className="blob-row-grid grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 max-w-[1200px] w-full justify-items-center">
          {blobsData.map((blob, idx) => (
            <div
              key={`blob-${idx}`}
              className="flex justify-center" // min-w-[190px] sm:min-w-[180px]
              onClick={() => handleBlobClick(idx)}
              style={{ cursor: "pointer" }}
            >
              <ErrorBoundary>
                <Blob {...blob} />
              </ErrorBoundary>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlobsRow;
