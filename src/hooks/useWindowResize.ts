import { useEffect, useState } from "react";

interface UseWindowsResize {
  width: number;
  height: number;
}

export function useWindowsResize(): UseWindowsResize {
  const [windowsSize, setWindowsSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const onResize = (): void => {
    setWindowsSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", onResize);
  },[]);

  return windowsSize;
}
