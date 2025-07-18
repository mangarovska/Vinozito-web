import React, { useRef, useState, useEffect } from "react";
// import Navbar from "../../components/Navigation Bar/Navbar";
import Banner from "../../components/Banner/Banner";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./CommunicationPage.css";
import { categories } from "../../data";

const CommunicationPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("Животни");
  const [selectedCards, setSelectedCards] = useState([]);
  const [allCards, setAllCards] = useState([]);

  const slotsRef = useRef(null);
  const [showArrows, setShowArrows] = useState(false);
  const categoriesRef = useRef(null);
  const categoryItemRef = useRef(null);

  const categoryRefs = useRef([]);
  categoryRefs.current = [];

  useEffect(() => {
    async function fetchCards() {
      // fetch cards from backend API once on mount
      try {
        const response = await fetch("http://localhost:5100/api/DefaultCard/");
        if (!response.ok) throw new Error("Failed to fetch cards");

        const data = await response.json();

        const cards = data
          .map((card) => ({
            id: card.id,
            name: card.name,
            category: card.category,
            //img: card.image,
            img: `${card.image}?v=${card.id}`, // add versioning
            audioVoice: card.audioVoice,
            position: card.position,
          }))
          .sort((a, b) => a.position - b.position); // order cards

        console.log("Fetched cards:", cards);

        setAllCards(cards);
      } catch (error) {
        console.error(error);
      }
    }

    fetchCards();
  }, []);

  // filter cards by selected category
  const filteredCards = allCards.filter(
    (card) =>
      card.category?.toLowerCase().trim() ===
      selectedCategory.toLowerCase().trim()
  );

  const handleCardClick = (card) => {
    setSelectedCards((prev) => [...prev, card]);

    if (card.audioVoice) {
      const audio = new Audio(card.audioVoice);
      audio.play().catch((error) => {
        console.warn(`Failed to play audio for ${card.name}:`, error);
      });
    }
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
      const padding = 22; // gap value
      const scrollAmount = (categoryWidth + padding) * 3;

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

  const handlePlaySound = () => {
    if (selectedCards.length === 0) return;

    let i = 0;
    const audio = new Audio();
    audio.src = selectedCards[i].audioVoice;
    audio.play();
    audio.onended = () => {
      // playy all
      i++;
      if (i < selectedCards.length) {
        audio.src = selectedCards[i].audioVoice;
        audio.play();
      }
    };
  };

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
                  onClick={handleBackspace}
                  disabled={selectedCards.length === 0}
                  className="icon-button"
                >
                  <img src="/comms-assets/delete.png" alt="Backspace" />
                </button>
                <button
                  onClick={handleClearAll}
                  disabled={selectedCards.length === 0}
                  className="icon-button"
                >
                  <img src="/comms-assets/clear.png" alt="Clear All" />
                </button>{" "}
                <button
                  onClick={handlePlaySound}
                  disabled={selectedCards.length === 0}
                  className="icon-button"
                >
                  <img src="/comms-assets/play.png" alt="Play Sound" />
                </button>{" "}
              </div>

              <div className="slots">
                {selectedCards.length > 0 && (
                  <div className="selected-cards" ref={slotsRef}>
                    {selectedCards.map((card, index) => (
                      <img
                        key={`${card.id}-${index}`}
                        className="card"
                        src={card.img || "/comms-assets/placeholder.png"}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/comms-assets/placeholder.png";
                        }}
                        onClick={() => {
                          if (card.audioVoice) {
                            const audio = new Audio(card.audioVoice);
                            audio
                              .play()
                              .catch((err) =>
                                console.warn(
                                  `Audio failed for ${card.name}:`,
                                  err
                                )
                              );
                          }
                        }}
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

              <div
                className="category-buttons"
                ref={categoriesRef}
                style={
                  showArrows
                    ? {
                        WebkitMaskImage:
                          "linear-gradient(to right, transparent 0%, black 40px, black calc(100% - 40px), transparent 100%)",
                        maskImage:
                          "linear-gradient(to right, transparent 0%, black 40px, black calc(100% - 40px), transparent 100%)",
                      }
                    : {}
                }
              >
                {categories.map((cat, index) => (
                  <button
                    key={cat.value || index}
                    ref={index === 0 ? categoryItemRef : null}
                    className={`category-circle ${
                      cat.value === selectedCategory ? "active" : ""
                    }`}
                    onClick={() => setSelectedCategory(cat.value)}
                  >
                    <img
                      src={cat.img || "/comms-assets/placeholder-category.png"}
                      alt={cat.label}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          "/comms-assets/placeholder-category.png";
                      }}
                      className="category-icon"
                      style={{
                        paddingBottom: cat.bottom || "0px",
                        paddingLeft: cat.left || "0px",
                        marginBottom: cat.margin_bottom || "0px",
                      }}
                    />
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
              <img
                src={card.img || "/comms-assets/placeholder.png"}
                alt={card.name}
                onError={(e) => {
                  e.currentTarget.onerror = null; // prevent infinite loop
                  e.currentTarget.src = "/comms-assets/placeholder.png";
                }}
              />

              <div className="pt-1 pb-1">{card.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunicationPage;
