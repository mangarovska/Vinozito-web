import React, { useState, useEffect } from "react"; // Add useState import here
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import "./ColoringPage.css";

const images = [
  "bug_fin.svg",
  "cake_fin.svg",
  "rocket_fin.svg",
  "candy_fin.svg",
  "rainbow_fin.svg",
  "flower_fin.svg",
  "butterfly_fin.svg",
  // "dino.svg",
  // "guitar.svg",
  "ice_fin.svg",
];

// const thumbnail = [
//   "bug_fin.png",
//   "cake_fin.png",
//   "rocket_fin.png",
//   "candy_fin.png",
//   "rainbow_fin.png",
//   "flower_fin.png",
//   "butterfly_fin.png",
//   "ice_fin.png",
// ];

const tapeImages = [
  "t11.png",
  "t2.png",
  // "t3.png",
  "t4.png",
  "t5.png",
  "t8.png",
  "t7.png",
  "t9.png",
  "t6.png",
  "t10.png",
  "t1.png",
  "t12.png",
];

export default function ColoringPage() {
  const navigate = useNavigate();
  const [savedWorks, setSavedWorks] = useState([]);
  // const showContinue = hasValidProgress();

  // const hasValidProgress = () => {
  //   const saved = localStorage.getItem(`saved_${imageName}`);
  //   if (!saved) return false;

  //   const data = JSON.parse(saved);
  //   return !data.cleared; // Only show "Continue" if not cleared
  // };

  // Load saved works from localStorage on component mount
  // useEffect(() => {
  //   const saved = [];
  //   images.forEach((img) => {
  //     console.log(`Checking for saved data for: ${img}`);
  //     const savedData = localStorage.getItem(`saved_${img}`);
  //     console.log(`Saved data for ${img}:`, savedData);
  //     if (savedData) {
  //       try {
  //         const parsedData = JSON.parse(savedData);
  //         saved.push({
  //           image: img,
  //           thumbnail: parsedData.drawing,
  //         });
  //         console.log(`Pushed to saved:`, {
  //           image: img,
  //           thumbnail: parsedData.drawing,
  //         });
  //       } catch (error) {
  //         console.error(`Error parsing saved data for ${img}:`, error);
  //       }
  //     }
  //   });
  //   setSavedWorks(saved);
  //   console.log("Final savedWorks:", savedWorks);
  // }, []);

  const loadSavedWorks = () => {
    const saved = [];
    images.forEach((img) => {
      const savedData = localStorage.getItem(`saved_${img}`);
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          saved.push({
            image: img,
            thumbnail: parsedData.drawing,
          });
        } catch (error) {
          console.error(`Error parsing saved data for ${img}:`, error);
        }
      }
    });
    setSavedWorks(saved);
  };

  
  useEffect(() => { // load on component mount
    loadSavedWorks();
    
    const handleStorage = (e) => { // listen for storage events to update when saved from other tabs
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
            const savedWork = savedWorks.find((work) => work.image === src);

            return (
              <div
                key={idx}
                className="relative bg-white rounded-2xl shadow-md py-3 flex justify-center items-center aspect-square 
             w-full max-w-[300px] mx-auto cursor-pointer
             transform transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-103 hover:shadow-xl"
                onClick={() => handleImageClick(src)}
              >
                {/* tape on top */}
                <img
                  src={`/${getTapeImage(idx)}`}
                  alt="Tape"
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] pointer-events-none"
                />

                {/* thumbnail */}
                {savedWork ? (
                  (() => {
                    const savedData = localStorage.getItem(`saved_${src}`);
                    let showContinue = false;
                    let isCleared = true;
                    if (savedData) {
                      try {
                        const parsed = JSON.parse(savedData);
                        isCleared = parsed.cleared;
                        showContinue = !parsed.cleared;
                      } catch (e) {
                        console.error("Failed to parse saved data", e);
                      }
                    }

                    return (
                      <>
                        <img
                          src={savedWork.thumbnail}
                          alt={`Saved ${src}`}
                          className={`h-[80%] w-[88%] object-cover rounded-lg -mt-2.5 ${
                            !isCleared
                              ? "border-dashed border-2 border-gray-300"
                              : ""
                          }`}
                        />

                        {showContinue && (
                          <button
                            onClick={(e) => handleContinueClick(src, e)}
                            className="continue-button absolute bottom-2 text-white px-3 py-1 rounded-md text-sm hover:bg-gray-800 font-medium py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2 mx-auto"
                          >
                            Продолжи
                            <ArrowRight className="w-5 h-5" />
                          </button>
                        )}
                      </>
                    );
                  })()
                ) : (
                  <img
                    src={`/${src}`}
                    alt={`Coloring ${idx}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
