import React from "react";
import { useNavigate } from "react-router-dom";
import AnimatedBlob from "./Blob";
import "./BlobRow.css";

import speak_hover from "/speakerNew.webm";
import staticImage from "/speakerImg_start.png";

import paint from "/p.png";
import paint_hover from "/p.webm";

import connect from "/bee3d.png";
import connect_hover from "/bee4.webm";

import relax from "/jelly.png";
import relax_hover from "/jelly3.webm";

const blobsData = [
  {
    color: "#F7A7B6",
    label: "говор",
    imageUrl: staticImage,
    hoverVideo: speak_hover,
    pauseTime: 1.4,
    size: 300,
    contentSize: 1,
    bottomPadding: "20px",
  },
  {
    color: "#FDCF72",
    label: "боење",
    imageUrl: paint,
    hoverVideo: paint_hover,
    pauseTime: 0.4,
    size: 200,
    contentSize: 1.87,
    bottomPadding: "0px",
  },
  {
    color: "#81C184",
    label: "поврзување",
    imageUrl: connect,
    hoverVideo: connect_hover,
    pauseTime: 0.65,
    size: 220,
    contentSize: 1.7, // Relative size of content (0-1)
    bottomPadding: "0px",
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
    if (index === 3) {
      navigate("/relax");
    }
  };

  return (
    <section className="w-full py-6 px-4 overflow-hidden">
      <div className="flex flex-col items-center">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 max-w-[1200px] w-full justify-items-center">
          {blobsData.map((blob, idx) => (
            <div
              key={`blob-${idx}`}
              className="flex justify-center " // min-w-[190px] sm:min-w-[180px]
              onClick={() => handleBlobClick(idx)}
              style={{ cursor: "pointer" }}
            >
              <AnimatedBlob {...blob} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlobsRow;
