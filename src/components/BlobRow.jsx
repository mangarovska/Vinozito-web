import React from "react";
import AnimatedBlob from "./Blob";
import "./BlobRow.css"; // just in case 

import speak_hover from "/speakerNew.webm";
import staticImage from "/speakerImg_start.png";

import paint from "/paintbucket.png";

import connect from "/bee3d.png";
import connect_hover from "/beeee.webm";

import relax from "/jelly.png";

const blobsData = [
  {
    color: "#F7A7B6",
    label: "говор",
    imageUrl: staticImage,
    hoverVideo: speak_hover,
    pauseTime: 1.4,
    size: 300,
    // imageMiddle: staticImage_middle,
    // firstGif: speak_start, 
    // secondGif: speak_end,
  },
  {
    color: "#FDCF72",
    label: "боење",
    imageUrl: paint,
    size: 300,
    
  },
  {
    color: "#81C184",
    label: "поврзување",
    imageUrl: connect,
    hoverVideo: connect_hover,
    pauseTime: 0.4,
    size: 300,
  },
  {
    color: "#91D3DA",
    label: "релаксација",
    imageUrl: relax,
    size: 300,
  },
];

/**
 * 
 * sm: >= 640px
 * md: >= 768px
 * lg: >= 1024px
 * xl: >= 1280px
 * 
 */

const BlobsRow = () => {
  return (
    <section className="w-full h-full py-4 px-4 overflow-visible min-h-[80vh]">
      <div className="flex flex-col items-center">
        <div className="
        grid 
        grid-cols-2 
        gap-8 
        sm:gap-7 
        md:grid-cols-4 
        lg:gap-8
        xl:gap-10 
        max-w-[1200px] 
        w-full 
        justify-items-center">
          {blobsData.map((blob, idx) => (
            <div 
              key={`blob-${idx}`}
              className="flex justify-center min-w-[190px] sm:min-w-[180px]"
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