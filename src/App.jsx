import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Cards from "./components/Cards.jsx";
import Banner from "./components/Banner.jsx";
import MainFeatures from "./components/MainFeatures.jsx";
import Footer from "./components/Footer";
import Communication from "./pages/Communication.jsx"; // New Page

function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Banner />
                <Cards />
                <MainFeatures />
              </>
            }
          />
          <Route path="/vinozhito" element={<Communication />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
