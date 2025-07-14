import React, { useState, useEffect, useRef } from "react";
import { useDrop } from "react-dnd";
import "./ShadowTarget.css";

const playSound = (audioRef) => {
  if (!audioRef.current) return;
  audioRef.current.pause();
  audioRef.current.currentTime = 0;
  audioRef.current.play();
};

const ShadowTarget = ({
  targetFlower,
  matchedFlower,
  onMatch,
  allMatched,
  flowers,
}) => {
  const [dropResult, setDropResult] = useState(""); // "", "correct", "wrong"

  const correctSound = useRef(null);
  const wrongSound = useRef(null);
  const winSound = useRef(null);
  const shuffleSound = useRef(null);

  const [displayedShadow, setDisplayedShadow] = useState(
    targetFlower ? targetFlower.shadow : null
  );

  useEffect(() => {
    if (!targetFlower || allMatched) {
      setDisplayedShadow(null);
      return;
    }

    let shuffleCount = 0;
    const maxShuffles = 8; // cycle through 8 random shadows
    const shuffleInterval = 100; // change shadow every 100 ms

    const interval = setInterval(() => {
      shuffleCount += 1;

      if (shuffleCount >= maxShuffles) {
        clearInterval(interval);
        setDisplayedShadow(targetFlower.shadow);
      } else {
        const randomIndex = Math.floor(Math.random() * flowers.length);
        setDisplayedShadow(flowers[randomIndex].shadow);
        playSound(shuffleSound);
      }
    }, shuffleInterval);

    return () => clearInterval(interval);
  }, [targetFlower, allMatched, flowers]);

  useEffect(() => {
    correctSound.current = new Audio("/audio/memory/correct.mp3");
    correctSound.current.volume = 0.5;

    wrongSound.current = new Audio("/audio/memory/wrong.mp3");
    wrongSound.current.volume = 0.5;

    winSound.current = new Audio("/audio/memory/win.mp3");
    winSound.current.volume = 0.5;

    shuffleSound.current = new Audio("/audio/memory/flip.ogg");
    shuffleSound.current.volume = 0.5;
  }, []);

  // Play win sound once when allMatched becomes true
  useEffect(() => {
    if (allMatched && winSound.current) {
      // playSound(winSound);
    }
  }, [allMatched]);

  const [{ isOver }, dropRef] = useDrop(
    () => ({
      accept: "flower",
      canDrop: () => !matchedFlower && !allMatched,
      drop: (item) => {
        if (!matchedFlower && !allMatched) {
          const correct = item.id === targetFlower.id;
          onMatch(correct, item.id);

          if (correct) {
            playSound(correctSound);
          } else {
            playSound(wrongSound);
          }

          setDropResult("");
          setTimeout(() => {
            setDropResult(correct ? "correct" : "wrong");
          }, 10);

          setTimeout(() => setDropResult(""), 2000);
        }
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [targetFlower, matchedFlower, allMatched]
  );

  return (
    <div
      ref={dropRef}
      className={`drop-circle ${dropResult} ${isOver ? "drag-hover" : ""} ${
        allMatched ? "win" : ""
      }`}
    >
      {isOver && !allMatched && <div className="spinning-border" />}

      <div className="circle-content">
        {allMatched ? (
          <div className="win-message">
            <h2></h2>
          </div>
        ) : (
          <div className="flower-shadow">
            {displayedShadow && (
              <img
                src={displayedShadow}
                alt="shadow"
                style={{
                  width: "100%",
                  height: "100%",
                  opacity: matchedFlower ? 0.3 : 1,
                  objectFit: "contain",
                }}
              />
            )}

            {matchedFlower && (
              <img
                src={matchedFlower.image}
                alt={matchedFlower.id}
                className="matched-flower"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShadowTarget;
