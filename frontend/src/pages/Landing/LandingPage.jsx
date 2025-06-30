import React from "react";
import BannerMainContent from "../../components/Banner/BannerMainContent.jsx";
import BlobCards from "../../components/Cards/BlobCards.jsx";
import Newsletter from "../../components/Newsletter/Newsletter.jsx";
import MainFeatures from "../../components/Features/MainFeatures.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import FloatingShapes from "../../components/FloatingShapes.jsx";

import "./LandingPage.css";

const LandingPage = () => {
  return (
    <div className="landing-page-wrapper">
      <BannerMainContent />

      <div className="shape-section-wrapper">
        <div className="shapes-container">
          {/* <FloatingShapes /> */}
        </div>

        <BlobCards />
        <MainFeatures />
        <Newsletter />
        <Footer />
      </div>
    </div>
  );
};


export default LandingPage;
