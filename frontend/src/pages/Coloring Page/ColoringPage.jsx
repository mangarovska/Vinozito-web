import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import "./ColoringPage.css";

const images = [
  "coloring/bug_fin.svg",
  "coloring/cake_fin.svg",
  "coloring/rocket_fin.svg",
  "coloring/candy_fin.svg",
  "coloring/rainbow_fin.svg",
  "coloring/flower_fin.svg",
  "coloring/butterfly_fin.svg",
  // "coloring/guitar.svg",
  "coloring/ice_fin.svg",
];

const tapeImages = [
  "coloring/tape/t11.png",
  "coloring/tape/t2.png",
  // "coloring/tape/t3.png",
  "coloring/tape/t4.png",
  "coloring/tape/t5.png",
  "coloring/tape/t8.png",
  "coloring/tape/t7.png",
  "coloring/tape/t9.png",
  "coloring/tape/t6.png",
  "coloring/tape/t10.png",
  "coloring/tape/t1.png",
  "coloring/tape/t12.png",
];

export default function ColoringPage() {
  const navigate = useNavigate();
  const [savedWorks, setSavedWorks] = useState([]);

  const loadSavedWorks = () => {
    const saved = [];
    images.forEach((img) => {
      const savedData = localStorage.getItem(`saved_${img}`);
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          // only add to saved if it's NOT cleared -> this ensures `savedWorks` only contains truly in-progress drawings.
          if (!parsedData.cleared) {
            saved.push({
              image: img,
              thumbnail: parsedData.drawing,
            });
          }
        } catch (error) {
          console.error(`Error parsing saved data for ${img}:`, error);
        }
      }
    });
    setSavedWorks(saved);
  };

  useEffect(() => {
    loadSavedWorks();

    const handleStorage = (e) => {
      if (e.key && e.key.startsWith("saved_")) {
        loadSavedWorks();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const getTapeImage = (index) => {
    return tapeImages[index % tapeImages.length];
  };

  const handleImageClick = (imageSrc) => {
    navigate(`/canvas/${encodeURIComponent(imageSrc)}`);
  };

  const handleContinueClick = (imageSrc, e) => {
    e.stopPropagation();
    navigate(`/canvas/${encodeURIComponent(imageSrc)}?continue=true`);
  };

  // handleClearImage is not directly used in the current render logic,
  // but it's good to keep if you have a "clear" button on this page.
  const handleClearImage = (clearedImageSrc) => {
    setSavedWorks((prev) =>
      prev.filter((work) => work.image !== clearedImageSrc)
    );
    // clear from localStorage directly if this function is used to clear from the gallery
    localStorage.removeItem(`saved_${clearedImageSrc}`);
  };

  return (
    <div className="custom-gradient relative h-screen overflow-hidden">
      <div className="absolute inset-0 z-0 cloud-container">
        {/* clouds */}
        <div className="cloud continuous x1"></div>
        <div
          className="cloud continuous x2"
          style={{ animationDelay: "3s" }}
        ></div>
        <div
          className="cloud continuous x3"
          style={{ animationDelay: "6s" }}
        ></div>
        <div
          className="cloud continuous x4"
          style={{ animationDelay: "9s" }}
        ></div>
        <div
          className="cloud continuous x5"
          style={{ animationDelay: "12s" }}
        ></div>
        <div
          className="cloud continuous x6"
          style={{ animationDelay: "15s" }}
        ></div>
        <div
          className="cloud continuous x7"
          style={{ animationDelay: "18s" }}
        ></div>
        <div
          className="cloud continuous x8"
          style={{ animationDelay: "21s" }}
        ></div>
        <div
          className="cloud continuous x9"
          style={{ animationDelay: "24s" }}
        ></div>
        <div
          className="cloud continuous x10"
          style={{ animationDelay: "27s" }}
        ></div>
      </div>

      <div className="relative z-10 pt-[150px] pb-[60px] px-4 sm:px-8 md:px-16 xl:px-32 h-full overflow-y-auto">
        <div className="mx-auto max-w-[1000px] grid grid-cols-2 md:grid-cols-3 gap-y-20 gap-x-8">
          {images.map((src, idx) => {
            const savedWork = savedWorks.find((work) => work.image === src); // Check `savedWorks` state
            let showDefaultImage = true;
            let thumbnailSrc = "";

            // get the localStorage data to determine the true state
            const savedDataString = localStorage.getItem(`saved_${src}`);
            if (savedDataString) {
              try {
                const parsed = JSON.parse(savedDataString);
                if (!parsed.cleared && parsed.drawing) {
                  showDefaultImage = false; // saved, non-cleared progress
                  thumbnailSrc = parsed.drawing;
                }
              } catch (e) {
                console.error("Failed to parse saved data", e);
                // if parsing fails, treat as no valid saved data, show default
                showDefaultImage = true;
              }
            }

            return (
              <div
                key={idx}
                className="relative bg-white rounded-2xl shadow-md py-3 flex justify-center items-center aspect-square w-full max-w-[300px] mx-auto cursor-pointer transform transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-103 hover:shadow-xl"
                onClick={() => handleImageClick(src)}
              >
                <img
                  src={`/${getTapeImage(idx)}`}
                  alt="Tape"
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] pointer-events-none"
                />

                {showDefaultImage ? (
                  // default image if no valid saved progress or if cleared
                  <img
                    src={`/${src}`}
                    alt={`Coloring ${idx}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  // saved thumbnail
                  <>
                    <img
                      src={thumbnailSrc}
                      alt={`Saved ${src}`}
                      className="h-[80%] w-[88%] object-cover rounded-lg -mt-2.5 border-dashed border-2 border-gray-300"
                    />
                    <button
                      onClick={(e) => handleContinueClick(src, e)}
                      className="continue-button absolute bottom-2 text-white px-3 py-1 rounded-md text-sm hover:bg-gray-800 font-medium py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2 mx-auto"
                    >
                      Продолжи
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
