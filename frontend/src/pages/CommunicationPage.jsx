import React, { useRef, useState, useEffect } from "react";
import Navbar from "../components/Navigation Bar/Navbar";
import Banner from "../components/Banner/Banner";
import "./CommunicationPage.css";

const categories = ["Животни", "Овошје", "Возила", "Боја"];
const allCards = [
  { id: 1, name: "Мачка", category: "Животни", img: "/placeholder.png" },
  { id: 2, name: "Куче", category: "Животни", img: "/placeholder.png" },
  { id: 3, name: "Јаболко", category: "Овошје", img: "/placeholder.png" },
  { id: 4, name: "Автомобил", category: "Возила", img: "/placeholder.png" },
  { id: 5, name: "Црвена", category: "Боја", img: "/placeholder.png" },
];

const CommunicationPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("Животни");
  const [selectedCards, setSelectedCards] = useState([]);
  const slotsRef = useRef(null);

  const filteredCards = allCards.filter(
    (card) => card.category === selectedCategory
  );

  const handleCardClick = (card) => {
    setSelectedCards([...selectedCards, card]);
  };

  useEffect(() => {
    if (slotsRef.current && selectedCards.length > 0) {
      const lastCard = slotsRef.current.lastElementChild;
      lastCard?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "end"
      });
    }
  }, [selectedCards]);

  return (
    <div className="aac-page">
      <Navbar />

      <Banner>
        <div className="slots">
          {selectedCards.length > 0 && (
            <div className="selected-cards" ref={slotsRef}>
              {selectedCards.map((card, index) => (
                <img
                  key={`${card.id}-${index}`}  // Unique key for duplicates
                  className="card"
                  src={card.img}
                  alt={card.name}
                />
              ))}
            </div>
          )}
        </div>
      </Banner>

      <div className="aac-container">
        <div className="category-buttons">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-circle ${
                cat === selectedCategory ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="category-card-rectangle">
          {filteredCards.map((card) => (
            <div
              key={card.id}
              className="category-card"
              onClick={() => handleCardClick(card)}
            >
              <img src={card.img} alt={card.name} />
              <div>{card.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunicationPage;
