import { useState, useEffect } from "react";

function useHover(elem: HTMLElement) {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);
    elem.addEventListener("mouseenter", handleMouseEnter);
    elem.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      elem.removeEventListener("mouseenter", handleMouseEnter);
      elem.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);
  return isHovered;
}

export default useHover;
