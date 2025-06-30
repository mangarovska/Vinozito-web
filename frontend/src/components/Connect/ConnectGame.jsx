// ConnectGame.jsx
import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { flowers } from "../../data.js";

import Flower from "./Flower.jsx";
import ShadowTarget from "./ShadowTarget.jsx";
import "./ConnectGame.css";

const ConnectGame = () => {
  const [targetIndex, setTargetIndex] = useState(0);
  // const [message, setMessage] = useState("");
  const [matchedFlower, setMatchedFlower] = useState(null);

  const handleMatch = (correct, droppedId) => {
    console.log(
      "Dropped:",
      droppedId,
      "Target:",
      flowers[targetIndex].id,
      "Correct:",
      correct
    );

    // setMessage(correct ? "✅ Точно!" : "❌ Пробај повтроно!");

    if (correct) {
      setMatchedFlower(flowers.find((f) => f.id === droppedId));

      setTimeout(() => {
        setTargetIndex((prev) => (prev + 1) % flowers.length);
        setMatchedFlower(null);
        setMessage("");
      }, 1500);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        className="game-container align-items-center justify-content-center"
        style={{ position: "relative", width: "100%" }}
      >
        <img
          src="/bee2.png"
          alt="Left Decoration"
          style={{
            position: "absolute",
            left: 0,
            top: "45%",
            transform: "translateY(-50%)",
            height: "200px",
            zIndex: 0,
          }}
        />

        <img
          src="/bee1.png"
          alt="Right Decoration"
          style={{
            position: "absolute",
            right: 0,
            top: "25%",
            transform: "translateY(-50%)",
            height: "200px",
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
          <ShadowTarget
            key={flowers[targetIndex].id}
            targetFlower={flowers[targetIndex]}
            matchedFlower={matchedFlower}
            onMatch={handleMatch}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              backgroundColor: "rgba(235, 235, 235, 0.64)",
              borderRadius: "25px",
              padding: "2rem 1rem",
              boxSizing: "border-box",
            }}
          >
            {flowers.map((flower) => (
              <Flower key={flower.id} flower={flower} />
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default ConnectGame;
