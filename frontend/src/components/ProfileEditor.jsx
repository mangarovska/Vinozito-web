import React, { useState, useRef, useEffect } from "react";
import "./ProfileEditor.css";

const ProfileEditor = () => {
  const [profile, setProfile] = useState({
    id: "",
    userName: "",
    email: "",
    firstName: "",
    lastName: "",
    profilePicture: "",
    createdAt: "",
  });

  const mkMonths = [
    "Јануари",
    "Февруари",
    "Март",
    "Април",
    "Мај",
    "Јуни",
    "Јули",
    "Август",
    "Септември",
    "Октомври",
    "Ноември",
    "Декември",
  ];

  // Avatar options - using PNG files
  const avatarOptions = [
    { id: "avatar0", url: "/avatars/avatar_0.png" },
    { id: "avatar1", url: "/avatars/avatar_1.png" },
    { id: "avatar2", url: "/avatars/avatar_2.png" },
    { id: "avatar3", url: "/avatars/avatar_3.png" },
    { id: "avatar8", url: "/avatars/avatar_8.png" },
    { id: "avatar9", url: "/avatars/avatar_9.png" },
    { id: "avatar10", url: "/avatars/avatar_10.png" },
    { id: "avatar11", url: "/avatars/avatar_11.png" },
    { id: "avatar4", url: "/avatars/avatar_4.png" },
    { id: "avatar5", url: "/avatars/avatar_5.png" },
    { id: "avatar6", url: "/avatars/avatar_6.png" },
    { id: "avatar7", url: "/avatars/avatar_7.png" },
    { id: "avatar12", url: "/avatars/avatar_12.png" },
    { id: "avatar13", url: "/avatars/avatar_13.png" },
  ];

  const [originalData, setOriginalData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [previewImage, setPreviewImage] = useState("");
  const [errors, setErrors] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

  const fileInputRef = useRef(null);
  const placeholderImg = "/placeholder2.png";

  // Get token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem("token") || "";
  };

  // Fetch current user profile
  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/User/profile", {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Profile data received:", data);
        setProfile(data);
        setOriginalData(data);

        if (data.profilePicture && data.profilePicture.trim() !== "") {
          console.log("Setting preview URL:", data.profilePicture);
          setPreviewImage(data.profilePicture);
        } else {
          console.log("No profile picture found, using placeholder");
          setPreviewImage(placeholderImg);
        }
      } else {
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          localStorage.removeItem("profilePic");
          window.location.href = "/login";
          return;
        }
        throw new Error("Failed to fetch profile");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setMessage({
        text: "Грешка при вчитување на податоците: " + error.message,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (message.text) {
      setMessage({ text: "", type: "" });
    }
  };

  // Handle avatar selection
  const handleAvatarSelect = (avatar) => {
    setPreviewImage(avatar.url);
    setSelectedAvatar(avatar);
    setSelectedFile(null);
    setShowAvatarSelector(false);
    setMessage({ text: "", type: "" });
  };

  // Handle file selection for profile picture
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setMessage({ text: "Ве молиме изберете слика", type: "error" });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setMessage({
          text: "Сликата е премногу голема (максимум 5MB)",
          type: "error",
        });
        return;
      }

      setSelectedFile(file);
      setSelectedAvatar(null);
      setShowAvatarSelector(false);

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);

      setMessage({ text: "", type: "" });
    }
  };

  // Upload profile picture
  const uploadProfilePicture = async () => {
    if (!selectedFile) return null;

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(
        `/api/Upload/image?userId=${profile.id}&type=profile`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
          body: formData,
        }
      );

      console.log("Profile picture upload response status:", response.status);
      const responseText = await response.text();
      console.log("Profile picture upload response:", responseText);

      if (response.ok) {
        const data = JSON.parse(responseText);
        console.log("Profile picture uploaded successfully to:", data.url);
        console.log("Debug info:", data.debug);
        return data.url;
      } else {
        throw new Error(
          `Profile picture upload failed: ${response.status} - ${responseText}`
        );
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      throw error;
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};

    if (!profile.userName || !profile.userName.trim()) {
      newErrors.userName = "Корисничкото име е задолжително";
    } else if (profile.userName.length < 3) {
      newErrors.userName = "Корисничкото име мора да има најмалку 3 карактери";
    }

    if (
      profile.email &&
      profile.email.trim() &&
      !/\S+@\S+\.\S+/.test(profile.email)
    ) {
      newErrors.email = "Внесете валиден е-мејл";
    }

    if (
      profile.firstName &&
      profile.firstName.length > 0 &&
      profile.firstName.length < 2
    ) {
      newErrors.firstName = "Името мора да има најмалку 2 карактери";
    }

    if (
      profile.lastName &&
      profile.lastName.length > 0 &&
      profile.lastName.length < 2
    ) {
      newErrors.lastName = "Презимето мора да има најмалку 2 карактери";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save profile changes
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSaving(true);
      setMessage({ text: "", type: "" });

      let profilePictureUrl = profile.profilePicture;

      if (selectedFile) {
        profilePictureUrl = await uploadProfilePicture();
      } else if (selectedAvatar) {
        profilePictureUrl = selectedAvatar.url;
      } else if (
        previewImage !== originalData.profilePicture &&
        previewImage !== placeholderImg
      ) {
        profilePictureUrl = previewImage;
      }

      const updateData = {
        userName: profile.userName,
        email: profile.email || null,
        firstName: profile.firstName || null,
        lastName: profile.lastName || null,
        profilePicture: profilePictureUrl || null,
      };

      console.log("Sending update data:", updateData);

      const response = await fetch("/api/User/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        setMessage({ text: "Профилот е успешно ажуриран!", type: "success" });
        setSelectedFile(null);
        setSelectedAvatar(null);

        if (updateData.userName !== originalData.userName) {
          localStorage.setItem("username", updateData.userName);
          window.dispatchEvent(new Event("profilePicChanged"));
        }

        if (
          profilePictureUrl &&
          profilePictureUrl !== originalData.profilePicture
        ) {
          localStorage.setItem("profilePic", profilePictureUrl);
          window.dispatchEvent(new Event("profilePicChanged"));
        }

        const updatedProfile = {
          ...profile,
          ...updateData,
          profilePicture: profilePictureUrl || profile.profilePicture,
        };
        setProfile(updatedProfile);
        setOriginalData(updatedProfile);

        setTimeout(() => {
          setMessage({ text: "", type: "" });
        }, 3000);
      } else {
        const errorData = await response.json();
        setMessage({
          text:
            "Грешка при зачувување: " +
            (errorData.message || "Failed to update profile"),
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      setMessage({
        text: "Грешка при зачувување: " + error.message,
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Reset form to original data
  const handleReset = () => {
    setProfile(originalData);
    setPreviewImage(originalData.profilePicture || placeholderImg);
    setSelectedFile(null);
    setSelectedAvatar(null);
    setErrors({});
    setMessage({ text: "", type: "" });
    setShowAvatarSelector(false);
  };

  // Check if there are changes
  const hasChanges = () => {
    const currentData = {
      userName: profile.userName,
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      profilePicture: profile.profilePicture,
    };
    const original = {
      userName: originalData.userName,
      email: originalData.email,
      firstName: originalData.firstName,
      lastName: originalData.lastName,
      profilePicture: originalData.profilePicture,
    };
    return (
      JSON.stringify(currentData) !== JSON.stringify(original) ||
      selectedFile !== null ||
      selectedAvatar !== null
    );
  };

  // Load profile on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Се вчитуваат податоците...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-editor-container">
      <div className="profile-editor-card">
        {/* Header */}
        <div className="header-section">
          <h2 className="main-title">Уреди профил</h2>
          <p className="subtitle">Ажурирајте ги вашите лични податоци</p>
        </div>

        <div className="card-content">
          {/* Message */}
          {message.text && (
            <div
              className={`message-alert ${
                message.type === "success" ? "message-success" : "message-error"
              }`}
            >
              <div className="message-content">
                <span className="message-icon">
                  {message.type === "success" ? "✓" : "⚠"}
                </span>
                {message.text}
              </div>
            </div>
          )}

          {/* Profile Picture Section */}
          <div className="profile-picture-section">
            <div className="profile-picture-container">
              <div className="profile-picture-circle">
                {previewImage && previewImage !== placeholderImg ? (
                  <img
                    src={previewImage}
                    alt="Profile"
                    className={`profile-image-edit ${
                      selectedAvatar ? "profile-image-margin" : ""
                    }`}
                    onError={(e) => {
                      console.log("Image failed to load:", previewImage);
                      e.target.style.display = "none";
                      const userIcon =
                        e.target.parentElement.querySelector(".user-icon");
                      if (userIcon) userIcon.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className={`user-icon ${
                    previewImage && previewImage !== placeholderImg
                      ? "hidden"
                      : ""
                  }`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="#4a5565"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div>

              {/* Edit button */}
              <div className="group">
                <label className="absolute -bottom-1 -right-2 w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center cursor-pointer hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg ring-2 ring-white hover:scale-105">
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                  <button
                    type="button"
                    title="Уреди профилна слика"
                    onClick={() => setShowAvatarSelector(!showAvatarSelector)}
                    className="hidden"
                  />
                  <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                    Уреди профилна слика
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                  </div>
                </label>
              </div>
            </div>

            {/* Avatar Selector */}
            {/* {showAvatarSelector && (
              <div className="avatar-selector">
                <div className="avatar-options">
                  {avatarOptions.map((avatar) => (
                    <div key={avatar.id} className="avatar-option">
                      <button
                        onClick={() => handleAvatarSelect(avatar)}
                        className={`avatar-button ${
                          selectedAvatar?.id === avatar.id
                            ? "avatar-selected"
                            : ""
                        }`}
                      >
                        <img
                          src={avatar.url}
                          alt={`Avatar ${avatar.id}`}
                          className="avatar-image"
                        />
                      </button>
                    </div>
                  ))}

                  <div className="avatar-option group relative">
                    <label className="upload-button">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <input
                        type="file"
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="upload-input"
                        ref={fileInputRef}
                      />
                    </label>
                    <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                      Прикачи сопствена слика
                      <div className="absolute rotate-180 bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                    </div>
                  </div>
                </div>
              </div>
            )} */}

            {showAvatarSelector && (
              <div
                className="modal-overlay"
                onClick={() => setShowAvatarSelector(false)}
              >
                <div
                  className="modal-content-avatar"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Close button */}
                  {/* <button
                    className="close-button"
                    onClick={() => setShowAvatarSelector(false)}
                    type="button"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button> */}

                  {/* <h3 style={{ 
        textAlign: 'center', 
        fontSize: '1.25rem', 
        fontWeight: '600', 
        color: '#1f2937', 
        marginBottom: '1.5rem' 
      }}>
        Choose Profile Picture
      </h3> */}

                  <div className="avatar-options">
                    {avatarOptions.map((avatar) => (
                      <div key={avatar.id} className="avatar-option">
                        <button
                          onClick={() => handleAvatarSelect(avatar)}
                          className={`avatar-button ${
                            selectedAvatar?.id === avatar.id
                              ? "avatar-selected"
                              : ""
                          }`}
                        >
                          <img
                            src={avatar.url}
                            alt={`Avatar ${avatar.id}`}
                            className="avatar-image"
                          />
                        </button>
                        {/* Tick badge moved outside the button */}
                        <div
                          className={`tick-badge ${
                            selectedAvatar?.id === avatar.id ? "visible" : ""
                          }`}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      </div>
                    ))}

                    <div className="avatar-option">
                      <label className="upload-button">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <input
                          type="file"
                          onChange={handleImageUpload}
                          accept="image/*"
                          className="upload-input"
                          ref={fileInputRef}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="member-since">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
              Член од{" "}
              {profile.createdAt
                ? (() => {
                    const date = new Date(profile.createdAt);
                    const day = date.getDate();
                    const month = mkMonths[date.getMonth()];
                    const year = date.getFullYear();
                    return `${day} ${month}, ${year}`;
                  })()
                : "Непознато"}
            </div>
          </div>

          {/* Form Fields */}
          <div className="form-fields">
            <div className="form-field">
              <label htmlFor="userName" className="field-label">
                Корисничко име *
              </label>
              <input
                type="text"
                id="userName"
                name="userName"
                value={profile.userName || ""}
                onChange={handleInputChange}
                className={`field-input ${
                  errors.userName ? "field-error" : ""
                }`}
                placeholder="Внесете корисничко име"
              />
              {errors.userName && (
                <div className="error-message">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.userName}
                </div>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="email" className="field-label">
                Е-мејл
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={profile.email || ""}
                onChange={handleInputChange}
                className={`field-input ${errors.email ? "field-error" : ""}`}
                placeholder="Внесете е-мејл адреса (опционално)"
              />
              {errors.email && (
                <div className="error-message">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.email}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button
              type="button"
              onClick={handleReset}
              disabled={!hasChanges() || isSaving}
              className="cancel-button"
            >
              Откажи
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!hasChanges() || isSaving}
              className="save-button"
            >
              {isSaving ? (
                <span className="saving-content">
                  <div className="saving-spinner"></div>
                  Се зачувува...
                </span>
              ) : (
                "Зачувај промени"
              )}
            </button>
          </div>

          {/* Required Fields Note */}
          <div className="required-note">* Задолжителни полиња</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditor;
