import React, { useState, useEffect, useRef } from "react";
import { FaChevronLeft, FaChevronRight, FaPlus } from "react-icons/fa"; // Import FaPlus
import { categories } from "../data";
import "./ParentPage.css";
import VoiceRecorder from "./VoiceRecorder";

export default function ParentPage() {
  const [allCards, setAllCards] = useState([]);
  const [editingCard, setEditingCard] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [newImageFile, setNewImageFile] = useState(null);
  const [newAudioFile, setNewAudioFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(true);
  const [showArrows, setShowArrows] = useState(false);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const categoriesRef = useRef(null);
  const categoryItemRef = useRef(null);

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
      const padding = 26;
      const scrollAmount = (categoryWidth + padding) * 3;

      categoriesRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const fetchAllCards = async () => {
    if (!userId || !token) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      console.log("Fetching cards for user:", userId);

      const [defaultRes, customRes] = await Promise.all([
        fetch("http://localhost:5100/api/DefaultCard", { headers }),
        fetch(`http://localhost:5100/api/CustomCard/user/${userId}`, {
          headers,
        }),
      ]);

      console.log("Default cards response:", defaultRes.status);
      console.log("Custom cards response:", customRes.status);

      if (!defaultRes.ok) {
        const errorText = await defaultRes.text();
        throw new Error(
          `Failed to fetch default cards: ${defaultRes.status} - ${errorText}`
        );
      }
      if (!customRes.ok) {
        const errorText = await customRes.text();
        throw new Error(
          `Failed to fetch custom cards: ${customRes.status} - ${errorText}`
        );
      }

      const defaultCards = await defaultRes.json();
      const customCards = await customRes.json();

      console.log("Default cards count:", defaultCards.length);
      console.log("Custom cards count:", customCards.length);

      const customCardMap = new Map(
        customCards.map((card) => [card.defaultCardId, card])
      );

      const processedCards = [
        ...defaultCards.map((defaultCard) => {
          const customCard = customCardMap.get(defaultCard.id);

          return customCard
            ? {
                id: customCard.id,
                defaultCardId: defaultCard.id,
                name: customCard.title,
                title: customCard.title,
                audioVoice: customCard.voiceAudio,
                image: customCard.image || defaultCard.image,
                category: defaultCard.category,
                cardType: "Custom",
                position: defaultCard.position,
              }
            : {
                ...defaultCard,
                defaultCardId: defaultCard.id,
                title: defaultCard.name,
                name: defaultCard.name,
                cardType: "Default",
              };
        }),

        // NEW: Include any custom cards that don't map to a default card
        ...customCards
          .filter((card) => !card.defaultCardId || card.defaultCardId === "new")
          .map((customCard) => ({
            id: customCard.id,
            defaultCardId: customCard.defaultCardId,
            name: customCard.title,
            title: customCard.title,
            audioVoice: customCard.voiceAudio,
            image: customCard.image,
            category: activeCategory || "Uncategorized", // or read category from form
            cardType: "Custom",
          })),
      ];

      console.log("Processed cards count:", processedCards.length);
      setAllCards(processedCards);
    } catch (err) {
      console.error("Failed to fetch cards", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCards();
    const container = categoriesRef.current;
    const handleResize = () => checkScrollPosition();

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

  const handleEdit = (card) => {
    setEditingCard(card);
    setUpdatedTitle(card.title || card.name); // use title first, fallback to name
    setNewImageFile(null);
    setNewAudioFile(null);
  };

  const uploadFile = async (file, type) => {
    try {
      console.log(`Starting ${type} upload for file:`, file.name);

      const formData = new FormData();
      formData.append("file", file); // single file for ASP.NET controller

      const endpoint = type === "image" ? "/upload/image" : "/upload/audio";
      const uploadUrl = `http://localhost:5100/api${endpoint}?userId=${userId}`;

      console.log(`Uploading to: ${uploadUrl}`);

      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      console.log(`Upload response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Upload error response:`, errorText);
        throw new Error(
          `Failed to upload ${type}: ${response.status} - ${errorText}`
        );
      }

      const result = await response.json();
      console.log(`Upload result:`, result);
      console.log(`Upload result URL:`, result.url);
      console.log(`Upload result message:`, result.message);

      if (
        result &&
        result.url &&
        result.url !== "http://mangaserver.ddnsfree.com:5001"
      ) {
        console.log(`Upload successful: ${result.url}`);
        return result.url;
      } else {
        console.error(`Invalid URL received:`, result.url);
        throw new Error(`Invalid URL received: ${result.url || "No URL"}`);
      }
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      throw error;
    }
  };

  const saveEdit = async () => {
    if (!updatedTitle.trim()) {
      alert("Title cannot be empty");
      return;
    }

    try {
      setUploading(true);

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      let newImageUrl = editingCard.image;
      let newAudioUrl = editingCard.audioVoice;

      // upload new image if selected
      if (newImageFile) {
        console.log("Uploading new image...");
        newImageUrl = await uploadFile(newImageFile, "image");
        console.log("Image uploaded to:", newImageUrl);
      }

      // upload new audio if selected
      if (newAudioFile) {
        console.log("Uploading new audio...");
        newAudioUrl = await uploadFile(newAudioFile, "audio");
        console.log("Audio uploaded to:", newAudioUrl);
      }

      let response;
      const isCustom = editingCard.cardType === "Custom";

      if (isCustom) {
        // update existing custom card
        const updateData = {
          title: updatedTitle,
          voiceAudio: newAudioUrl,
          image: newImageUrl,
        };

        console.log(
          "Updating existing custom card:",
          editingCard.id,
          updateData
        );

        response = await fetch(
          `http://localhost:5100/api/CustomCard/${editingCard.id}`,
          {
            method: "PUT",
            headers,
            body: JSON.stringify(updateData),
          }
        );
      } else {
        // check if a custom card already exists for this default card
        const existingCustomCard = allCards.find(
          (card) =>
            card.cardType === "Custom" && card.defaultCardId === editingCard.id
        );

        if (existingCustomCard) {
          // update the existing custom card instead of creating a new one
          const updateData = {
            title: updatedTitle,
            voiceAudio: newAudioUrl,
            image: newImageUrl,
          };

          console.log(
            "Updating existing custom card found:",
            existingCustomCard.id,
            updateData
          );

          response = await fetch(
            `http://localhost:5100/api/CustomCard/${existingCustomCard.id}`,
            {
              method: "PUT",
              headers,
              body: JSON.stringify(updateData),
            }
          );
        } else {
          // create new custom card from default card
          const createData = {
            defaultCardId: editingCard.id, // default card ID
            title: updatedTitle,
            voiceAudio: newAudioUrl,
            image: newImageUrl,
            userId: userId,
            category: editingCard.category,
          };

          console.log("Creating new custom card:", createData);

          response = await fetch(`http://localhost:5100/api/CustomCard`, {
            method: "POST",
            headers,
            body: JSON.stringify(createData),
          });
        }
      }

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response:", errorText);
        throw new Error(`Request failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log("Save successful:", result);

      // refresh the cards after successful save
      console.log("Refreshing cards...");
      await fetchAllCards();
      console.log("Cards refreshed successfully");

      setEditingCard(null);
      alert("Card saved successfully!");
    } catch (err) {
      console.error("Error saving card", err);
      alert(`Error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const revertToDefault = async (card) => {
    if (card.cardType !== "Custom") {
      alert("Only custom cards can be reverted to default");
      return;
    }

    if (
      !confirm(
        "Are you sure you want to revert this card to its default state? This will delete your custom changes."
      )
    )
      return;

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      console.log("Reverting custom card with ID:", card.id);

      const response = await fetch(
        `http://localhost:5100/api/CustomCard/${card.id}`,
        {
          method: "DELETE",
          headers,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Revert failed: ${response.status} - ${errorText}`);
      }

      // refresh all cards after deletion
      await fetchAllCards();
      alert("Card reverted to default successfully!");
    } catch (err) {
      console.error("Error reverting card", err);
      alert(`Error: ${err.message}`);
    }
  };

  // handles adding a new card
  const handleAddNewCard = () => {
    // TODO: add new card logic
    // dummy code
    setEditingCard({
      id: "new",
      cardType: "New",
      title: "",
      name: "",
      image: "/comms-assets/placeholder.png",
      audioVoice: "",
      category: activeCategory,
      defaultCardId: null,
    });
    setUpdatedTitle("");
    setNewImageFile(null);
    setNewAudioFile(null);
  };

  const filteredCards = activeCategory
    ? allCards.filter(
        (card) => card.category?.toLowerCase() === activeCategory.toLowerCase()
      )
    : [];

  if (loading) {
    return (
      <div className="parent-page">
        <div className="loading">Вчитување картички...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="parent-page">
        <div className="error">
          <p>Error: {error}</p>
          <button onClick={fetchAllCards}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="aac-page parent-page">
      <div className="fixed-top-container pt-15">
        <div className="communication-top-parent">
          <div className="category-scroller-wrapper-parent">
            <div className="category-background-bar-parent" />
            <div className="category-scroller-container-parent">
              {showArrows && (
                <button
                  className={`scroll-button ${!showLeftFade ? "hidden" : ""}`}
                  onClick={() => scrollCategories("left")}
                  aria-label="Scroll categories left"
                >
                  <FaChevronLeft className="arrow-icon" />
                </button>
              )}
              <div className="category-buttons-parent" ref={categoriesRef}>
                {categories.map((cat, index) => (
                  <button
                    key={cat.value || index}
                    ref={index === 0 ? categoryItemRef : null}
                    className={`category-circle ${
                      cat.value === activeCategory ? "active" : ""
                    }`}
                    onClick={() => setActiveCategory(cat.value)}
                    aria-label={`Select category ${cat.label}`}
                  >
                    <img
                      src={cat.img || "/comms-assets/placeholder-category.png"}
                      alt={cat.label}
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
                  className={`scroll-button-parent ${
                    !showRightFade ? "hidden" : ""
                  }`}
                  onClick={() => scrollCategories("right")}
                  aria-label="Scroll categories right"
                >
                  <FaChevronRight className="arrow-icon" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="aac-container-parent">
        {activeCategory && (
          <div className="category-view">
            {/* <div className="category-header">
              <h2 className="category-title">
                {categories.find((c) => c.value === activeCategory)?.label} Картички
              </h2>
            </div> */}
            <div className="cards-scroll-container">
              <div className="parent-card-grid">
                {filteredCards.map((card) => {
                  console.log(
                    "Rendering card:",
                    card.name,
                    "Type:",
                    card.cardType
                  );
                  return (
                    <div
                      key={`${card.cardType}-${card.id}`}
                      className="parent-card"
                    >
                      <img
                        src={card.image || "/comms-assets/placeholder.png"}
                        alt={card.name}
                        className="card-image"
                      />
                      <div className="card-title">{card.name}</div>
                      <div
                        className={`card-type-badge ${
                          card.cardType === "Custom" ? "custom" : "default"
                        }`}
                      >
                        {card.cardType === "Custom" ? "Custom" : "Default"}
                      </div>
                      <div className="card-actions">
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(card)}
                        >
                          Подеси
                        </button>
                        {card.cardType === "Custom" && (
                          <button
                            className="revert-btn"
                            onClick={() => revertToDefault(card)}
                          >
                            Врати
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
                {/* ADD NEW CARD */}
                <button className="add-card-button" onClick={handleAddNewCard}>
                  <div className="add-card-content">
                    <FaPlus className="plus-icon" />
                    <span className="add-card-text">Додај нова картичка</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {editingCard && (
        <div className="modal-overlay" onClick={() => setEditingCard(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {/* <h2>
              {editingCard.cardType === "New"
                ? "Креирај нова картичка"
                : `Подеси картичка: ${editingCard.name}`}
            </h2> */}

            <div className="form-group">
              <label htmlFor="card-title">Име:</label>
              <input
                id="card-title"
                type="text"
                value={updatedTitle}
                onChange={(e) => setUpdatedTitle(e.target.value)}
                placeholder="Внесете име на картичка"
              />
            </div>

            <div className="form-group">
              <label htmlFor="card-image-upload">Слика:</label>
              <input
                id="card-image-upload"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setNewImageFile(e.target.files[0]);
                  }
                }}
              />
              <div className="file-previews-container">
                {newImageFile && (
                  <div className="file-preview">
                    <p>Нова слика:</p>
                    <img
                      src={URL.createObjectURL(newImageFile)}
                      alt="Preview"
                      className="preview-image"
                    />
                  </div>
                )}
                {editingCard.image &&
                  !newImageFile && ( 
                    <div className="current-file">
                      {/* <p>Тековна слика:</p> */}
                      <img
                        src={editingCard.image}
                        alt="Current"
                        className="current-image"
                      />
                    </div>
                  )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="card-audio-upload">Аудио:</label>
              {/* <input
                id="card-audio-upload" // Changed ID to avoid conflict
                type="file"
                accept="audio/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setNewAudioFile(e.target.files[0]);
                  }
                }}
              /> */}
              <div className="file-previews-container">
                {newAudioFile && (
                  <div className="file-preview">
                    {/* <p>Ново аудио:</p> */}
                    <audio controls>
                      <source
                        src={URL.createObjectURL(newAudioFile)}
                        type={newAudioFile.type}
                      />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}
                {editingCard.audioVoice &&
                  !newAudioFile && (
                    <div className="current-file">
                      {/* <p>Тековно аудио:</p> */}
                      <audio controls>
                        <source
                          src={editingCard.audioVoice}
                          type="audio/mpeg"
                        />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}
              </div>

              {/* Voice Recorder */}
              <div className="voice-recorder-section">
                <VoiceRecorder
                  onRecordingComplete={(recordedFile) => {
                    console.log("Recorded file name:", recordedFile.name);
                    setNewAudioFile(recordedFile);
                  }}
                  cardTitle={
                    updatedTitle || editingCard.name || editingCard.title
                  }
                />
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="save-btn"
                onClick={saveEdit}
                disabled={uploading}
              >
                {uploading ? "Се зачувува..." : "Зачувај"}
              </button>
              <button
                className="cancel-btn"
                onClick={() => setEditingCard(null)}
                disabled={uploading}
              >
                Откажи
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
