import React, { useState, useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
// import * as blobs2 from "blobs/v2";
import { svgPath } from "blobs/v2";

const generateBlobPath = () => {
  try {
    const path = svgPath({
      seed: Math.random(),
      extraPoints: 8,
      randomness: 4,
      size: 230,
    });

    if (typeof path === "string" && /^M\s*\d/.test(path)) {
      return path;
    }
  } catch (e) {
    console.error("Error generating blob path:", e);
  }

  return "M 0 0 L 100 0 L 100 100 L 0 100 Z";
};

const Blob = ({
  color = "#F7A7B6",
  label = "",
  imageUrl = "",
  hoverVideo = null,
  pauseTime = null,
  size = 200,
  contentSize = 1,
  bottomPadding = "0px",
  leftPadding = "0px",
  overflowVisible = true,
  noShadow = false,
}) => {
  const [path1] = useState(generateBlobPath());
  const [path2] = useState(generateBlobPath());
  const [current, setCurrent] = useState(true);
  const controls = useAnimation();
  const videoRef = useRef(null);
  const [hovering, setHovering] = useState(false);
  const isMountedRef = useRef(true); // track mount state with ref

  // blob morphing loop -> prevent memory leak
  useEffect(() => {
    isMountedRef.current = true;
    const currentRef = { current }; // capture current value in ref

    const loop = async () => {
      await new Promise((resolve) => requestAnimationFrame(resolve));

      while (isMountedRef.current) {
        const targetPath = currentRef.current ? path2 : path1;

        if (typeof targetPath === "string" && targetPath.startsWith("M")) {
          await controls
            .start({
              d: targetPath,
              transition: { duration: 6, ease: "easeInOut" },
            })
            .catch(() => {}); // silence cancellation errors
        }

        if (isMountedRef.current) {
          setCurrent((prev) => {
            currentRef.current = !prev; // update ref with new value
            return !prev;
          });
        }
      }
    };

    loop();

    return () => {
      isMountedRef.current = false;
    };
  }, [path1, path2, controls]);

  // pause hover video logic
  useEffect(() => {
    let checkInterval = null;

    if (hovering && videoRef.current && typeof pauseTime === "number") {
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
  }, [hovering, pauseTime]);

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

  //console.log({ path1, path2, pauseTime, imageUrl, hoverVideo }); // for testing

  const selectedPath = current ? path1 : path2;

  const isValidPath =
    typeof selectedPath === "string" && selectedPath.startsWith("M"); // ensure valid path
  const fallbackPath = "M 0 0 L 100 0 L 100 100 L 0 100 Z";

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
          {!noShadow && (
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
          )}

          <motion.path
            fill={color}
            d={isValidPath ? selectedPath : fallbackPath}
            animate={controls}
            filter={noShadow ? undefined : "url(#blobShadow)"}
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
              height: `${contentSize * 70}%`,
              ...(contentSize > 1
                ? {
                    maxWidth: "none",
                    maxHeight: "none",
                    transform: "translateZ(0)", // prevent clipping in some browsers
                  }
                : {}),
            }}
          >
            {hoverVideo ? (
              <video
                ref={videoRef}
                src={hoverVideo}
                className="w-full max-w-full max-h-full object-contain z-10"
                style={{
                  ...(bottomPadding !== "0px" && {
                    paddingBottom: bottomPadding,
                  }),
                  ...(leftPadding !== "0px" && { paddingLeft: leftPadding }),

                  transform: contentSize > 1 ? `scale(${contentSize})` : "none", // scale up if contentSize > 1
                }}
                muted
                playsInline
                preload="auto"
                // loop
                aria-hidden="true"
                tabIndex={-1}
              />
            ) : (
              <img
                src={imageUrl}
                alt={label}
                className="w-full h-full object-contain"
                draggable={false}
                style={{
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
