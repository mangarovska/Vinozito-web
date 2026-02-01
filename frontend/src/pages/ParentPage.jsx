import React, { useState, useEffect, useRef } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaTimes,
  FaImage,
  FaUndo,
  FaMicrophone,
  FaCloudUploadAlt,
  FaEdit,
} from "react-icons/fa";
import { categories } from "../data";
import "./ParentPage.css";
import VoiceRecorder from "./VoiceRecorder";
import CategoryScroller from "../pages/Communication Page/CategoryScroller";

export default function ParentPage() {
  const [allCards, setAllCards] = useState([]);
  const [editingCard, setEditingCard] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [newImageFile, setNewImageFile] = useState(null);
  const [newAudioFile, setNewAudioFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const [activeCategory, setActiveCategory] = useState(
    categories.length > 0 ? categories[0].value : null
  );

  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(true);
  const [showArrows, setShowArrows] = useState(false);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const categoriesRef = useRef(null);
  const categoryItemRef = useRef(null);
  const fileInputRef = useRef(null);

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
        fetch("https://api.mangaserver.ddnsfree.com/api/DefaultCard", {
          headers,
        }),
        fetch(
          `https://api.mangaserver.ddnsfree.com/api/CustomCard/user/${userId}`,
          {
            headers,
          }
        ),
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

        // Include any custom cards that don't map to a default card
        ...customCards
          .filter((card) => !card.defaultCardId || card.defaultCardId === "new")
          .map((customCard) => ({
            id: customCard.id,
            defaultCardId: customCard.defaultCardId,
            name: customCard.title,
            title: customCard.title,
            audioVoice: customCard.voiceAudio,
            image: customCard.image,
            category: activeCategory || "Uncategorized",
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
    setUpdatedTitle(card.title || card.name);
    setNewImageFile(null);
    setNewAudioFile(null);
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files[0] && files[0].type.startsWith("image/")) {
      setNewImageFile(files[0]);
    }
  };

  const handleImageFileSelect = (file) => {
    if (file && file.type.startsWith("image/")) {
      setNewImageFile(file);
    }
  };

  const uploadFile = async (file, type) => {
    try {
      console.log(`Starting ${type} upload for file:`, file.name);

      const formData = new FormData();
      formData.append("file", file);

      const endpoint = type === "image" ? "/upload/image" : "/upload/audio";
      const uploadUrl = `https://api.mangaserver.ddnsfree.com/api${endpoint}?userId=${userId}`;

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

      if (
        result
        // result.url &&
        // result.url !== "https://uploader.mangaserver.ddnsfree.com" //https://mangaserver.ddnsfree.com:5001
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
        newImageUrl = await uploadFile(newImageFile, "image");
      }

      // upload new audio if selected
      if (newAudioFile) {
        newAudioUrl = await uploadFile(newAudioFile, "audio");
      }

      let response;

      // Case 1: brand new card
      if (editingCard.cardType === "New") {
        const createData = {
          defaultCardId: null,
          title: updatedTitle,
          voiceAudio: newAudioUrl,
          image: newImageUrl,
          userId,
          category: activeCategory,
        };

        console.log("Creating brand new custom card:", createData);

        response = await fetch(
          `https://api.mangaserver.ddnsfree.com/api/CustomCard`,
          {
            method: "POST",
            headers,
            body: JSON.stringify(createData),
          }
        );
      }
      // Case 2: editing an existing custom card
      else if (editingCard.cardType === "Custom") {
        const updateData = {
          title: updatedTitle,
          voiceAudio: newAudioUrl,
          image: newImageUrl,
        };

        response = await fetch(
          `https://api.mangaserver.ddnsfree.com/api/CustomCard/${editingCard.id}`,
          {
            method: "PUT",
            headers,
            body: JSON.stringify(updateData),
          }
        );
      }
      // Case 3: editing a default card
      else {
        const existingCustomCard = allCards.find(
          (card) =>
            card.cardType === "Custom" && card.defaultCardId === editingCard.id
        );

        if (existingCustomCard) {
          const updateData = {
            title: updatedTitle,
            voiceAudio: newAudioUrl,
            image: newImageUrl,
          };

          response = await fetch(
            `https://api.mangaserver.ddnsfree.com/api/CustomCard/${existingCustomCard.id}`,
            {
              method: "PUT",
              headers,
              body: JSON.stringify(updateData),
            }
          );
        } else {
          const createData = {
            defaultCardId: editingCard.id,
            title: updatedTitle,
            voiceAudio: newAudioUrl,
            image: newImageUrl,
            userId,
            category: editingCard.category,
          };

          response = await fetch(
            `https://api.mangaserver.ddnsfree.com/api/CustomCard`,
            {
              method: "POST",
              headers,
              body: JSON.stringify(createData),
            }
          );
        }
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Request failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log("Save successful:", result);

      await fetchAllCards();
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
        `https://api.mangaserver.ddnsfree.com/api/CustomCard/${card.id}`,
        {
          method: "DELETE",
          headers,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Revert failed: ${response.status} - ${errorText}`);
      }

      await fetchAllCards();
      alert("Card reverted to default successfully!");
    } catch (err) {
      console.error("Error reverting card", err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleAddNewCard = () => {
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
      <div className="fixed-top-container pt-25">
        <CategoryScroller
          categories={categories}
          selectedCategory={activeCategory}
          setSelectedCategory={(value) => setActiveCategory(value)}
          barStyle={{ top: "148px" }}
        />
      </div>

      <div className="aac-container-parent">
        {activeCategory && (
          <div className="category-view">
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
                            <FaUndo />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
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
          <div
            className="modal-content-card compact-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-body">
              {/* Title Input */}
              <div className="form-group">
                <div className="card-title">
                  <h3>Име:</h3>
                </div>
                <input
                  type="text"
                  value={updatedTitle}
                  onChange={(e) => setUpdatedTitle(e.target.value)}
                  placeholder="Внесете име на картичка"
                  className="title-input mt-1"
                />
              </div>

              <div className="edit-sections-grid">
                {/* Image Section */}
                <div className="card-title mt-3">
                  <h3>Слика:</h3>
                </div>
                <div className="edit-section">
                  <div className="image-preview-container">
                    {/* Always show image preview */}
                    <div className="current-image-preview">
                      <img
                        src={
                          newImageFile
                            ? URL.createObjectURL(newImageFile)
                            : editingCard.image ||
                              "/comms-assets/placeholder.png"
                        }
                        alt="Preview"
                        className="preview-image"
                      />
                      {(newImageFile ||
                        (editingCard.image &&
                          editingCard.image !==
                            "/comms-assets/placeholder.png")) && (
                        <div className="image-overlay">
                          <button
                            className="overlay-btn revert"
                            onClick={() => setNewImageFile(null)}
                            disabled={!newImageFile}
                          >
                            <FaUndo />
                            {/* Врати */}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Always show upload zone below preview */}
                    <div
                      className={`image-upload-zone ${
                        dragOver ? "drag-over" : ""
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="upload-icon"></div>
                      <p className="upload-text">
                        Повлечи слика овде, или{" "}
                        <span className="upload-browse">пребарај</span>
                      </p>
                      <p className="upload-subtext">
                        Поддржува: JPG, JPEG, PNG
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleImageFileSelect(e.target.files[0]);
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Audio Section */}
                <div className="card-title mt-3">
                  <h3>Аудио:</h3>
                </div>
                <div className="edit-section">
                  <div className="audio-controls">
                    {!newAudioFile && editingCard.audioVoice && (
                      <div className="current-audio">
                        <audio controls className="audio-player">
                          <source
                            src={editingCard.audioVoice}
                            type="audio/mpeg"
                          />
                          Вашиот прелистувач не поддржува аудио елемент.
                        </audio>
                      </div>
                    )}

                    <div className="voice-recorder-section">
                      <VoiceRecorder
                        onRecordingComplete={(recordedFile) => {
                          console.log("Recorded file name:", recordedFile.name);
                          setNewAudioFile(recordedFile);
                        }}
                        cardTitle={
                          updatedTitle || editingCard.name || editingCard.title
                        }
                        existingAudio={editingCard.audioVoice}
                        newAudioFile={newAudioFile}
                        onRevertAudio={() => setNewAudioFile(null)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setEditingCard(null)}
                disabled={uploading}
              >
                Откажи
              </button>
              <button
                className="save-btn"
                onClick={saveEdit}
                disabled={uploading || !updatedTitle.trim()}
              >
                {uploading ? "Зачувува..." : "Зачувај"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
