import React from "react";
import loading from "/loading.png";

const Phone = ({ image, background }) => {
  const defaultScreen = loading;

  return (
    <div className="relative flex justify-center items-center h-[400px] w-[200px] overflow-visible">
      {background && (
        <div className="absolute inset-0 z-0 flex justify-center items-center overflow-visible">
          <img
            src={background}
            alt="Feature Background"
            className="min-w-full min-h-full object-cover overflow-visible"
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      )}

      <div
        className={`relative flex justify-center h-[325px] w-[150px] border border-4 border-black rounded-2xl bg-gray-50 ${
          (image || defaultScreen)&& `bg-cover bg-center bg-no-repeat`
        }`}
        style={{
          backgroundImage: `url(${image || defaultScreen})`,
          zIndex: 10,
        }}
      >
        <span className="absolute top-0 border border-black bg-black w-20 h-2 rounded-br-xl rounded-bl-xl z-20" />

        <span className="absolute -right-2 top-18 border border-4 border-black h-7 rounded-md z-20 bg-white" />

        <span className="absolute -right-2 top-32 border border-4 border-black h-7 rounded-md z-20 bg-white" />

        <span className="absolute -right-2 bottom-36 border border-4 border-black h-10 rounded-md z-20 bg-white" />
      </div>
    </div>
  );
};

export default Phone;
