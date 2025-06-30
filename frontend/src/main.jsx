// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'

import "./styles/index.css"; /// main css file
import App from "./App.jsx";
import React from "react";
import ReactDOM from "react-dom/client";
import { SoundProvider } from "./SoundProvider";

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

const entryPoint = document.getElementById("root");
ReactDOM.createRoot(entryPoint).render(
  <React.StrictMode>
    <SoundProvider>
      <App />
    </SoundProvider>
  </React.StrictMode>
);
