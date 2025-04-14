import React from "react";
import "./Navbar.css";
import logo from "/logo.png";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="navbar-container">
      <svg 
        className="navbar-shape" 
        viewBox="0 0 100 10" 
        preserveAspectRatio="none"
      >
        {/* the navbar shape */}
        <path 
          d="M5,0 L100,0 L100,10 L5,10 A5,5 0 0,1 5,0 Z"
          fill="white"
        />
      </svg>

      <nav className="navbar">
        <Link to="/" className="navbar-logo-container">
          <div className="navbar-logo-circle">
            <img src={logo} alt="Logo" className="navbar-logo-image" />
          </div>
        </Link>

        <Link to="/" className="navbar-brand">
          Виножито
        </Link>

        <ul className="navbar-links">
          <li><Link to="/">Дома</Link></li>
          <li><Link to="/about">За нас</Link></li>
          <li className="login-button"><Link to="/login">Најави се</Link></li>
        </ul>
      </nav>
    </div>
  );
}



// export default function Navbar() {
//   return (
//     <div className="navbar-container">
//       <svg 
//         className="navbar-shape" 
//         viewBox="0 0 100 10" 
//         preserveAspectRatio="none"
//       >
//         {/* the navbar shape */}
//         <path 
//           d="M5,0 L100,0 L100,10 L5,10 A5,5 0 0,1 5,0 Z"
//           fill="white"
//         />
//       </svg>

//       <nav className="navbar">
//         <a href="/" className="navbar-logo-container">
//           <div className="navbar-logo-circle">
//             <img src={logo} alt="Logo" className="navbar-logo-image" />
//           </div>
//         </a>

//         <a href="/" className="navbar-brand">
//           Виножито
//         </a>

//         <ul className="navbar-links">
//           <li><a href="#">Дома</a></li>
//           <li><a href="#">За нас</a></li>
//           <li className="login-button"><a href="#">Најави се</a></li>
//         </ul>
//       </nav>
//     </div>
//   );
// }
