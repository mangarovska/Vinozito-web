import React, { useState, useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import * as blobs2 from "blobs/v2";

const generateBlobPath = () =>
  blobs2.svgPath({
    seed: Math.random(),
    extraPoints: 8,
    randomness: 4,
    size: 190,
  });

const Blob = ({
  color = "#F7A7B6",
  label = "",
  imageUrl = "",
  hoverVideo = null,
  pauseTime = null,
  size = 250, // default if not specified
  bottomPadding = "0px",
}) => {
  const [path1] = useState(generateBlobPath());
  const [path2] = useState(generateBlobPath());
  const [current, setCurrent] = useState(true);
  const controls = useAnimation();
  const videoRef = useRef(null);
  const [hovering, setHovering] = useState(false);
  //const pauseTime = 1.8; // Time (in seconds) to pause

  // Blob morphing animation loop
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

  // Pause logic loop
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
    // if (hoverVideo && videoRef.current) {
    //   videoRef.current.currentTime = 0;
    //   videoRef.current.play();
    // }
  };

  const handleMouseLeave = () => {
    setHovering(false);
    if (videoRef.current) {
      // Speed up the video to finish quickly
      videoRef.current.playbackRate = 3.0; // or 4.0 for super fast
      videoRef.current.play();
  
      const handleEnd = () => {
        videoRef.current.currentTime = 0;
        videoRef.current.pause();
        videoRef.current.playbackRate = 1.0; // reset speed
        videoRef.current.removeEventListener("ended", handleEnd);
      };
  
      videoRef.current.addEventListener("ended", handleEnd);
    }
  };
  

  return (
    <div className="group flex flex-col items-center max-w-[300px] w-full h-full">
      <div
        className="relative w-full aspect-[1/1.1] max-w-[220px] sm:max-w-[240px] md:max-w-[260px]" // max-w-[220px] max-h-[240px]
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <svg
          viewBox="0 0 200 230"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full pointer-events-none"
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
        >
          <div
            style={{ width: size, height: size }}
            className="sm:w-[80%] md:w-[70%] lg:w-[60%]"
          ></div>
          {hoverVideo ? (
            <video
              ref={videoRef}
              src={hoverVideo}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-contain pointer-events-none"
              muted
              playsInline
              preload="auto"
              style={{
                paddingBottom: bottomPadding,
                width: size * 1.5,
                height: size * 1.5,
                position: "absolute",

                // transform: "translate(-50%, -50%)",
                zIndex: 10,
              }}
            />
          ) : (
            <img
              src={imageUrl}
              alt={label}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-contain"
              draggable={false}
              style={{
                width: size,
                height: size,
              }}
            />
          )}
        </motion.div>
      </div>

      <p className="text-lg sm:text-xl font-semibold text-gray-700 text-center mt-2 drop-shadow-sm">
        {label}
      </p>
    </div>
  );
};

export default Blob;
