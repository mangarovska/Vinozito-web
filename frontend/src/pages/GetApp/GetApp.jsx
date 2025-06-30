import React from "react";
import Banner from "../../components/Banner/Banner.jsx";
import appIcon from "/soon5.png";

const GetApp = () => {
  return (
    <Banner className="flex flex-col items-center gap-4">
      <img src={appIcon} alt="App Icon" className="h-43 w-90 mt-15 mb-2" />
      <span className="text-5xl font-semibold mb-40" style={{ color: "#4f6d8f" }}>
        Наскоро . . .
      </span>
    </Banner>
  );
};

export default GetApp;
