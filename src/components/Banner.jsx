import React from "react";
import './Banner.css'; 

const Banner = () => {
    return (
        <div className="banner">
    <div className="banner-content">
        <div className="banner-left">
            <h1 className="banner-title">Говори. Играј. Учи.</h1>
            <p className="banner-description">
                Апликација за деца со пречки во говорот која помага во комуникацијата
                преку симболи и развој преку забавни игри.
            </p>
            <div className="banner-buttons">
                <button className="banner-button">Отвори<br />Виножито</button>
                <button className="banner-button">Преземи</button>
            </div>
        </div>
        <div className="banner-right">
            <img src="/phone.png" alt="Banner" />
        </div>
    </div>

    {/* SVG Clouds */}
    <div className="banner-clouds">
        <svg className="cloud-svg" viewBox="0 0 1200 100" preserveAspectRatio="none">
            <path fill="white" d="M0,50 C300,150 900,-50 1200,50 V100 H0 Z"></path>
        </svg>
    </div>
</div>

    );
};

export default Banner;