import React from "react";
import { useDrop } from "react-dnd";

const ShadowTarget = ({ targetFlower, matchedFlower, onMatch }) => {
  const [{ isOver }, dropRef] = useDrop(
    () => ({
      accept: "flower",
      canDrop: () => !matchedFlower, // disable dropping if matched
      drop: (item) => {
        if (!matchedFlower) {
          const correct = item.id === targetFlower.id;
          onMatch(correct, item.id);
        }
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [targetFlower, matchedFlower]
  );

  return (
    <div
      ref={dropRef}
      style={{
        width: "300px",
        height: "300px",
        borderRadius: "50%",
        overflow: "hidden",
        backgroundColor: isOver ? "#e6ffe6" : "#f0f0f0",
        border: "2px dashed #bbb",
        margin: "20px auto 50px auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <div // shadow
        style={{
          position: "relative",
          // overflow: "visible",
          width: 150,
          height: 225,
        }}
      >
        <img
          src={targetFlower.shadow}
          alt="shadow"
          style={{
            width: "100%",
            overflow: "hidden",
            height: "100%",
            opacity: matchedFlower ? 0.3 : 1,
            objectFit: "contain",
          }}
        />

        {matchedFlower && (
          <img
            src={matchedFlower.image}
            alt={matchedFlower.id}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              overflow: "hidden",
              objectFit: "cover",
              transition: "all 0.3s ease",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ShadowTarget;
