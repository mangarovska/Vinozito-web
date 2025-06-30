import React from "react";
import Banner from "./Banner.jsx";
import Phone from "../Phone.jsx";
import { useNavigate } from "react-router-dom";
import "./Banner.css";

const BannerMainContent = () => {
  const navigate = useNavigate();

  return (
    <Banner>
      <div className="banner-content">
        <div className="banner-left">
          <h1 className="banner-title">Говори. Играј. Учи.</h1>
          <p className="banner-description">
            Апликација за деца со пречки во говорот која помага во
            комуникацијата преку симболи и развој преку забавни игри.
          </p>
          <div className="banner-buttons">
            <button className="banner-button" onClick={() => navigate("/menu")}>
              Отвори <br />
              Виножито
            </button>
            <button className="banner-button playstore-button" onClick={() => navigate("/app")}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                className="icon"
                viewBox="0 0 512 512"
              >
                <path d="M99.617 8.057a50.191 50.191 0 00-38.815-6.713l230.932 230.933 74.846-74.846L99.617 8.057zM32.139 20.116c-6.441 8.563-10.148 19.077-10.148 30.199v411.358c0 11.123 3.708 21.636 10.148 30.199l235.877-235.877L32.139 20.116zM464.261 212.087l-67.266-37.637-81.544 81.544 81.548 81.548 67.273-37.64c16.117-9.03 25.738-25.442 25.738-43.908s-9.621-34.877-25.749-43.907zM291.733 279.711L60.815 510.629c3.786.891 7.639 1.371 11.492 1.371a50.275 50.275 0 0027.31-8.07l266.965-149.372-74.849-74.847z"></path>
              </svg>
              <span className="texts">
                <span className="text-1">Преземи на</span>
                <span className="text-2">Google Play</span>
              </span>
            </button>
          </div>
        </div>

        <div className="banner-right">
          <Phone video="/fin.mp4" />

          <div className="small-circle-1"></div>
          <div className="small-circle-2"></div>
          <div className="small-circle-3"></div>
        </div>
      </div>
    </Banner>
  );
};

export default BannerMainContent;
