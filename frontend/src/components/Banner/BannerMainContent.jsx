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
            <button className="banner-button">Преземи</button>
          </div>
        </div>

        <div className="banner-right">
          <Phone />
          <div class="small-circle-1"></div>
          <div class="small-circle-2"></div>
          <div class="small-circle-3"></div>
        </div>
      </div>
    </Banner>
  );
};

export default BannerMainContent;
