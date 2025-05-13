import React, { useState, useRef, useEffect } from "react";
import "./CustomSelect.css";

const CustomSelect = ({ options, selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (option) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="animated-dropdown" ref={dropdownRef}>
      <button
        className="dropdown-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{selected.label}</span>
        <svg
          className={`dropdown-icon ${isOpen ? "open" : ""}`}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className={`dropdown-menu ${isOpen ? "open" : ""}`}>
        {options.map((option) => (
          <button
            key={option.value}
            className={`dropdown-item ${
              option.value === selected.value ? "selected" : ""
            }`}
            onClick={() => handleSelect(option)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CustomSelect;