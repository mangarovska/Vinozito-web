import React, { useState, useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import * as blobs2 from "blobs/v2";

const generateBlobPath = () =>
  blobs2.svgPath({
    seed: Math.random(),
    extraPoints: 8,
    randomness: 4,
    size: 230,
  });

const Blob = ({
  color = "#F7A7B6",
  label = "",
  imageUrl = "",
  hoverVideo = null,
  pauseTime = null,
  size = 200, // Base blob size
  contentSize = 1, // Relative size of content (0-1)
  bottomPadding = "0px",
  overflowVisible = true,
}) => {
  const [path1] = useState(generateBlobPath());
  const [path2] = useState(generateBlobPath());
  const [current, setCurrent] = useState(true);
  const controls = useAnimation();
  const videoRef = useRef(null);
  const [hovering, setHovering] = useState(false);

  // Blob morphing loop
  useEffect(() => {
    const loop = async () => {
      while (true) {
        await controls.start({
          d: current ? path2 : path1,
          transition: { duration: 6, ease: "easeInOut" },
        });
        setCurrent((prev) => !prev);
      }
    };
    loop();
  }, [path1, path2, current, controls]);

  // Pause hover video logic
  useEffect(() => {
    let checkInterval = null;

    if (hovering && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();

      checkInterval = setInterval(() => {
        if (videoRef.current.currentTime >= pauseTime) {
          videoRef.current.pause();
          clearInterval(checkInterval);
        }
      }, 50);
    }

    return () => {
      clearInterval(checkInterval);
    };
  }, [hovering]);

  const handleMouseEnter = () => {
    setHovering(true);
  };

  const handleMouseLeave = () => {
    setHovering(false);
    if (videoRef.current) {
      videoRef.current.playbackRate = 3.0;
      videoRef.current.play();

      const handleEnd = () => {
        videoRef.current.currentTime = 0;
        videoRef.current.pause();
        videoRef.current.playbackRate = 1.0;
        videoRef.current.removeEventListener("ended", handleEnd);
      };

      videoRef.current.addEventListener("ended", handleEnd);
    }
  };

  // const contentWidth = `${contentSize * 100}%`;
  // const contentHeight = `${contentSize * 100}%`;

  return (
    <div className="group flex flex-col items-center w-full max-w-[300px] max-h-[300px]">
      <div
        className="relative w-full aspect-square max-w-[250px] min-w-[170px]"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={overflowVisible ? { overflow: "visible" } : {}}
      >
        <svg
          viewBox="0 0 240 270"
          className="w-full h-full block pointer-ev ents-none"
          style={overflowVisible ? { overflow: "visible" } : {}}
        >
          <defs>
            <filter
              id="blobShadow"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feDropShadow
                dx="4"
                dy="6"
                stdDeviation="6"
                floodColor="rgba(0,0,0,0.25)"
              />
            </filter>
          </defs>
          <motion.path
            fill={color}
            d={current ? path1 : path2}
            animate={controls}
            filter="url(#blobShadow)"
          />
        </svg>

        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          style={overflowVisible ? { overflow: "visible" } : {}}
        >
          <div
            className="flex items-center justify-center"
            style={{
              width: `${contentSize * 100}%`,
              height: `${contentSize * 100}%`,
              // Remove maxWidth/maxHeight constraints when contentSize > 1
              ...(contentSize > 1
                ? {
                    maxWidth: "none",
                    maxHeight: "none",
                    transform: "translateZ(0)", // Prevent clipping in some browsers
                  }
                : {}),
            }}
          >
            {hoverVideo ? (
              <video
                ref={videoRef}
                src={hoverVideo}
                className="w-full h-full object-contain z-10"
                style={{
                  paddingBottom: bottomPadding,
                  // Scale up if contentSize > 1
                  transform: contentSize > 1 ? `scale(${contentSize})` : "none",
                }}
                muted
                playsInline
                preload="auto"
              />
            ) : (
              <img
                src={imageUrl}
                alt={label}
                className="w-full h-full object-contain"
                draggable={false}
                style={{
                  // Scale up if contentSize > 1
                  transform: contentSize > 1 ? `scale(${contentSize})` : "none",
                }}
              />
            )}
          </div>
        </motion.div>
      </div>

      <p className="text-lg sm:text-xl font-semibold text-gray-700 text-center mt-2 drop-shadow-sm">
        {label}
      </p>
    </div>
  );
};

export default Blob;
