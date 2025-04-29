import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navigation Bar/Navbar.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import Menu from "./pages/Menu Page/Menu.jsx";
import About from "./pages/About Us Page/About.jsx";
import CommunicationPage from "./pages/CommunicationPage.jsx"; 
import Relax from "./pages/Relax/Relax.jsx"; 


function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/about" element={<About />} />

          <Route path="/communication" element={<CommunicationPage />} />
          <Route path="/relax" element={<Relax />} />
        </Routes>
      </main>
    </Router>
    
  );
}

export default App;
