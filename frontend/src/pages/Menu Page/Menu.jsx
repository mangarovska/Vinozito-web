import React from "react";
import Navbar from "../../components/Navigation Bar/Navbar.jsx";
import Banner from "../../components/Banner/Banner.jsx";
import BlobRow from "../../components/BlobRow.jsx";
import "./BackgroundDetails.css";

import Title from "../../components/Title/Title.jsx";

const Menu = () => {
  return (
    <div>
      <Navbar />
      <Banner>
        <Title>Виножито</Title>
      </Banner>
      <div className="menu-page">
        <BlobRow />
      </div>
    </div>
  );
};

export default Menu;
