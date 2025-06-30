import React from "react";
import Blob from "../Blob.jsx";
import { FEATURES } from "../../data.js";

import "../FloatingShapes.css";

function getShapeClass(index) {
  const shapeClasses = ["grid-lines", "sparkle", "arc", "wavy-circle"];
  return shapeClasses[index % shapeClasses.length]; // fallback-safe
}

const SHAPE_STYLES = [
  {
    size: 227,
    top: -10,
    left: "-20px",
    rotation: 15,
  },
  {
    top: -150,
    right: "-10px",
    rotation: 0,
  },
  {
    size: 190,
    top: -120,
    left: "45%",
    rotation: -65,
    color: "#842fff",
  },
];

// grid-cols-1: default (mobile-first)
// sm:grid-cols-2: from 640px
// lg:grid-cols-3: from 1024px

export default function BlobCards() {
  return (
    <section className="relative flex flex-col items-center justify-center pt-65 pb-10 w-full overflow-x-hidden px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-40 sm:gap-15 md:gap-14 w-full px-0 max-w-full overflow-visible">
          {FEATURES.map((item, index) => {
            const isLastOdd = FEATURES.length === 3 && index === 2;

            return (
              <div
                key={index}
                className={`flex justify-center w-full center max-w-full ${
                  isLastOdd ? "sm:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <div className="">
                  <Card item={item} index={index} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Card({ item, index }) {
  const shapeClass = getShapeClass(index);
  const styleConfig = SHAPE_STYLES[index] || {};

  const {
    size,
    top,
    bottom,
    left,
    right,
    color,
    rotation = 0,
    translateX,
  } = styleConfig;

  return (
    <div className="relative flex flex-col items-center text-center mx-auto w-full max-w-[350px] min-w-[350px] min-h-[310px] px-6 py-0">
      {" "}
      <div className="absolute mx-auto top-0 left-1/2 -translate-x-1/2 -z-10 scale-[1.9]">
        {/* sm:scale-[1.7] md:scale-[1.8] */}
        <Blob
          imageUrl=""
          label=""
          color={item.color}
          contentSize={0}
          overflowVisible={true}
          noShadow={true}
        />
      </div>
      {/* Render one shape for all cards except index 1 */}
      {index !== 1 && (
        <div
          className={`floating-shape absolute -z-20 ${shapeClass}`}
          style={{
            width: size,
            height: size,
            top,
            bottom,
            left,
            right,
            backgroundColor: color,
            opacity: 0.3,
            transform: `rotate(${rotation}deg) ${
              translateX ? `translateX(${translateX})` : ""
            }`,
          }}
        />
      )}
      {/* For the second card (index 1), render two shapes */}
      {index === 1 && (
        <>
          <div
            className={`floating-shape absolute -z-20 ${shapeClass}`}
            style={{
              width: size,
              height: size,
              top: 165,
              bottom,
              left: 270,
              right,
              backgroundColor: color,
              opacity: 0.3,
              transform: `rotate(${rotation}deg) ${
                translateX ? `translateX(${translateX})` : ""
              }`,
            }}
          />
          <div
            className={`floating-shape absolute -z-20 ${shapeClass}`}
            style={{
              height: 90,
              width: 50,
              top: (top || 0) + 8, // slightly offset vertically
              bottom,
              left: (left || 0) + 10, // slightly offset horizontally
              right,
              backgroundColor: color,
              opacity: 0.5, // maybe less opacity for the second one
              // transform: `rotate(${rotation + 15}deg) ${translateX ? `translateX(${translateX})` : ""}`,
            }}
          />
        </>
      )}
      <img
        src={item.image}
        alt={item.title}
        className="w-40 h-40 object-contain -mt-33 mb-4 z-10"
        draggable={false}
      />
      <h3 className="text-[1.1rem] uppercase font-semibold text-gray-700 z-10 mb-3 px-0 leading-relaxed">
        {item.title}
      </h3>
      <p className="text-[0.95rem] text-gray-600 px-3 z-10 leading-relaxed">
        {item.description}
      </p>
    </div>
  );
}
