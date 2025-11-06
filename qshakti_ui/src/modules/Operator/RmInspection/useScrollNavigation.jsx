// hooks/useScrollNavigation.js
import { useEffect, useRef, useState } from "react";

export const useScrollNavigation = () => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = 150;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      top: direction === "up" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    updateScrollButtons();
    const ref = scrollRef.current;
    ref?.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      ref?.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!scrollRef.current) return;
      if (e.key === "ArrowLeft" && canScrollLeft) scroll("left");
      if (e.key === "ArrowRight" && canScrollRight) scroll("right");
      if (e.key === "ArrowUp") scroll("up");
      if (e.key === "ArrowDown") scroll("down");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canScrollLeft, canScrollRight]);

  return { scrollRef, canScrollLeft, canScrollRight, scroll };
};
