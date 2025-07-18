import React from "react";
import "./PopUp.css";

export default function PopUp({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onCancel} className="close-button">
          ×
        </button>

        <img src="/save.png" alt="popup icon" className="popup-image" />

        <h2>Зачувај прогрес ?</h2>
        <div className="modal-buttons">
          <button
            onClick={() => onConfirm(false)}
            className="modal-button decline"
          >
            Не
          </button>
          <button
            onClick={() => onConfirm(true)}
            className="modal-button confirm"
          >
            Да
          </button>
        </div>
      </div>
    </div>
  );
}
