import React, { useEffect, useState } from "react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";

const Flower = ({ flower, disabled }) => {
  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: "flower",
      item: { id: flower.id },
      canDrag: !disabled,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [disabled]
  );

  const [scaledPreview, setScaledPreview] = useState(null);

  useEffect(() => {
    // Scale the preview
    const img = new Image();
    img.src = flower.preview || flower.image;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = 1.3;
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      setScaledPreview(canvas.toDataURL());
    };
  }, [flower]);

  // Register the scaled preview only if enabled
  useEffect(() => {
    if (!disabled && scaledPreview) {
      const img = new Image();
      img.src = scaledPreview;
      img.onload = () => {
        preview(img);
      };
    }
  }, [scaledPreview, disabled, preview]);

  // Clear preview when disabled
  useEffect(() => {
    if (disabled) {
      preview(getEmptyImage(), { captureDraggingState: true });
    }
  }, [disabled, preview]);

  return (
    <img
      ref={drag}
      src={flower.image}
      alt={flower.id}
      style={{
        width: `230px`,
        height: `280px`,
        objectFit: "contain",
        opacity: disabled ? 0.4 : isDragging ? 0.7 : 1,
        margin: "10px",
        cursor: disabled ? "not-allowed" : "grab",
        transition: "opacity 0.2s",
      }}
    />
  );
};

export default Flower;
