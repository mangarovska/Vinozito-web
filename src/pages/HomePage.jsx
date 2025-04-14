import React from "react";
import BannerMainContent from "../components/Banner/BannerMainContent.jsx";
import Cards from "../components/Cards/Cards.jsx";
import MainFeatures from "../components/Features/MainFeatures.jsx";
import Footer from "../components/Footer/Footer.jsx";

const HomePage = () => {
  return (
    <>
      <BannerMainContent />
      <Cards />
      <MainFeatures />
      <Footer />
    </>
  );
};

export default HomePage;
