import React from "react";
import "./About.css";
import { useEffect, useState } from "react";

export default function About() {
  
  // const [weatherData, setWeatherData] = useState([]);

  // useEffect(() => {
  //   fetch('http://localhost:5109/weatherforecast')
  //     .then(response => response.json())
  //     .then(data => setWeatherData(data))
  //     .catch(error => console.error('Error fetching data:', error));
  // }, []);

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/messages`)
      .then(response => response.json())
      .then(data => setMessages(data))
      .catch(error => console.error('Error fetching messages:', error));
  }, []);

  return (
    <div className="about-page">
      <h1>About Page</h1>
      {/* <ul>
        {weatherData.map((item, index) => (
          <li key={index}>
            {item.date}: {item.temperatureC}°C - {item.summary}
          </li>
        ))}
      </ul> */}

      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}



// const teamMembers = [
//   {
//     name: "Ана",
//     role: "Основач и креативен директор",
//     image: "/team/ana.jpg",
//   },
//   {
//     name: "Анастазија",
//     role: "Основач и креативен директор",
//     image: "/team/anastazija.jpg",
//   }
// ];

// export default function About() {
//   return (
//     <div className="about-page">
//       <h1>Добредојдовте во Виножито! 🌈</h1>
//       <p className="about-intro">
//         Виножито е создадено со љубов кон учењето и играта. Нашата мисија е да инспирираме
//         радост во образованието преку интерактивни и визуелно привлечни алатки.
//       </p>

//       <div className="team-section">
//         {teamMembers.map((member, index) => (
//           <div className="team-card" key={index}>
//             <img src={member.image} alt={member.name} className="team-photo" />
//             <h3>{member.name}</h3>
//             <p>{member.role}</p>
//           </div>
//         ))}
//       </div>

//       {/* <p className="about-intro">
//         Ви благодариме што сте дел од нашето виножито! 
//       </p> */}
//     </div>
//   );
// }
