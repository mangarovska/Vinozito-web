import React, { useRef, useState, useEffect } from "react";
// import Navbar from "../../components/Navigation Bar/Navbar";
import Banner from "../../components/Banner/Banner";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./CommunicationPage.css";
import { categories } from "../../data";
import CategoryScroller from "./CategoryScroller";

const CommunicationPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(
    categories.length > 0 ? categories[0].value : ""
  );

  const [selectedCards, setSelectedCards] = useState([]);
  const [allCards, setAllCards] = useState([]);

  const slotsRef = useRef(null);
  const [showArrows, setShowArrows] = useState(false);
  const categoriesRef = useRef(null);
  const categoryItemRef = useRef(null);

  const categoryRefs = useRef([]);
  categoryRefs.current = [];

  const categoryScrollRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(null); // track active card -> card being read
  
  // Ref to track active audio objects for cleanup
  const activeAudiosRef = useRef([]);
  
  // Cleanup function to stop all active audio
  const cleanupAudio = () => {
    activeAudiosRef.current.forEach((audio) => {
      audio.pause();
      audio.src = "";
      audio.onended = null;
    });
    activeAudiosRef.current = [];
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, []);

  const handleCategoryScroll = () => {
    const el = categoryScrollRef.current;
    const overlay = document.getElementById("fadeTop");

    if (!el || !overlay) return;

    if (el.scrollTop > 5) {
      overlay.style.opacity = "0";
    } else {
      overlay.style.opacity = "1";
    }
  };

  useEffect(() => {
    const fetchCards = async () => {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      const fetchDefaultCardsOnly = async () => {
        try {
          const response = await fetch(
            "/api/DefaultCard/" // Uses relative URL - Nginx proxies to backend
          );
          if (!response.ok) throw new Error("Failed to fetch default cards");

          const data = await response.json();
          const cards = data
            .map((card) => ({
              id: card.id,
              name: card.name,
              category: card.category,
              img: `${card.image}?v=${card.id}`,
              audioVoice: card.audioVoice,
              position: card.position,
            }))
            .sort((a, b) => a.position - b.position);

          console.log("Loaded default cards only:", cards.length);
          setAllCards(cards);
        } catch (err) {
          console.error("Error fetching default cards:", err);
        }
      };

      if (!userId || !token) {
        console.log("Not authenticated. Loading only default cards.");
        await fetchDefaultCardsOnly();
        return;
      }

      try {
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const response = await fetch(
          `/api/Card/${userId}`,
          {
            headers,
          }
        );

        if (!response.ok) {
          console.warn(
            "Failed to fetch merged cards. Loading default fallback."
          );
          await fetchDefaultCardsOnly();
          return;
        }

        const cards = await response.json();
        const formattedCards = cards
          .map((card) => ({
            id: card.id,
            name: card.name,
            category: card.category,
            img: `${card.image}?v=${card.id}`,
            audioVoice: card.audioVoice,
            position: card.position ?? 0,
          }))
          .sort((a, b) => a.position - b.position);

        const customCount = cards.filter(
          (c) => c.cardType === "Custom" || c.cardType === 1
        ).length;
        const defaultCount = cards.length - customCount;

        console.log(
          `Loaded ${customCount} custom and ${defaultCount} default cards`
        );
        setAllCards(formattedCards);
      } catch (err) {
        console.error("Error fetching merged cards:", err);
        await fetchDefaultCardsOnly();
      }
    };

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
      activeAudiosRef.current.push(audio);
      audio.onended = () => {
        // Remove from active audios when finished
        const index = activeAudiosRef.current.indexOf(audio);
        if (index > -1) {
          activeAudiosRef.current.splice(index, 1);
        }
      };
      audio.play().catch((error) => {
        console.warn(`Failed to play audio for ${card.name}:`, error);
        // Remove from active audios on error
        const index = activeAudiosRef.current.indexOf(audio);
        if (index > -1) {
          activeAudiosRef.current.splice(index, 1);
        }
      });
    }
  };

  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(true);

  const handleBackspace = () => {
    setSelectedCards((prev) => prev.slice(0, -1));
  };

  const handleClearAll = () => {
    setSelectedCards([]);
  };

  const handlePlaySound = () => {
    if (selectedCards.length === 0) return;

    // Clean up any existing audio before starting new sequence
    cleanupAudio();

    // preload all audios
    const audios = selectedCards.map((card) => {
      const a = new Audio(card.audioVoice);
      a.playbackRate = 1.2; // optional speed-up
      return a;
    });

    // Track all audios in the ref
    activeAudiosRef.current = audios;

    let i = 0;
    setActiveIndex(i);
    audios[i].play();

    audios.forEach((audio, index) => {
      audio.onended = () => {
        // Remove finished audio from tracking
        const idx = activeAudiosRef.current.indexOf(audio);
        if (idx > -1) {
          activeAudiosRef.current.splice(idx, 1);
        }
        
        if (index + 1 < audios.length) {
          setActiveIndex(index + 1);
          audios[index + 1].play();
        } else {
          setActiveIndex(null);
          // Clear tracking when sequence completes
          activeAudiosRef.current = [];
        }
      };
    });
  };

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
              <div className="slots-container">
                <div className="slots">
                  {selectedCards.length > 0 && (
                    <div className="selected-cards" ref={slotsRef}>
                      {selectedCards.map((card, index) => (
                        <img
                          key={`${card.id}-${index}`}
                          className={`card ${
                            index === activeIndex ? "active-card" : ""
                          }`}
                          src={card.img || "/comms-assets/placeholder.png"}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src =
                              "/comms-assets/placeholder.png";
                          }}
                          onClick={() => {
                            if (card.audioVoice) {
                              const audio = new Audio(card.audioVoice);
                              activeAudiosRef.current.push(audio);
                              audio.onended = () => {
                                const index = activeAudiosRef.current.indexOf(audio);
                                if (index > -1) {
                                  activeAudiosRef.current.splice(index, 1);
                                }
                              };
                              audio
                                .play()
                                .catch((err) => {
                                  console.warn(
                                    `Audio failed for ${card.name}:`,
                                    err
                                  );
                                  const index = activeAudiosRef.current.indexOf(audio);
                                  if (index > -1) {
                                    activeAudiosRef.current.splice(index, 1);
                                  }
                                });
                            }
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="slots-buttons-row">
                  <button
                    onClick={handlePlaySound}
                    disabled={selectedCards.length === 0}
                    className="icon-button"
                  >
                    <img src="/comms-assets/play.png" alt="Play Sound" />
                  </button>
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
                  </button>
                </div>
              </div>
            </div>

            <CategoryScroller
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </div>
        </Banner>
      </div>

      <div className="aac-container">
        <div className="scroll-fade-wrapper">
          <div className="fade-top-overlay" id="fadeTop" />
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
    </div>
  );
};

export default CommunicationPage;
