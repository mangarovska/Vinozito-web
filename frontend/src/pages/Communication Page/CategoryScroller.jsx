import React, { useRef, useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./CategoryScroller.css"; // You can move category CSS here

const CategoryScroller = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  barStyle,
}) => {
  const categoriesRef = useRef(null);
  const categoryItemRef = useRef(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(true);
  const [showArrows, setShowArrows] = useState(false);

const checkScrollPosition = () => {
  if (categoriesRef.current) {
    const { scrollLeft, scrollWidth, clientWidth } = categoriesRef.current;

    // For wide screens where content might be centered
    const isWideScreen = window.innerWidth >= 1300;
    const contentOverflows = scrollWidth > clientWidth;

    if (isWideScreen && !contentOverflows) {
      // Content fits and should be centered, no arrows needed
      setShowArrows(false);
      setShowLeftFade(false);
      setShowRightFade(false);
      
      // Add centered class
      categoriesRef.current.classList.add('centered');
      categoriesRef.current.classList.remove('scrollable');
    } else {
      // Normal scrolling behavior
      setShowLeftFade(scrollLeft > 0);
      setShowRightFade(scrollLeft < scrollWidth - clientWidth);
      setShowArrows(contentOverflows);
      
      // Add scrollable class for wide screens, or remove both for smaller screens
      if (isWideScreen) {
        categoriesRef.current.classList.add('scrollable');
        categoriesRef.current.classList.remove('centered');
      } else {
        categoriesRef.current.classList.remove('centered', 'scrollable');
      }
    }
  }
};

  const scrollCategories = (direction) => {
    if (categoriesRef.current && categoryItemRef.current) {
      const categoryWidth = categoryItemRef.current.offsetWidth;
      const padding = 26; // gap value
      const scrollAmount = (categoryWidth + padding) * 3;

      categoriesRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
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

  return (
    <div className="category-scroller-wrapper">
      <div className="category-background-bar" style={barStyle}/>
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
                    "linear-gradient(to right, transparent 0%, black 15px, black calc(100% - 15px), transparent 100%)",
                  maskImage:
                    "linear-gradient(to right, transparent 0%, black 15px, black calc(100% - 15px), transparent 100%)",
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
  );
};

export default CategoryScroller;
