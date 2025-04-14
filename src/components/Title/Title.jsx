import React from "react";
import "./Title.css";

const colors = [
  "#F7A8AE",
  "#FAE2A4",
  "#BCE3B4",
  "#91D3DB",
  "#C6A7EF",
  "#FCB573",
];
const midShades = [
  "#E0666E",
  "#E6CC71",
  "#9CCF94",
  "#66B7C2",
  "#A07DD1",
  "#E28E47",
];
const darkShadows = [
  "#B83D46",
  "#B99A3F",
  "#739E6C",
  "#3E8D99",
  "#7D5BB0",
  "#B46224",
];

const Title = ({ children }) => {
  const title = children;

  return (
    <h1 className="title-heading">
      {title.split("").map((char, index) => {
        const base = colors[index % colors.length];
        const mid = midShades[index % midShades.length];
        const dark = darkShadows[index % darkShadows.length];

        return (
          <span
            key={index}
            style={{
              color: base,
              textShadow: `
                1px 1px 0 ${mid},    /* middle layer */
                3px 3px 0 ${dark}    /* deepest layer */
              `,
              filter: "drop-shadow(1.5px 2px 1px rgba(0,0,0,0.25))",
            }}
          >
            {char}
          </span>
        );
      })}
    </h1>
  );
};

export default Title;
