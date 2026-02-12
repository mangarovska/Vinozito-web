import React, { useState, useEffect, useMemo, useRef } from "react";
// import { useWindowSize } from "react-use";
// import Confetti from "react-confetti";

import "./GameBoard.css";
import Card from "./MemoryCard";

const CARD_VALUES = [
  "/memory-assets/cards/earth.png",
  "/memory-assets/cards/planet.png",
  "/memory-assets/cards/astro.png",
  "/memory-assets/cards/star.png",
  "/memory-assets/cards/rocket.png",
  "/memory-assets/cards/solar.png",
];

const playSound = (audioRef) => {
  if (!audioRef.current) return;
  audioRef.current.currentTime = 0;
  audioRef.current.play();
};

// const shuffled = () => {
//   const pairs = [...CARD_VALUES, ...CARD_VALUES];
//   return pairs.sort(() => Math.random() - 0.5);
// };

const DEMO_MODE = true;

const shuffled = () => {
  const pairs = [...CARD_VALUES, ...CARD_VALUES];

  if (DEMO_MODE) {
    return [
      "/memory-assets/cards/solar.png",   // Row 1
      "/memory-assets/cards/solar.png",
      "/memory-assets/cards/rocket.png",
      "/memory-assets/cards/astro.png",

      "/memory-assets/cards/star.png",    // Row 2 (comet = star)
      "/memory-assets/cards/planet.png",
      "/memory-assets/cards/astro.png",
      "/memory-assets/cards/earth.png",

      "/memory-assets/cards/planet.png",  // Row 3
      "/memory-assets/cards/star.png",
      "/memory-assets/cards/rocket.png",
      "/memory-assets/cards/earth.png",
    ];
  }

  // normal random shuffle
  return pairs.sort(() => Math.random() - 0.5);
};


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
          src="/memory-assets/star2.png"
          alt="star"
          className="win-star"
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

export default function GameBoard() {
  const [cards, setCards] = useState(shuffled());
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [shakeIndices, setShakeIndices] = useState([]);
  const [resetting, setResetting] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [manualFlip, setManualFlip] = useState([]); // overrides flip during reset
  const [resetFlipping, setResetFlipping] = useState([]);

  const flipSound = useRef(null);
  const correctSound = useRef(null);
  const wrongSound = useRef(null);
  const winSound = useRef(null);
  const resetSound = useRef(null);

  const handleReset = () => {
    setGameWon(false);
    setResetting(true);
    playSound(resetSound);

    // reset flip
    setResetFlipping(Array.from({ length: cards.length }, (_, i) => i));
    setTimeout(() => setResetFlipping([]), 1000);

    // flipeverything face down visually
    setManualFlip(Array.from({ length: cards.length }, (_, i) => i));

    // after animation, shuffle
    setTimeout(() => {
      setCards(shuffled());
      setMatched([]);
      setFlipped([]);
      setManualFlip([]);
      setResetting(false);
    }, 1000);
  };

  const handleFlip = (index) => {
    if (
      flipped.includes(index) ||
      matched.includes(index) ||
      flipped.length === 2 ||
      resetting ||
      gameWon
    )
      return;

    playSound(flipSound);
    setFlipped((prev) => [...prev, index]);
  };

  useEffect(() => {
    if (gameWon) {
      const timer = setTimeout(() => {
        handleReset();
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [gameWon]);

  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setGameWon(true);
      playSound(winSound);
    }
  }, [matched, cards]);

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      if (cards[first] === cards[second]) {
        setMatched((prev) => [...prev, first, second]);
        playSound(correctSound);
      } else {
        setShakeIndices([first, second]);
        playSound(wrongSound);
      }

      setTimeout(() => {
        setFlipped([]); // only clear if not matched
        setShakeIndices([]);
      }, 1000);
    }
  }, [flipped]);

  useEffect(() => {
    flipSound.current = new Audio("/audio/memory/flip.ogg");
    flipSound.current.volume = 0.5; // set volume

    correctSound.current = new Audio("/audio/memory/correct.mp3");
    correctSound.current.volume = 0.5;

    wrongSound.current = new Audio("/audio/memory/wrong.mp3");
    wrongSound.current.volume = 0.5;

    winSound.current = new Audio("/audio/memory/win.mp3");
    winSound.current.volume = 0.5;

    resetSound.current = new Audio("/audio/memory/reset.mp3");
    resetSound.current.volume = 0.5;

    // Cleanup function to stop and cleanup audio on unmount
    return () => {
      const audioRefs = [flipSound, correctSound, wrongSound, winSound, resetSound];
      audioRefs.forEach((ref) => {
        if (ref.current) {
          ref.current.pause();
          ref.current.src = "";
          ref.current = null;
        }
      });
    };
  }, []);

  return (
    <div className=" gameboard-container flex flex-col items-center">
      <button className={"sound-button reset"} onClick={handleReset}>
        <div className="background"></div>
        <div className="note"></div>
      </button>

      <div className="gameboard-content">
        <div
          className={`grid grid-cols-3 md:grid-cols-4 gap-4 w-full max-w-4xl px-4 pt-20 min-h-[480px] ${
            resetting ? "pointer-events-none" : ""
          }`}
        >
          {cards.map((emoji, i) => (
            <Card
              key={i}
              emoji={emoji}
              flipped={
                manualFlip.length > 0
                  ? false
                  : flipped.includes(i) || matched.includes(i)
              }
              isShaking={shakeIndices.includes(i)}
              resetFlipping={resetFlipping.includes(i)}
              onClick={() => handleFlip(i)}
            />
          ))}
        </div>
      </div>
      {gameWon && <WinAnimation />}
    </div>
  );
}
