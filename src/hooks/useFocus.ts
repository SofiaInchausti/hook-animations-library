import { useRef, useCallback } from "react";

function useFocus() {
  const ref = useRef<HTMLInputElement>(null);
  const setFocus = useCallback(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  return [ref, setFocus] as const;
}

export default useFocus;
