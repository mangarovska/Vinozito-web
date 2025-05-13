import React, { useState, useEffect } from "react"; // Add useState import here
import { useNavigate } from "react-router-dom";
import "./ColoringPage.css";

const images = [
  "bug_svg.svg",
  "bird.svg",
  "rocket.png",
  "rainbow.png",
  "candy.png",
  "flower.png",
  "worm.png",
  "worm.png",
  "worm.png",  

];

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

  // Load saved works from localStorage on component mount
  useEffect(() => {
    const saved = [];
    images.forEach((img) => {
      console.log(`Checking for saved data for: ${img}`);
      const savedData = localStorage.getItem(`saved_${img}`);
      console.log(`Saved data for ${img}:`, savedData);
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          saved.push({
            image: img,
            thumbnail: parsedData.drawing,
          });
          console.log(`Pushed to saved:`, {
            image: img,
            thumbnail: parsedData.drawing,
          });
        } catch (error) {
          console.error(`Error parsing saved data for ${img}:`, error);
        }
      }
    });
    setSavedWorks(saved);
    console.log("Final savedWorks:", savedWorks);
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
        {/* Continuous flow of clouds */}
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
        {/* <h2 className="text-2xl font-bold text-center mb-8 text-white drop-shadow-md">
          My Coloring Gallery
        </h2> */}

        <div className="mx-auto max-w-[1000px] grid grid-cols-2 md:grid-cols-3 gap-y-12 gap-x-8">
          {images.map((src, idx) => {
            const savedWork = savedWorks.find((work) => work.image === src);

            return (
              <div
                key={idx}
                className="relative bg-white rounded-2xl shadow-md p-3 flex justify-center items-center aspect-square 
                           w-full max-w-[300px] mx-auto cursor-pointer
                           transform transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-102 hover:shadow-xl"
                onClick={() => handleImageClick(src)}
              >
                <div className="absolute -top-7 left-1/2 -translate-x-1/2">
                  <img
                    src={`/${getTapeImage(idx)}`}
                    alt="Tape"
                    className="w-40"
                  />
                </div>

                {savedWork ? (
                  <>
                    <img
                      src={savedWork.thumbnail}
                      alt={`Saved ${src}`}
                      className="h-full w-full object-contain"
                    />
                    <button
                      onClick={(e) => handleContinueClick(src, e)}
                      className="absolute bottom-2 bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600"
                    >
                      Continue
                    </button>
                  </>
                ) : (
                  <img
                    src={`/${src}`}
                    alt={`Coloring ${idx}`}
                    className="h-full w-full object-contain grayscale hover:grayscale-0 transition-all"
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
