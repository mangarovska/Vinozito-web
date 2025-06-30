import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { LoadingProvider, useLoading } from "./LoadingContext";
import LoadingScreen from "./pages/LoadingScreen";
// import { SoundProvider } from "./SoundProvider";

import Navbar from "./components/Navigation Bar/Navbar.jsx";
import MemoryGame from "./components/Memory/GameBoard.jsx";
import ConnectingGame from "./components/Connect/ConnectGame.jsx";

import LandingPage from "./pages/Landing/LandingPage.jsx";
import GetApp from "./pages/GetApp/GetApp.jsx";
import Menu from "./pages/Menu Page/Menu.jsx";
import GamesMenu from "./pages/Menu Page/GamesMenu.jsx";
import About from "./pages/About Us Page/About.jsx";
import CommunicationPage from "./pages/Communication Page/CommunicationPage.jsx";
import Relax from "./pages/Relax Page/Relax.jsx";
import ColoringPage from "./pages/Coloring Page/ColoringPage.jsx";
import ColoringCanvas from "./pages/Coloring Page/ColoringCanvas.jsx";
import LoginPage from "./pages/LoginPage.jsx";

function InnerApp() {
  const { isLoading } = useLoading();

  // if (isLoading) return <LoadingScreen />;

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/app" element={<GetApp />} />
        <Route path="/games" element={<GamesMenu />} />
        <Route path="/about" element={<About />} />
        <Route path="/communication" element={<CommunicationPage />} />
        <Route path="/relax" element={<Relax />} />
        <Route path="/coloring" element={<ColoringPage />} />
        <Route path="/canvas/:imageSrc" element={<ColoringCanvas />} />
        <Route path="/memory" element={<MemoryGame />} />
        <Route path="/connect" element={<ConnectingGame />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>

      {isLoading && <LoadingScreen />}
    </>
  );
}

export default function App() {
  return (
    <LoadingProvider>
      <DndProvider backend={HTML5Backend}>
        <Router>
          <InnerApp />
        </Router>
      </DndProvider>
    </LoadingProvider>
  );
}
