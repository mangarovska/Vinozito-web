import React, { useState, useEffect, useMemo, useRef } from "react";

const MemoryCard = ({ emoji, flipped, isShaking, resetFlipping, onClick }) => {
  const randomDelay = useMemo(() => `${Math.random() * 0.5}s`, []);

  return (
    <div
      className={`perspective w-full aspect-square 
        ${isShaking ? "shake" : ""} 
        ${resetFlipping ? "reset-flip" : ""}`}
      style={{
        cursor: "pointer",
        ...(resetFlipping ? { animationDelay: randomDelay } : {}),
      }}
      onClick={onClick}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style preserve-3d ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        <div className="card-back absolute inset-0 backface-hidden"></div>

        <div
          className={`absolute inset-0 flex items-center justify-center bg-amber-100 border-6 border-amber-300 rounded-2xl rotate-y-180 backface-hidden ${
            flipped ? "visible" : "invisible"
          }`}
        >
          <img src={emoji} alt="card" className="w-3/4 h-3/4 object-contain" />
        </div>
      </div>
    </div>
  );
};

export default MemoryCard;
