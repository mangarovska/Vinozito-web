import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navigation Bar/Navbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import Menu from "./pages/Menu Page/Menu.jsx";

function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<Menu />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
