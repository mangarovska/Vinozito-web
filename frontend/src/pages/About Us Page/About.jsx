import React from "react";
import "./About.css";

const teamMembers = [
  {
    name: "Ана",
    role: "Основач и креативен директор",
    image: "/team/ana.jpg",
  },
  {
    name: "Анастазија",
    role: "Основач и креативен директор",
    image: "/team/anastazija.jpg",
  }
];

export default function About() {
  return (
    <div className="about-page">
      <h1>Добредојдовте во Виножито! 🌈</h1>
      <p className="about-intro">
        Виножито е создадено со љубов кон учењето и играта. Нашата мисија е да инспирираме
        радост во образованието преку интерактивни и визуелно привлечни алатки.
      </p>

      <div className="team-section">
        {teamMembers.map((member, index) => (
          <div className="team-card" key={index}>
            <img src={member.image} alt={member.name} className="team-photo" />
            <h3>{member.name}</h3>
            <p>{member.role}</p>
          </div>
        ))}
      </div>

      {/* <p className="about-intro">
        Ви благодариме што сте дел од нашето виножито! 
      </p> */}
    </div>
  );
}
