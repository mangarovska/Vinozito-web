import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "./ColoringCanvas.css";

function BrushPreview({ brushSize }) {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: mousePosition.y - brushSize / 2,
        left: mousePosition.x - brushSize / 2,
        width: brushSize,
        height: brushSize,
        borderRadius: "50%",
        backgroundColor: "rgba(0, 0, 0, 0.15)",
        filter: "blur(1px)",
        pointerEvents: "none",
        zIndex: 1000,
        mixBlendMode: "multiply",
      }}
    />
  );
}

export default function ColoringCanvas() {
  const { imageSrc } = useParams();
  const canvasRef = useRef(null);
  const [selectedColor, setSelectedColor] = useState("#FF0000");
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(10);
  const [isBucketFill, setIsBucketFill] = useState(false);
  const [svgPaths, setSvgPaths] = useState([]);
  const [coloredPaths, setColoredPaths] = useState({});
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [freehandPaths, setFreehandPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState(null);

  const colors = [
    "#FF0000",
    "#FF7F00",
    "#FFFF00",
    "#00FF00",
    "#0000FF",
    "#4B0082",
    "#9400D3",
    "#28282B",
    "#FFFFFF",
    "#C0C0C0",
    "#808080",
    "#FF69B4",
    "#FFA500",
    "#A52A2A",
    "#008000",
    "#00FFFF",
  ];

  const brushSizes = [10, 15, 20, 25, 30];

  useEffect(() => {
    const loadSvgAndInitCanvas = async () => {
      try {
        const response = await fetch(`/${imageSrc}`); // load SVG
        const svgText = await response.text();
        const paths = extractPathsFromSvg(svgText);
        setSvgPaths(paths);

        const canvas = canvasRef.current; // init canvas
        resizeCanvas();

        // Load saved progress if requested
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get("continue")) {
          const saved = loadProgress();
          if (saved) {
            setColoredPaths(saved.paths || {});
            setFreehandPaths(saved.freehandPaths || []);
          }
        }
      } catch (error) {
        console.error("Initialization error:", error);
      }
    };

    loadSvgAndInitCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [imageSrc]);

  useEffect(() => {
    drawCanvas();
  }, [coloredPaths, svgPaths, freehandPaths, canvasSize]);

  const resizeCanvas = () => {
    const container = document.querySelector(".coloring-container");
    if (container && canvasRef.current) {
      const containerWidth = container.clientWidth - 120; // Account for tool column
      const width = Math.min(800, Math.floor(containerWidth)); // Integer width
      const height = Math.floor(width * 0.75); // Integer height, 4:3 ratio

      if (canvasSize.width !== width || canvasSize.height !== height) {
        setCanvasSize({ width, height });
      }
    }
  };

  // In the return statement, update the color palette grid:
  <div className="color-palette">
    {colors.map((color, index) => (
      <div
        key={index}
        className={`color-option ${selectedColor === color ? "selected" : ""}`}
        style={{
          backgroundColor: color,
          flex: "0 0 40px", // Fixed size but flexible in row
          width: "40px",
          height: "40px",
        }}
        onClick={() => setSelectedColor(color)}
      />
    ))}
  </div>;

  const extractPathsFromSvg = (svgText) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgText, "image/svg+xml");
    const paths = doc.querySelectorAll("path");

    return Array.from(paths).map((path, index) => ({
      id: path.id || `path-${index}`,
      d: path.getAttribute("d"),
      fill: path.getAttribute("fill") || "none",
      stroke: path.getAttribute("stroke") || "black",
      strokeWidth: path.getAttribute("stroke-width") || "1",
    }));
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fill background if specified
    if (coloredPaths.background) {
      ctx.fillStyle = coloredPaths.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw SVG paths with their colors
    svgPaths.forEach((path) => {
      const path2D = new Path2D(path.d);
      ctx.fillStyle = coloredPaths[path.id] || path.fill;
      ctx.strokeStyle = path.stroke;
      ctx.lineWidth = path.strokeWidth;
      ctx.fill(path2D);
      ctx.stroke(path2D);
    });

    // Redraw freehand paths
    freehandPaths.forEach((path) => {
      ctx.beginPath();
      ctx.moveTo(path.points[0].x, path.points[0].y);
      for (let i = 1; i < path.points.length; i++) {
        ctx.lineTo(path.points[i].x, path.points[i].y);
      }
      ctx.strokeStyle = path.color;
      ctx.lineWidth = path.size;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
    });

    // Draw current path if exists
    if (currentPath && currentPath.points.length > 1) {
      ctx.beginPath();
      ctx.moveTo(currentPath.points[0].x, currentPath.points[0].y);
      for (let i = 1; i < currentPath.points.length; i++) {
        ctx.lineTo(currentPath.points[i].x, currentPath.points[i].y);
      }
      ctx.strokeStyle = currentPath.color;
      ctx.lineWidth = currentPath.size;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
    }
  };

  const getCanvasMousePosition = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const floodFill = (x, y, targetColor, fillColor) => {
    x = Math.floor(x); // Ensure integer coordinates
    y = Math.floor(y);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = pixelData.data;
    const width = canvas.width;
    const height = canvas.height;

    const getPixelIndex = (x, y) => (y * width + x) * 4;
    const targetRgba = hexToRgba(targetColor);
    const fillRgba = hexToRgba(fillColor);

    const stack = [{ x, y }];
    const visited = new Set();

    while (stack.length > 0) {
      const { x, y } = stack.pop();
      const index = getPixelIndex(x, y);

      // Boundary checks
      if (x < 0 || x >= width || y < 0 || y >= height) continue;
      if (visited.has(`${x},${y}`)) continue;

      visited.add(`${x},${y}`);

      // Skip if pixel is black (outline)
      if (isBlack(data, index)) continue;

      // Check if pixel matches target color (with tolerance)
      if (!colorsMatch(data, index, targetRgba)) continue;

      // Fill the pixel
      data[index] = fillRgba.r;
      data[index + 1] = fillRgba.g;
      data[index + 2] = fillRgba.b;
      data[index + 3] = fillRgba.a;

      // Add neighbors to stack
      stack.push({ x: x + 1, y });
      stack.push({ x: x - 1, y });
      stack.push({ x, y: y + 1 });
      stack.push({ x, y: y - 1 });
    }

    ctx.putImageData(pixelData, 0, 0);
  };

const isBlack = (data, index) => {
  return (
    data[index] < 30 && // R
    data[index + 1] < 30 && // G
    data[index + 2] < 30 && // B
    data[index + 3] > 200 // Alpha (not transparent)
  );
};

  const hexToRgba = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b, a: 255 };
  };

  const colorsMatch = (data, index, target) => {
    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];
    const a = data[index + 3];

    // Simple color matching with some tolerance
    return (
      Math.abs(r - target.r) < 50 &&
      Math.abs(g - target.g) < 50 &&
      Math.abs(b - target.b) < 50
    );
  };

  // State for tracking all operations
  const [history, setHistory] = useState([]);
  const [historyPointer, setHistoryPointer] = useState(-1);

  // Modified startDrawing for bucket fill
  const startDrawing = (e) => {
    const { x, y } = getCanvasMousePosition(e);

    if (isBucketFill) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      if (isBlack(pixel, 0)) return;

      const targetColor = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
      const clickedPath = findClickedPath(x, y);

      if (clickedPath) {
        // Fill a specific path
        saveToHistory({
          type: "fill",
          pathId: clickedPath.id,
          prevColor: coloredPaths[clickedPath.id],
          newColor: selectedColor,
        });
        setColoredPaths((prev) => ({
          ...prev,
          [clickedPath.id]: selectedColor,
        }));
      } else {
        // Fill the background
        saveToHistory({
          type: "fillBackground",
          prevColor: coloredPaths.background,
          newColor: selectedColor,
        });
        floodFill(Math.round(x), Math.round(y), targetColor, selectedColor);
        setColoredPaths((prev) => ({
          ...prev,
          background: selectedColor,
        }));
      }
      return;
    }

    // For drawing mode
    setIsDrawing(true);
    setCurrentPath({
      points: [{ x, y }],
      color: selectedColor,
      size: brushSize,
      id: `drawing-${Date.now()}`,
    });
  };

  // Helper to save operations to history
  const saveToHistory = (operation) => {
    setHistory((prev) => [...prev.slice(0, historyPointer + 1), operation]);
    setHistoryPointer((prev) => prev + 1);
  };

  const findClickedPath = (x, y) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Check each path to see if the point is inside
    for (const path of svgPaths) {
      const path2D = new Path2D(path.d);
      if (ctx.isPointInPath(path2D, x, y)) {
        return path;
      }
    }
    return null;
  };

  const draw = (e) => {
    if (!isDrawing || isBucketFill) return;

    const { x, y } = getCanvasMousePosition(e);
    setCurrentPath((prev) => ({
      ...prev,
      points: [...prev.points, { x, y }],
    }));
  };

  const stopDrawing = () => {
    if (isDrawing && currentPath && currentPath.points.length > 1) {
      // Save to history before adding to paths
      saveToHistory({
        type: "draw",
        path: currentPath,
      });

      setFreehandPaths((prev) => [...prev, currentPath]);
    }
    setIsDrawing(false);
    setCurrentPath(null);
  };

  const saveProgress = () => {
    const canvas = canvasRef.current;
    const data = {
      paths: coloredPaths,
      freehandPaths: freehandPaths,
      drawing: canvas.toDataURL("image/png"),
    };

    localStorage.setItem(`saved_${imageSrc}`, JSON.stringify(data));
    alert("Progress saved!");
  };

  const loadProgress = () => {
    const saved = localStorage.getItem(`saved_${imageSrc}`);
    return saved ? JSON.parse(saved) : null;
  };

  // Modified clearAll
  const clearAll = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHistory([]);
    setHistoryPointer(-1);
    setFreehandPaths([]);
    setColoredPaths({});
  };
  const saveToPC = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = `coloring-${imageSrc.split(".")[0]}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  // const handleColorPath = (pathId, color) => {
  //   setOperations((prev) => [...prev, currentOperation]);

  //   setColoredPaths((prev) => ({
  //     ...prev,
  //     [pathId]: color,
  //   }));

  //   setCurrentOperation(null);
  // };

const handleUndo = () => {
  if (historyPointer < 0) return;

  const lastAction = history[historyPointer];

  if (lastAction.type === "fill") {
    setColoredPaths((prev) => ({
      ...prev,
      [lastAction.pathId]: lastAction.prevColor,
    }));
  } else if (lastAction.type === "fillBackground") {
    setColoredPaths((prev) => ({
      ...prev,
      background: lastAction.prevColor,
    }));
  } else if (lastAction.type === "draw") {
    setFreehandPaths((prev) => prev.filter((p) => p.id !== lastAction.path.id));
  }

  setHistoryPointer((prev) => prev - 1);
  drawCanvas();
};

  return (
    <div className="coloring-page">
      {!isBucketFill && <BrushPreview brushSize={brushSize} />}

      <div className="coloring-container">
        <div
          className="canvas-area"
          style={{
            width: `${canvasSize.width}px`,
            height: `${canvasSize.height}px`,
          }}
        >
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            style={{
              cursor: isBucketFill ? "pointer" : "crosshair",
              width: "100%",
              height: "100%",
              display: "block", // Removes inline element spacing
            }}
          />
        </div>

        <div className="action-buttons-column">
          <button
            onClick={handleUndo}
            className="action-button"
            disabled={historyPointer < 0}
            title="Undo last action"
          >
            <img src="/undo.png" alt="Undo" />
          </button>
          <button onClick={clearAll} className="action-button">
            <img src="/trash.png" alt="Clear All" />
          </button>
          <button onClick={saveProgress} className="action-button">
            <img src="/check.png" alt="Save Progress" />
          </button>
          <button onClick={saveToPC} className="action-button">
            <img src="/save.png" alt="Save to PC" />
          </button>

          <button
            onClick={() => setIsBucketFill(true)}
            className={`tool-button ${isBucketFill ? "active" : ""}`}
          >
            <img src="/bucket.png" alt="Bucket Fill" />
          </button>

          <button
            onClick={() => setIsBucketFill(false)}
            className={`tool-button ${!isBucketFill ? "active" : ""}`}
          >
            <img src="/pencil.png" alt="Pencil Draw" />
          </button>

          {/* <button
            onClick={() => setIsBucketFill(!isBucketFill)}
            className={`tool-button ${isBucketFill ? "active" : ""}`}
          >
            <img
              src={isBucketFill ? "/bucket.png" : "/pencil.png"}
              alt={isBucketFill ? "Bucket Fill" : "Pencil Draw"}
            />
          </button> */}

          {/* Brush sizes - only visible when pencil is active */}
          <div className={`brush-sizes-column ${isBucketFill ? "hidden" : ""}`}>
            {brushSizes.map((size) => (
              <button
                key={size}
                className={`brush-size ${brushSize === size ? "active" : ""}`}
                onClick={() => setBrushSize(size)}
                style={{
                  width: `${size + 20}px`,
                  height: `${size + 20}px`,
                  backgroundColor: "transparent",
                }}
                title={`Brush size: ${size}px`}
              >
                <div
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundColor: selectedColor,
                    borderRadius: "50%",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="color-palette-bottom">
        {colors.map((color, index) => (
          <div
            key={index}
            className={`color-option ${
              selectedColor === color ? "selected" : ""
            }`}
            style={{ backgroundColor: color }}
            onClick={() => setSelectedColor(color)}
          />
        ))}
      </div>
    </div>
  );
}
