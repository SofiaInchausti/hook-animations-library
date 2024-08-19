import { useRef, useEffect, useCallback } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: unknown[]) => any;

export function useEvent<T extends AnyFunction>(callback: T): T {
  const ref = useRef<T>(callback);

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const memoizedCallback = useCallback(
    (...args: Parameters<T>): ReturnType<T> => {
      return ref.current(...args);
    },
    []
  );

  return memoizedCallback as unknown as T;
}
