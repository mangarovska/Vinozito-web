import React from "react";
import "./About.css";
import { useEffect, useState } from "react";
import ExpertSection from "./ExpertsSection";

// export default function About() {
  
//   // const [weatherData, setWeatherData] = useState([]);

//   // useEffect(() => {
//   //   fetch('http://localhost:5109/weatherforecast')
//   //     .then(response => response.json())
//   //     .then(data => setWeatherData(data))
//   //     .catch(error => console.error('Error fetching data:', error));
//   // }, []);

//   const [messages, setMessages] = useState([]);

//   useEffect(() => {
//     fetch(`${import.meta.env.VITE_API_URL}/api/messages`)
//       .then(response => response.json())
//       .then(data => setMessages(data))
//       .catch(error => console.error('Error fetching messages:', error));
//   }, []);

//   return (
//     <div className="about-page">
//       <h1>About Page</h1>
//       {/* <ul>
//         {weatherData.map((item, index) => (
//           <li key={index}>
//             {item.date}: {item.temperatureC}°C - {item.summary}
//           </li>
//         ))}
//       </ul> */}

//       <ul>
//         {messages.map((msg, index) => (
//           <li key={index}>{msg}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// const teamMembers = [
//   {
//     name: "Ана",
//     role: "",
//     image: "/team/ana.jpg",
//   },
//   {
//     name: "Анастазија",
//     role: "",
//     image: "/team/anastazija.jpg",
//   }
// ];

export default function About() {
  return (
    <div className="about-wrapper">
      <div className="about-page">
        <h1>Добредојдовте во Виножито !</h1>

        <p className="about-intro">
         „Виножито“ е интерактивна апликација за алтернативна и дополнителна комуникација, наменета за деца и лица со потешкотии во говорот. Со помош на визуелни картички, гласовна поддршка и едукативни игри ја поттикнуваме самостојноста и изразувањето на забавен начин. <br />
         <b>Нашата визија:</b> комуникација достапна за сите.
         {/* Главната идеја е со помош на визуелни картички, гласовна поддршка и едукативни игри да ја поттикнеме самостојноста, учењето и изразувањето на креативен и забавен начин.
          Нашата визија е да креираме лесно достапна средина каде што комуникацијата станува возможна за секого.
        */}
         
</p>
        <ExpertSection />
      </div>
    </div>
  );
}
