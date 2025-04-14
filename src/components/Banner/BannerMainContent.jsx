import React from "react";
import Navbar from "../Navigation Bar/Navbar.jsx";
import Banner from "./Banner.jsx";
import "./Banner.css";
import Phone from "../Phone.jsx";
import { useNavigate } from "react-router-dom";

const BannerMainContent = () => {

  const navigate = useNavigate();

  return (
    <div className="banner">
      <div className="banner-content">
        <div className="banner-left">
          <h1 className="banner-title">Говори. Играј. Учи.</h1>
          <p className="banner-description">
            Апликација за деца со пречки во говорот која помага во
            комуникацијата преку симболи и развој преку забавни игри.
          </p>
          <div className="banner-buttons">
            <button
              className="banner-button"
              onClick={() => navigate("/menu")}
            >
              Отвори
              <br />
              Виножито
            </button>
            <button className="banner-button">Преземи</button>
          </div>
        </div>

        <div className="banner-right">
          {/* <img src="/phone.png" alt="Banner" /> */}
          <Phone />
          <div class="small-circle-1"></div>
          <div class="small-circle-2"></div>
          <div class="small-circle-3"></div>
        </div>
      </div>
    </div>
  );
};

export default BannerMainContent;
