import React, { useState, useRef, useEffect } from "react";
import { Howl } from "howler";
import { useSounds } from "../../SoundProvider";
import { useLoading } from "../../LoadingContext";

import "./Relax.css";
import bubbleImage from "/relax-assets/bubble_pop_frame_01.png";
import popAnimation from "/relax-assets/bubble-pop.webm";
import LoadingScreen from "../LoadingScreen.jsx";

import useSound from "use-sound";
import popSfx from "/audio/pop.m4a";

import happyNote from "/relax-assets/happy.png";
import happyBack from "/relax-assets/happy_back.png";
import calmNote from "/relax-assets/calm.png";
import calmBack from "/relax-assets/calm_back.png";
import wnNote from "/relax-assets/wn.png";
import wnBack from "/relax-assets/wn_back.png";
import muteNote from "/relax-assets/mute.png";
import muteBack from "/relax-assets/mute_back.png";

import layer1Img from "/relax-assets/fin.png"; // background

const Bubble = ({ x, y, size }) => {
  const [isPopped, setIsPopped] = useState(false);
  const [popStyle, setPopStyle] = useState(null);
  const [playPop] = useSound(popSfx, { volume: 0.5 });

  const bubbleRef = useRef(null);
  const videoRef = useRef(null);

  const animationRef = useRef({
    progress: 0,
    paused: false,
    x: 0,
    y: 0,
    frameId: null,
  });

  const duration = useRef(Math.random() * 3 + 5);
  const delay = useRef(Math.random() * 3000);
  const xMovement = useRef(Math.random() * 5 + 3);
  const yMovement = useRef(Math.random() * 5 + 3);

  useEffect(() => {
    let startTime = null;
    let timeoutId;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress =
        (elapsed % (duration.current * 1000)) / (duration.current * 1000);

      if (!animationRef.current.paused) {
        const angle = progress * Math.PI * 2;
        const dx = Math.sin(angle) * xMovement.current;
        const dy = Math.cos(angle) * yMovement.current;

        animationRef.current = {
          ...animationRef.current,
          x: dx,
          y: dy,
          progress,
        };
        bubbleRef.current.style.transform = `translate(${dx}px, ${dy}px) scale(1)`;
      }

      animationRef.current.frameId = requestAnimationFrame(animate);
    };

    timeoutId = setTimeout(() => {
      animationRef.current.frameId = requestAnimationFrame(animate);
    }, delay.current);

    return () => {
      cancelAnimationFrame(animationRef.current.frameId);
      clearTimeout(timeoutId);
    };
  }, []);

  const handleMouseEnter = () => {
    animationRef.current.paused = true;
    const { x, y } = animationRef.current;
    bubbleRef.current.style.transform = `translate(${x}px, ${y}px) scale(1.15)`;
  };

  const handleMouseLeave = () => {
    animationRef.current.paused = false;
    const { x, y } = animationRef.current;
    bubbleRef.current.style.transform = `translate(${x}px, ${y}px) scale(1)`;
  };

  const handlePop = () => {
    if (isPopped) return;
    playPop();

    const bubble = bubbleRef.current;
    const parent = bubble.parentElement;
    const { left, top, width, height } = bubble.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();

    setPopStyle({
      position: "absolute",
      left: `${left - parentRect.left}px`,
      top: `${top - parentRect.top}px`,
      width: `${width}px`,
      height: `${height}px`,
      pointerEvents: "none",
    });

    setIsPopped(true);
    setTimeout(() => bubble && (bubble.style.visibility = "hidden"), 100);
  };

  const resetBubble = () => {
    setTimeout(() => {
      bubbleRef.current.style.visibility = "visible";
      setIsPopped(false);
      setPopStyle(null);
    }, 2000);
  };

  useEffect(() => {
    if (isPopped && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(console.warn);
    }
  }, [isPopped]);

  return (
    <>
      <div
        ref={bubbleRef}
        className="bubble"
        style={{
          left: `calc(${x}% - ${size / 2}px)`,
          top: `calc(${y}% - ${size / 2}px)`,
          width: `${size}px`,
          height: `${size}px`,
          backgroundImage: `url(${bubbleImage})`,
          transition: "transform 0.2s ease",
        }}
        onClick={handlePop}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />

      {isPopped && (
        <video
          ref={videoRef}
          className="pop-animation"
          src={popAnimation}
          style={{ ...popStyle, objectFit: "cover", zIndex: 2 }}
          muted
          playsInline
          onEnded={resetBubble}
        />
      )}
    </>
  );
};

export function getResponsiveBubbleCount() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (w < 600 || h < 600) return 6;
  if (w > 1400) return 10;
  return 8;
}

export function generateBubblePositions(count) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const positions = [];

  const padding = 5;
  const availableWidth = 100 - padding * 2;
  const availableHeight = 100 - padding * 2;
  const effectiveWidth = width - 40;
  const effectiveHeight = height - 230;

  for (let i = 0; i < count; i++) {
    let attempts = 0;
    let valid = false;
    let x, y, size;

    while (!valid && attempts++ < 100) {
      x = padding + Math.random() * availableWidth;
      y = padding + Math.random() * availableHeight;
      size = getBubbleSize(width);

      const xPx = (x / 100) * effectiveWidth;
      const yPx = (y / 100) * effectiveHeight;

      if (
        xPx < size / 2 ||
        xPx > effectiveWidth - size / 2 ||
        yPx < size / 2 ||
        yPx > effectiveHeight - size / 2
      )
        continue;

      valid = positions.every((pos) => {
        const dx = xPx - (pos.x / 100) * effectiveWidth;
        const dy = yPx - (pos.y / 100) * effectiveHeight;
        const dist = Math.sqrt(dx ** 2 + dy ** 2);
        return dist >= (size + pos.size) / 2 + 20;
      });

      if (valid) positions.push({ x, y, size });
    }
  }

  return positions;
}

function getBubbleSize(width) {
  const r = Math.random();
  if (width < 600) {
    if (r < 0.1) return rand(60, 90);
    if (r < 0.3) return rand(90, 110);
    if (r < 0.7) return rand(110, 140);
    if (r < 0.9) return rand(140, 170);
    return rand(170, 200);
  } else {
    if (r < 0.1) return rand(60, 100);
    if (r < 0.3) return rand(100, 130);
    if (r < 0.7) return rand(130, 170);
    if (r < 0.9) return rand(170, 210);
    return rand(210, 240);
  }
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

const BubbleParticles = ({ count = 30 }) => {
  const particles = Array.from({ length: count }).map((_, i) => {
    const size = Math.random() * 20 + 5;
    const duration = Math.random() * 10 + 10;
    const delay = Math.random() * 15;
    const left = Math.random() * 100;

    return (
      <div
        key={i}
        className="bubble-particle"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          left: `${left}%`,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
          boxShadow: `0 0 ${size / 2}px ${size / 3}px rgba(255, 255, 255, 0.2)`,
        }}
      />
    );
  });

  return <div className="bubble-particles">{particles}</div>;
};

const Sunrays = () => {
  const rayCount = 30;
  const rays = Array.from({ length: rayCount }).map((_, i) => {
    const left = i * 100;
    const width = 50 + (i % 3) * 10; // 50–70px
    const height = 300 + (i % 5) * 50; // 300–500px
    const angle = -18 + ((i % 4) - 2) * 1.5; // -21 to -15 deg
    const isDark = i % 6 === 0;
    const delay = (i % 4) * 2;
    const duration = 12 + (i % 3) * 2;
    const blur = 6 + (i % 3) * 4; // 6–14px
    const opacity = 0.15 + (i % 5) * 0.05; // 0.15–0.35

    return (
      <div
        key={i}
        className={`sunray ${isDark ? "darker" : ""}`}
        style={{
          left: `${left}px`,
          width: `${width}px`,
          height: `${height}px`,
          transform: `translateX(-50%) rotate(${angle}deg)`,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
          filter: `blur(${blur}px)`,
          opacity,
        }}
      />
    );
  });

  return <div className="sunrays">{rays}</div>;
};

const UnderwaterScene = () => {
  return (
    <div className="underwater-container">
      <div className="layer layer4"></div>
      <div className="layer layer3"></div>
      <div className="layer layer2"></div>
      <div
        className="layer1"
        style={{
          backgroundImage: `url(${layer1Img})`,
          backgroundSize: "600px auto",
          width: "100%",
          height: "100vh",
          backgroundRepeat: "repeat-x",
          backgroundPosition: "bottom left",
          zIndex: 5,
        }}
      />
    </div>
  );
};

const Fish = ({ style, className }) => (
  <svg
    className={`fish ${className || ""}`}
    width="235"
    height="104"
    viewBox="0 0 235 104"
    style={style}
  >
    <path
      d="m 172.04828,20.913839 c 0.0489,-0.444179 -0.2178,-0.896934 -1.01784,-1.415715 -0.72801,-0.475049 -1.4826,-0.932948 -2.2149,-1.401138 -1.6035,-1.028129 -3.29018,-1.969653 -4.89798,-3.079244 -4.67074,-3.24131 -10.22127,-4.404923 -15.76322,-5.1509392 -2.27235,-0.286401 -4.81223,-0.168925 -6.72186,-1.574351 -1.48174,-1.081294 -4.04993,-4.828523 -6.86506,-6.456038 -0.4862,-0.290688 -2.77227,-1.44486897 -2.77227,-1.44486897 0,0 1.30939,3.55000597 1.60951,4.26429497 0.69542,1.644664 -0.38158,3.063809 -0.83262,4.642447 -0.29069,1.0418502 2.13772,0.8129002 2.26463,1.7827212 0.18179,1.432007 -4.15197,1.936211 -6.59152,2.417263 -3.65634,0.715146 -7.91635,2.082841 -11.56925,0.884071 -4.3046,-1.38313 -7.37269,-4.129669 -10.46566,-7.2354952 1.43801,6.7252892 5.4382,10.6028562 5.6157,11.4226162 0.18607,0.905509 -0.45961,1.091584 -1.04099,1.682394 -1.28967,1.265655 -6.91566,7.731125 -6.93366,9.781383 1.61379,-0.247815 3.56115,-1.660957 4.9803,-2.485862 1.58035,-0.905509 7.60593,-5.373029 9.29347,-6.065023 0.38587,-0.160351 5.0549,-1.531476 5.09434,-0.932949 0.0695,0.932949 -0.30784,1.137031 -0.18436,1.527189 0.22638,0.746016 1.44144,1.465449 2.02282,1.985088 1.50918,1.292237 3.21044,2.42841 4.27373,4.156252 1.49203,2.401827 1.55805,4.999163 1.98251,7.677102 0.99469,-0.111473 2.0091,-2.17545 2.55961,-2.992638 0.51278,-0.772598 2.38639,-4.07136 3.09725,-4.275442 0.67227,-0.204082 2.75511,0.958673 3.50284,1.180763 2.85973,0.848057 5.644,1.353976 8.56032,1.353976 3.50799,0.0094 12.726,0.258104 19.55505,-4.800226 0.75545,-0.567658 2.55703,-2.731104 2.55703,-2.731104 0,0 -0.37644,-0.577091 -1.04785,-0.790605 0.89779,-0.584808 1.8659,-1.211633 1.94993,-1.925922 z"
      fill="#548b9e" //216783
    />
  </svg>
);

function FishTank() {
  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Fish style={{ top: "20%", animationDuration: "30s" }} />
      <Fish
        style={{ top: "50%", animationDuration: "30s" }}
        className="reverse"
      />
    </div>
  );
}

const SeaweedField = () => {
  const [numWeeds, setNumWeeds] = useState(0);

  useEffect(() => {
    const updateWeeds = () => {
      const spacing = 320; // your desired repeat pattern width
      const count = Math.ceil(window.innerWidth / spacing);
      setNumWeeds(count);
    };

    updateWeeds();
    window.addEventListener("resize", updateWeeds);
    return () => window.removeEventListener("resize", updateWeeds);
  }, []);

  return (
    <div className="seaweed-field">
      {[...Array(numWeeds)].map((_, i) => (
        <div
          key={i}
          className="seaweed-container"
          style={{ left: `${i * 290 + 140}px` }} // apply initial margin-left offset
        >
          <div className="seaweed blade1" />
          <div className="seaweed blade2" />
          <div className="seaweed blade3" />
        </div>
      ))}
    </div>
  );
};

const Relax = () => {
  const { sounds, isLoaded } = useSounds();
  const { incrementLoading, decrementLoading } = useLoading();
  const [localLoading, setLocalLoading] = useState(true);
  const currentSoundKeyRef = useRef(null);

  const soundOptions = [
    { value: "silent", label: "Без музика" },
    { value: "happy", label: "Весело" },
    { value: "calm", label: "Мирно" },
    { value: "noise", label: "Шум" },
  ];
  const [selectedSound, setSelectedSound] = useState(soundOptions[0]);

  const [bubbles, setBubbles] = useState(() => {
    const count = getResponsiveBubbleCount();
    const positions = generateBubblePositions(count);
    return positions.map((pos, i) => ({
      id: Date.now() + i + Math.random(),
      ...pos,
    }));
  });

  useEffect(() => {
    if (!isLoaded) return;
    setLocalLoading(false);
  }, [isLoaded]);

  useEffect(() => {
    if (localLoading) {
      incrementLoading(); // Show global loading
    } else {
      decrementLoading(); // Hide global loading
    }

    return () => {
      if (localLoading) {
        decrementLoading(); // Cleanup if unmounted
      }
    };
  }, [localLoading, incrementLoading, decrementLoading]);

  useEffect(() => {
    if (!isLoaded) return;

    let currentSound = null;

    // Play new sound
    if (selectedSound.value !== "silent") {
      sounds[selectedSound.value]?.play();
      currentSound = selectedSound.value;
    }

    // Cleanup function to stop sound on unmount or sound change
    return () => {
      if (currentSound && sounds[currentSound]) {
        sounds[currentSound].stop();
      }
    };
  }, [selectedSound, sounds, isLoaded]); // Add isLoaded to dependencies

  useEffect(() => {
    if (!isLoaded) return;

    // Set up loading state
    setLocalLoading(false);

    // Cleanup all sounds when unmounting
    return () => {
      Object.values(sounds).forEach((sound) => {
        if (sound && typeof sound.stop === "function") {
          sound.stop();
        }
      });
    };
  }, [sounds, isLoaded]);

  useEffect(() => {
    let timeout;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const positions = generateBubblePositions(bubbles.length);
        setBubbles((prev) =>
          prev.map((bubble, i) => ({
            ...bubble,
            x: positions[i].x,
            y: positions[i].y,
            size: positions[i].size,
          }))
        );
      }, 200);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [bubbles.length]);

  const SoundButtons = ({ selectedSound, onSelect }) => {
    const buttons = [
      { value: "silent", bg: muteBack, note: muteNote },
      { value: "happy", bg: happyBack, note: happyNote },
      { value: "calm", bg: calmBack, note: calmNote },
      { value: "noise", bg: wnBack, note: wnNote },
    ];

    return (
      <div className="sound-buttons">
        {buttons.map(({ value, bg, note }) => {
          const isMute = value === "silent";
          return (
            <button
              key={value}
              className={`sound-button ${value} ${
                selectedSound.value === value ? "selected" : ""
              }`}
              onClick={() => onSelect({ value })}
            >
              <div
                className="background"
                style={{ backgroundImage: `url(${bg})` }}
              />
              <div
                className="note"
                style={{
                  backgroundImage: `url(${note})`,
                  width: isMute ? "65%" : "96%",
                  height: isMute ? "65%" : "96%",
                  marginTop: isMute ? "10px" : "7px",
                  marginLeft: isMute ? "2px" : "-2px",
                }}
              />
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="relax-container">
      <SeaweedField />
      <div className="ocean-background">
        <div className="ocean-particles"></div>
      </div>
      <Sunrays count={10} />
      <BubbleParticles count={25} />
      <SoundButtons selectedSound={selectedSound} onSelect={setSelectedSound} />
      <div className="bubble-screen">
        {bubbles.map((bubble) => (
          <Bubble
            key={bubble.id}
            id={bubble.id}
            x={bubble.x}
            y={bubble.y}
            size={bubble.size}
          />
        ))}
      </div>
      <UnderwaterScene />
      <FishTank />
    </div>
  );
};

export default Relax;
