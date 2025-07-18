import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import PopUp from "./PopUpSave";
import SaveProgressModal from "./PopUp";

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
  const navigate = useNavigate();
  const wasClearedRef = useRef(false);
  // const location = useLocation();
  // const hasSavedRef = useRef(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const backCallbackRef = useRef(null);

  const [selectedColor, setSelectedColor] = useState("#FF4D4D");
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(10);
  const [isBucketFill, setIsBucketFill] = useState(false);
  const [svgData, setSvgData] = useState({
    paths: [],
    width: 0,
    height: 0,
  });
  const [coloredPaths, setColoredPaths] = useState({});
  const [canvasSize, setCanvasSize] = useState({
    width: 800.16,
    height: 590.16,
  });
  const [freehandPaths, setFreehandPaths] = useState([]);
  // const [currentPath, setCurrentPath] = useState(null);
  const currentPathRef = useRef(null);
  const [history, setHistory] = useState([]);
  const [historyPointer, setHistoryPointer] = useState(-1);

  //const [svgPadding, setSvgPadding] = useState(50);
  const [svgPadding] = useState(-35);
  const isDrawingRef = useRef(false);

  const colors = [
    "#FF4D4D",
    "#FFB733",
    "#FFFF80",
    "#99FF99",
    "#CAE4EB",
    "#8080FF",
    // "#4B0082",
    "#FFC0CB",
    "#BF40BF",
    "#28282B",
    // "#FFFFFF",
    "#C0C0C0",
    // "#808080",
    // "#FFA500",
    "#FFFFFF",
    // "#808080",
    "#8F6D51",
  ];

  const brushSizes = [10, 15, 20, 25, 30];

  // const coloredPathsRef = useRef(coloredPaths);
  // const freehandPathsRef = useRef(freehandPaths);

  // useEffect(() => {
  //   coloredPathsRef.current = coloredPaths;
  // }, [coloredPaths]);

  // useEffect(() => {
  //   freehandPathsRef.current = freehandPaths;
  // }, [freehandPaths]);

  const [initialColoredPaths, setInitialColoredPaths] = useState({});
  const [initialFreehandPaths, setInitialFreehandPaths] = useState([]);
  //const [showSaveModal, setShowSaveModal] = useState(false);
  const [pendingBack, setPendingBack] = useState(false);

  const [saveSilent, setSaveSilent] = useState(false); // whether to actually save or not
  //const backCallbackRef = useRef(null); // to store onConfirm function
  useEffect(() => {
    const isSameColored =
      JSON.stringify(coloredPaths) === JSON.stringify(initialColoredPaths);
    const isSameFreehand =
      JSON.stringify(freehandPaths) === JSON.stringify(initialFreehandPaths);
    const noChanges = isSameColored && isSameFreehand;
    const noHistory = historyPointer < 0;

    window.hasUnsavedCanvasChanges = !(noChanges && noHistory);
  }, [
    coloredPaths,
    freehandPaths,
    initialColoredPaths,
    initialFreehandPaths,
    historyPointer,
  ]);

  useEffect(() => {
    const handleBackConfirmation = (e) => {
      const isSameColored =
        JSON.stringify(coloredPaths) === JSON.stringify(initialColoredPaths);
      const isSameFreehand =
        JSON.stringify(freehandPaths) === JSON.stringify(initialFreehandPaths);
      const noChanges = isSameColored && isSameFreehand;
      const noHistory = historyPointer < 0;

      if (noChanges && noHistory) {
        if (e.detail?.onConfirm) e.detail.onConfirm(false);
        return;
      }

      backCallbackRef.current = e.detail?.onConfirm || null;
      setShowSaveModal(true);
    };

    window.addEventListener("confirm-canvas-back", handleBackConfirmation);
    return () => {
      window.removeEventListener("confirm-canvas-back", handleBackConfirmation);
    };
  }, [
    coloredPaths,
    freehandPaths,
    initialColoredPaths,
    initialFreehandPaths,
    historyPointer,
  ]);

  useEffect(() => {
    return () => {
      saveProgress(true); // silent save -> save progress on unmount
    };
  }, []);

  useEffect(() => {
    const loadSvgAndInitCanvas = async () => {
      try {
        const response = await fetch(`/${imageSrc}`);
        const svgText = await response.text();
        const { paths, width, height } = extractPathsFromSvg(svgText);
        const backgroundPath = {
          id: "background",
          d: `M0 0 H${svgData.width} V${svgData.height} H0 Z`,
          fill: "#ffffff", // default background
          isBackground: true, // custom flag so you know it's the background
        };

        setSvgData({ paths, width, height });

        resizeCanvas();

        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get("continue")) {
          const saved = loadProgress();
          if (saved) {
            setColoredPaths(saved.paths || {});
            setFreehandPaths(saved.freehandPaths || []);

            setInitialColoredPaths(saved.paths || {});
            setInitialFreehandPaths(saved.freehandPaths || []);
          }
        } else {
          // new/empty session: store empty initial state
          setInitialColoredPaths({});
          setInitialFreehandPaths([]);
        }

        svgData.paths = [backgroundPath, ...svgData.paths];
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
  }, [coloredPaths, svgData, freehandPaths, canvasSize]);

  const resizeCanvas = () => {
    const container = document.querySelector(".coloring-container");
    if (container && canvasRef.current) {
      const containerWidth = container.clientWidth - 120;
      const width = Math.min(800, Math.floor(containerWidth));
      const height = Math.floor(width * 0.75);

      if (canvasSize.width !== width || canvasSize.height !== height) {
        setCanvasSize({ width, height });
      }
    }
  };

  const extractPathsFromSvg = (svgText) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgText, "image/svg+xml");
    const svgElement = doc.querySelector("svg");
    const paths = doc.querySelectorAll("path");

    let svgWidth = parseFloat(svgElement.getAttribute("width"));
    let svgHeight = parseFloat(svgElement.getAttribute("height"));
    const viewBox = svgElement.getAttribute("viewBox");

    if (viewBox) {
      const parts = viewBox.split(" ");
      svgWidth = parseFloat(parts[2]) || svgWidth;
      svgHeight = parseFloat(parts[3]) || svgHeight;
    }

    return {
      paths: Array.from(paths).map((path, index) => ({
        id: path.id || `path-${index}`,
        d: path.getAttribute("d"),
        fill: path.getAttribute("fill") || "none",
        stroke: imageSrc.includes("candy")
          ? "black"
          : path.getAttribute("stroke") || "black",
        strokeWidth: path.getAttribute("stroke-width") || "1",
      })),
      width: svgWidth,
      height: svgHeight,
    };
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !svgData.paths.length) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const availableWidth = canvas.width - svgPadding * 2; // calculate scale and offset
    const availableHeight = canvas.height - svgPadding * 2;
    const scale = Math.min(
      availableWidth / svgData.width,
      availableHeight / svgData.height
    );
    const xOffset = svgPadding + (availableWidth - svgData.width * scale) / 2;
    const yOffset = svgPadding + (availableHeight - svgData.height * scale) / 2;

    if (coloredPaths.background) {
      // draw background with mask
      ctx.save();

      // draw background color first
      ctx.fillStyle = coloredPaths.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // erase areas covered by SVG paths
      ctx.globalCompositeOperation = "destination-out";

      // draw all SVG paths to create mask
      ctx.save();
      ctx.translate(xOffset, yOffset);
      ctx.scale(scale, scale);
      svgData.paths.forEach((path) => {
        const path2D = new Path2D(path.d);
        ctx.fill(path2D);
      });
      ctx.restore();

      // reset composite operation
      ctx.globalCompositeOperation = "source-over";
      ctx.restore();
    } else {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // draw SVG artwork normally
    ctx.save();
    ctx.translate(xOffset, yOffset);
    ctx.scale(scale, scale);

    svgData.paths.forEach((path) => {
      const path2D = new Path2D(path.d);
      ctx.fillStyle = coloredPaths[path.id] || path.fill;
      ctx.strokeStyle = path.stroke;
      ctx.lineWidth = path.strokeWidth;

      ctx.fill(path2D);
      ctx.stroke(path2D);
    });

    ctx.restore();
    // draw stored paths
    freehandPaths.forEach((path) => {
      ctx.save();
      ctx.translate(xOffset, yOffset);
      ctx.scale(scale, scale);

      if (path.type === "bucketFill") {
        // Find the SVG path to fill
        const svgPath = svgData.paths.find((p) => p.id === path.svgPathId);
        if (svgPath) {
          const fillPath = new Path2D(svgPath.d);
          ctx.fillStyle = path.color;
          ctx.fill(fillPath);
        }
      } else {
        // normal freehand drawing stroke (array of points)
        if (!path.points || path.points.length < 2) {
          ctx.restore();
          return;
        }

        if (path.svgPathId) {
          const svgPath = svgData.paths.find((p) => p.id === path.svgPathId);
          if (svgPath) {
            const clipPath = new Path2D(svgPath.d);
            ctx.clip(clipPath);
          }
        }

        ctx.beginPath();
        ctx.moveTo(path.points[0].x, path.points[0].y);
        path.points.forEach((point) => ctx.lineTo(point.x, point.y));
        ctx.strokeStyle = path.color;
        ctx.lineWidth = path.size / scale;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
      }

      ctx.restore();
    });

    // draw current path if it exists
    if (currentPathRef.current) {
      const path = currentPathRef.current;
      ctx.save();
      ctx.translate(xOffset, yOffset);
      ctx.scale(scale, scale);

      // apply clipping if SVG path ID exists
      if (path.svgPathId) {
        const svgPath = svgData.paths.find((p) => p.id === path.svgPathId);
        if (svgPath) {
          const clipPath = new Path2D(svgPath.d);
          ctx.clip(clipPath);
        }
      }

      // draw path
      ctx.beginPath();
      ctx.moveTo(path.points[0].x, path.points[0].y);
      path.points.forEach((point) => ctx.lineTo(point.x, point.y));
      ctx.strokeStyle = path.color;
      ctx.lineWidth = path.size / scale;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();

      ctx.restore();
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

  const startDrawing = (e) => {
    const { x, y } = getCanvasMousePosition(e);
    const clickedPath = findClickedPath(x, y);

    if (isBucketFill) {
      if (clickedPath?.isOutline) return;

      if (clickedPath) {
        const bucketFillPath = {
          id: `bucketfill-${Date.now()}`, // unique id
          svgPathId: clickedPath.id,
          color: selectedColor,
          type: "bucketFill", // special type
        };
        saveToHistory({ type: "draw", path: bucketFillPath });
        setFreehandPaths((prev) => [...prev, bucketFillPath]);
      } else {
        // Fill background - can keep as before or create special background fill layer
        saveToHistory({
          type: "fillBackground",
          prevColor: coloredPaths.background,
          newColor: selectedColor,
        });
        setColoredPaths((prev) => ({
          ...prev,
          background: selectedColor,
        }));
      }
      return;
    }

    // prevent drawing on outlines or outside all paths
    if (clickedPath?.isOutline || !clickedPath) return;

    // normal drawing inside fill areas
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const availableWidth = canvas.width - svgPadding * 2;
    const availableHeight = canvas.height - svgPadding * 2;
    const scale = Math.min(
      availableWidth / svgData.width,
      availableHeight / svgData.height
    );
    const xOffset = svgPadding + (availableWidth - svgData.width * scale) / 2;
    const yOffset = svgPadding + (availableHeight - svgData.height * scale) / 2;

    const svgX = (x - xOffset) / scale;
    const svgY = (y - yOffset) / scale;

    currentPathRef.current = {
      points: [{ x: svgX, y: svgY }],
      color: selectedColor,
      size: brushSize,
      id: `drawing-${Date.now()}`,
      svgPathId: clickedPath?.id || null,
    };

    isDrawingRef.current = true;
    setIsDrawing(true);

    window.addEventListener("mousemove", draw);
    window.addEventListener("mouseup", stopDrawing);
  };

  const saveToHistory = (operation) => {
    setHistory((prev) => [...prev.slice(0, historyPointer + 1), operation]);
    setHistoryPointer((prev) => prev + 1);
  };

  const findClickedPath = (x, y) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext("2d");

    const availableWidth = canvas.width - svgPadding * 2;
    const availableHeight = canvas.height - svgPadding * 2;
    const scale = Math.min(
      availableWidth / svgData.width,
      availableHeight / svgData.height
    );
    const xOffset = svgPadding + (availableWidth - svgData.width * scale) / 2;
    const yOffset = svgPadding + (availableHeight - svgData.height * scale) / 2;

    const svgX = (x - xOffset) / scale;
    const svgY = (y - yOffset) / scale;

    for (const path of svgData.paths) {
      const path2D = new Path2D(path.d);
      const isBlackFill = path.fill === "#000000" || path.fill === "black";
      const isStrokeOnly = !path.fill && path.stroke;

      if (isBlackFill || isStrokeOnly) {
        ctx.save(); // save current context state
        ctx.lineWidth = parseFloat(path.strokeWidth) || 1; // Set correct stroke width
        const isInStroke = ctx.isPointInStroke(path2D, svgX, svgY);
        ctx.restore(); // restore context

        if (isInStroke) {
          return { ...path, isOutline: true };
        }
        continue;
      }

      // normal fill areas
      if (ctx.isPointInPath(path2D, svgX, svgY)) {
        return { ...path, isOutline: false };
      }
    }

    return null;
  };

  const draw = (e) => {
    if (!isDrawing || !currentPathRef.current) return;

    const canvas = canvasRef.current;
    const { width, height } = canvas;

    const availableWidth = width - svgPadding * 2;
    const availableHeight = height - svgPadding * 2;
    const scale = Math.min(
      availableWidth / svgData.width,
      availableHeight / svgData.height
    );
    const xOffset = svgPadding + (availableWidth - svgData.width * scale) / 2;
    const yOffset = svgPadding + (availableHeight - svgData.height * scale) / 2;

    const { x, y } = getCanvasMousePosition(e);
    const svgX = (x - xOffset) / scale;
    const svgY = (y - yOffset) / scale;

    // currentPathRef.current.points.push({ x: svgX, y: svgY });
    currentPathRef.current.points.push({ x: svgX, y: svgY, moveTo: true });

    drawCanvas();
  };

  const stopDrawing = () => {
    if (isDrawingRef.current && currentPathRef.current?.points?.length > 1) {
      const completedPath = { ...currentPathRef.current };
      saveToHistory({ type: "draw", path: completedPath });
      setFreehandPaths((prev) => [...prev, completedPath]);
    }

    currentPathRef.current = null;
    isDrawingRef.current = false;
    setIsDrawing(false);

    window.removeEventListener("mousemove", draw); // detach global listeners
    window.removeEventListener("mouseup", stopDrawing);
  };

  const saveProgressNow = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // if cleared before, save cleared flag only
    if (wasClearedRef.current) {
      localStorage.setItem(
        `saved_${imageSrc}`,
        JSON.stringify({ cleared: true })
      );
      return;
    }

    const data = {
      paths: coloredPaths,
      freehandPaths,
      drawing: canvas.toDataURL("image/png"),
      cleared: false,
    };

    localStorage.setItem(`saved_${imageSrc}`, JSON.stringify(data));
  };

  const saveProgress = (silent = false) => {
    const isSameColored =
      JSON.stringify(coloredPaths) === JSON.stringify(initialColoredPaths);
    const isSameFreehand =
      JSON.stringify(freehandPaths) === JSON.stringify(initialFreehandPaths);
    const noChanges = isSameColored && isSameFreehand;
    const noHistory = historyPointer < 0;

    if (wasClearedRef.current) {
      // always save cleared state immediately (no modal needed)
      saveProgressNow();
      return;
    }

    if (noChanges && noHistory) {
      // nothing to save
      return;
    }

    if (!silent) {
      setShowSaveModal(true); // show popup modal
      return;
    }

    // silent save (direct save, no popup)
    saveProgressNow();
  };

  useEffect(() => {
    return () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const data = {
        paths: coloredPaths,
        freehandPaths: freehandPaths,
        drawing: canvas.toDataURL("image/png"),
      };

      localStorage.setItem(
        `saved_${imageName}`,
        JSON.stringify({
          drawing: canvas.toDataURL(), // likely empty/transparent
          cleared: true,
        })
      );
    };
  }, [imageSrc]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      saveProgress(true);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [coloredPaths, freehandPaths]);

  const loadProgress = () => {
    const saved = localStorage.getItem(`saved_${imageSrc}`);
    return saved ? JSON.parse(saved) : null;
  };

  const clearAll = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    setHistory([]);
    setHistoryPointer(-1);
    setFreehandPaths([]);
    setColoredPaths({});

    wasClearedRef.current = true;

    localStorage.removeItem(`saved_${imageSrc}`);

    /*
  localStorage.setItem(
    `saved_${imageSrc}`,
    JSON.stringify({
      cleared: true,
    })
  );
  */

    if (typeof onClear === "function") {
      onClear(imageSrc);
    }
  };

  const saveToPC = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = `coloring-${imageSrc.split(".")[0]}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

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
      setFreehandPaths((prev) =>
        prev.filter((p) => p.id !== lastAction.path.id)
      );
    }

    setHistoryPointer((prev) => prev - 1);
    drawCanvas();
  };

  const handleMouseEnter = (e) => {
    if (e.buttons === 1 && currentPathRef.current) {
      const { x, y } = getCanvasMousePosition(e);

      const canvas = canvasRef.current;
      const availableWidth = canvas.width - svgPadding * 2;
      const availableHeight = canvas.height - svgPadding * 2;
      const scale = Math.min(
        availableWidth / svgData.width,
        availableHeight / svgData.height
      );
      const xOffset = svgPadding + (availableWidth - svgData.width * scale) / 2;
      const yOffset =
        svgPadding + (availableHeight - svgData.height * scale) / 2;

      const svgX = (x - xOffset) / scale;
      const svgY = (y - yOffset) / scale;

      currentPathRef.current.points.push({ x: svgX, y: svgY }); // add the current position to the existing path's points

      setIsDrawing(true);
    }
  };

  useEffect(() => {
    const handleSaveRequest = () => saveProgress();
    window.addEventListener("save-coloring-progress", handleSaveRequest);

    const handlePopState = () => {
      window.dispatchEvent(new Event("save-coloring-progress"));
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("save-coloring-progress", handleSaveRequest);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [coloredPaths, freehandPaths]);

  const onModalConfirm = (save) => {
    setShowSaveModal(false);
    if (backCallbackRef.current) {
      backCallbackRef.current(save);
      backCallbackRef.current = null;
    }

    if (save) {
      saveProgressNow(); // actually save progress here after confirmation "Yes"
    }
  };

  const onModalCancel = () => {
    setShowSaveModal(false);
    // optionally, cancel action here or do nothing
  };

  return (
    <div className="coloring-page">
      {!isBucketFill && <BrushPreview brushSize={brushSize} />}
      {showSaveModal && (
        <div className="modal-overlay">
          <SaveProgressModal
            isOpen={showSaveModal}
            onConfirm={onModalConfirm}
            onCancel={onModalCancel}
          />
        </div>
      )}

      <div className="canvas-and-controls">
        <div className="canvas-palette-container">
          <div
            className="canvas-area"
            style={{
              aspectRatio: `${canvasSize.width} / ${canvasSize.height}`,
              maxWidth: "100%",
              maxHeight: "85vh",
            }}
          >
            <canvas
              ref={canvasRef}
              width={canvasSize.width}
              height={canvasSize.height}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseEnter={handleMouseEnter}
              style={{
                cursor: isBucketFill ? "pointer" : "crosshair",
                width: "100%",
                height: "100%",
                display: "block",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
              }}
            />
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

        <div className="action-buttons-column">
          <button
            onClick={handleUndo}
            className="action-button"
            disabled={historyPointer < 0}
            title="Undo last action"
          >
            <img src="/coloring/undo.png" alt="Undo" />
          </button>
          <button onClick={clearAll} className="action-button">
            <img src="/coloring/trash.png" alt="Clear All" />
          </button>

          <button onClick={() => saveProgress()} className="action-button">
            <img src="/coloring/check.png" alt="Save Progress" />
          </button>
          <button onClick={saveToPC} className="action-button">
            <img src="/coloring/save.png" alt="Save to PC" />
          </button>

          <button
            onClick={() => setIsBucketFill(true)}
            className={`tool-button ${isBucketFill ? "active" : ""}`}
          >
            <img src="/coloring/bucket.png" alt="Bucket Fill" />
          </button>

          <button
            onClick={() => setIsBucketFill(false)}
            className={`tool-button ${!isBucketFill ? "active" : ""}`}
          >
            <img src="/coloring/pencil.png" alt="Pencil Draw" />
          </button>

          <div className={`brush-sizes-column ${isBucketFill ? "hidden" : ""}`}>
            {brushSizes.map((size) => (
              <button
                key={size}
                className={`brush-size ${brushSize === size ? "active" : ""}`}
                onClick={() => setBrushSize(size)}
                style={{
                  width: `${size + 18}px`,
                  height: `${size + 18}px`,
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
    </div>
  );
}
