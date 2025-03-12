// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import React, { Fragment } from "react";
import Navbar from "./components/Navbar.jsx";
import Cards from "./components/Cards.jsx";
import Banner from "./components/Banner.jsx";

function App() {
  return (
    <Fragment>
      <Navbar />
      <main>
        <Banner />
        <Cards />
      </main>
    </Fragment>
  );
}

export default App;
