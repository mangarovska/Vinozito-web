import React, { createContext, useContext, useEffect, useState } from "react";
import { sounds } from "./SoundManager.js";

const SoundContext = createContext();

export const SoundProvider = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let loadedCount = 0;
    const soundArray = Object.values(sounds);

    soundArray.forEach((sound, i) => {
      sound.once("load", () => {
        loadedCount++;
        console.log(`Sound ${i} loaded`);
        if (loadedCount === soundArray.length) {
          console.log("✅ All sounds loaded");
          setIsLoaded(true); // ✅ Will now be called
        }
      });
      sound.load(); // ✅ Now this only happens once
    });
  }, []);

  return (
    <SoundContext.Provider value={{ sounds, isLoaded }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSounds = () => useContext(SoundContext);
