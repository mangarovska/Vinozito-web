import React, { useState, useEffect, useRef, useMemo } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { flowers } from "../../data.js";

import Flower from "./Flower.jsx";
import ShadowTarget from "./ShadowTarget.jsx";
import "./ConnectGame.css";

const WinAnimation = () => {
  
  // memoize once when component mounts
  const stars = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 90}%`,
      size: 80 + Math.random() * 150,
      delay: `${i * 0.3}s`,
      rotate: `${Math.random() * 180}deg`,
    }));
  }, []);

  return (
    <>
      {stars.map((star) => (
        <img
          key={star.id}
          src="/connect-assets/honey.png"
          alt="honey"
          className="win-honey"
          style={{
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: star.delay,
            rotate: star.rotate,
          }}
        />
      ))}
    </>
  );
};

const ConnectGame = () => {
  // const allMatched = matchedIds.length === flowers.length;

  const getRandomIndex = (excludeIndex = null, excludeIds = []) => {
    const available = flowers.filter(
      (_, idx) => idx !== excludeIndex && !excludeIds.includes(flowers[idx].id)
    );
    if (available.length === 0) return null;
    const randIndex = Math.floor(Math.random() * available.length);
    return flowers.findIndex((f) => f.id === available[randIndex].id);
  };

  const [matchedIds, setMatchedIds] = useState([]);
  const [targetIndex, setTargetIndex] = useState(() =>
    getRandomIndex(null, [])
  );
  const [matchedFlower, setMatchedFlower] = useState(null);
  const allMatched = matchedIds.length === flowers.length;
  const winAudioRef = useRef(null);

  useEffect(() => {
    if (matchedIds.length === flowers.length && winAudioRef.current) {
      winAudioRef.current.volume = 0.5;
      winAudioRef.current.play();
    }
  }, [matchedIds]);

  useEffect(() => {
    if (matchedIds.length === flowers.length) {
      const timer = setTimeout(() => {
        setMatchedIds([]);
        setMatchedFlower(null);
        setTargetIndex(() => getRandomIndex(null, []));
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [matchedIds]);

  const handleMatch = (correct, droppedId) => {
    if (correct && !matchedIds.includes(droppedId)) {
      setMatchedFlower(flowers.find((f) => f.id === droppedId));
      setMatchedIds((prev) => [...prev, droppedId]);

      setTimeout(() => {
        const newMatched = [...matchedIds, droppedId];
        if (newMatched.length < flowers.length) {
          setTargetIndex((prev) => getRandomIndex(prev, newMatched));
          setMatchedFlower(null);
        } else {
          setTargetIndex(null);
          setMatchedFlower(null);
        }
      }, 1500);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        className="game-container align-items-center justify-content-center"
        style={{ position: "relative", width: "100%" }}
      >
        <audio ref={winAudioRef} src="/audio/memory/win.mp3" preload="auto" />

        {/* Bee images */}
        <img
          className="bee"
          src="/connect-assets/bee2.png"
          alt="Left Decoration"
          style={{
            position: "absolute",
            left: 0,
            top: "39%",
            transform: "translateY(-50%)",
            height: "280px",
            zIndex: 0,
          }}
        />
        <img
          className="bee"
          src="/connect-assets/bee1.png"
          alt="Right Decoration"
          style={{
            position: "absolute",
            right: 0,
            top: "25%",
            rotate: "-10deg",
            transform: "translateY(-50%)",
            height: "270px",
            zIndex: 0,
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: "1600px",
            margin: "0 auto",
            padding: "2rem 1rem",
            boxSizing: "border-box",
            textAlign: "center",
          }}
        >
          {allMatched && <WinAnimation />}

          <ShadowTarget
            key={targetIndex !== null ? flowers[targetIndex].id : "all-done"}
            targetFlower={targetIndex !== null ? flowers[targetIndex] : null}
            matchedFlower={matchedFlower}
            onMatch={handleMatch}
            allMatched={matchedIds.length === flowers.length}
            flowers={flowers}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              border: "5px solid white",
              boxShadow:
                "inset 0 0 20px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.15)",
              backgroundColor: "rgba(235, 235, 235, 0.5)",
              borderRadius: "25px",
              padding: "2rem 1rem",
              boxSizing: "border-box",
            }}
          >
            {flowers.map((flower) => (
              <Flower
                key={flower.id}
                flower={flower}
                disabled={matchedIds.includes(flower.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default ConnectGame;
