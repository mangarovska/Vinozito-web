// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'


import './index.css' /// main css file
import App from './App.jsx'
import React from "react";
import ReactDOM from "react-dom/client"

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

const entryPoint = document.getElementById("root")
ReactDOM.createRoot(entryPoint).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
