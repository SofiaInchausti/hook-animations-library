import { useRef, useCallback } from 'react';

function useFocus<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  const setFocus = useCallback(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  return [ref, setFocus] as const;
}

export default useFocus;
