import React, { useRef, useState, useEffect } from "react";
// import Navbar from "../../components/Navigation Bar/Navbar";
import Banner from "../../components/Banner/Banner";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./CommunicationPage.css";

const categories = [
  "Разговор",
  "Чувства",
  "Луѓеeee",
  "Пијалоци",
  "Храна",
  "Зеленчук",
  "Овошје",
  "Активности",
  "Животни",
  "Облека",
  "Боииии",
];
const allCards = [
  { id: 1, name: "Мачка", category: "Животни", img: "/placeholder.png" },
  { id: 2, name: "Куче", category: "Животни", img: "/placeholder.png" },
  { id: 3, name: "Јаболко", category: "Овошје", img: "/placeholder.png" },
  { id: 4, name: "Банана", category: "Овошје", img: "/placeholder.png" },
  { id: 5, name: "Круша", category: "Овошје", img: "/placeholder.png" },
  { id: 7, name: "Црвена", category: "Боја", img: "/placeholder.png" },
];

const CommunicationPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("Животни");
  const [selectedCards, setSelectedCards] = useState([]);

  const slotsRef = useRef(null);
  const [showArrows, setShowArrows] = useState(false);
  const categoriesRef = useRef(null);
  const categoryItemRef = useRef(null);

  const filteredCards = allCards.filter(
    (card) => card.category === selectedCategory
  );

  const handleCardClick = (card) => {
    setSelectedCards([...selectedCards, card]);
  };

  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(true);

  const checkScrollPosition = () => {
    if (categoriesRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = categoriesRef.current;
      setShowLeftFade(scrollLeft > 0);
      setShowRightFade(scrollLeft < scrollWidth - clientWidth);
      setShowArrows(scrollWidth > clientWidth);
    }
  };

  const scrollCategories = (direction) => {
    if (categoriesRef.current && categoryItemRef.current) {
      const categoryWidth = categoryItemRef.current.offsetWidth;
      const padding = 18; // gap value
      const scrollAmount = categoryWidth + padding;

      categoriesRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleBackspace = () => {
    setSelectedCards((prev) => prev.slice(0, -1));
  };

  const handleClearAll = () => {
    setSelectedCards([]);
  };

  const handlePlaySound = () => {};

  useEffect(() => {
    const container = categoriesRef.current;
    const handleResize = () => {
      checkScrollPosition();
    };

    if (container) {
      container.addEventListener("scroll", checkScrollPosition);
      window.addEventListener("resize", handleResize);
      checkScrollPosition();

      return () => {
        container.removeEventListener("scroll", checkScrollPosition);
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  useEffect(() => {
    if (slotsRef.current && selectedCards.length > 0) {
      const lastCard = slotsRef.current.lastElementChild;
      lastCard?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "end",
      });
    }
  }, [selectedCards]);

  return (
    <div className="aac-page">
      {/* <Navbar /> */}

      <div className="fixed-top-container">
        <Banner className="communication-banner">
          <div className="communication-top-content">
            <div className="slots-controls">
              <div className="slots-buttons-row">
                <button
                  onClick={handlePlaySound}
                  disabled={selectedCards.length === 0}
                  className="icon-button"
                >
                  <img src="/play.png" alt="Play Sound" />
                </button>
                <button
                  onClick={handleBackspace}
                  disabled={selectedCards.length === 0}
                  className="icon-button"
                >
                  <img src="/delete.png" alt="Backspace" />
                </button>
                <button
                  onClick={handleClearAll}
                  disabled={selectedCards.length === 0}
                  className="icon-button"
                >
                  <img src="/clear.png" alt="Clear All" />
                </button>
              </div>

              <div className="slots">
                {selectedCards.length > 0 && (
                  <div className="selected-cards" ref={slotsRef}>
                    {selectedCards.map((card, index) => (
                      <img
                        key={`${card.id}-${index}`}
                        className="card"
                        src={card.img}
                        alt={card.name}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="category-scroller-container">
              {showArrows && (
                <button
                  className={`scroll-button ${!showLeftFade ? "hidden" : ""}`}
                  onClick={() => scrollCategories("left")}
                  aria-label="Scroll categories left"
                >
                  <FaChevronLeft className="arrow-icon" />
                </button>
              )}

              <div className="category-buttons" ref={categoriesRef}>
                {categories.map((cat, index) => (
                  <button
                    key={cat}
                    ref={index === 0 ? categoryItemRef : null}
                    className={`category-circle ${
                      cat === selectedCategory ? "active" : ""
                    }`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {showArrows && (
                <button
                  className={`scroll-button ${!showRightFade ? "hidden" : ""}`}
                  onClick={() => scrollCategories("right")}
                  aria-label="Scroll categories right"
                >
                  <FaChevronRight className="arrow-icon" />
                </button>
              )}
            </div>
          </div>
        </Banner>
      </div>

      <div className="aac-container">
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
