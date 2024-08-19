import { renderHook } from "@testing-library/react-hooks";
import { describe, expect} from "vitest";
import useHover from "../useHover";
import { waitFor } from "@testing-library/dom";

describe("useHover", () => {
  let element: HTMLElement;

  beforeEach(() => {
    element = document.createElement("div");
  });

  it("should return false initially", () => {
    const { result } = renderHook(() => useHover(element));
    expect(result.current).toBe(false);
  });

  it("should return true on mouse enter", () => {
    const { result } = renderHook(() => useHover(element));
    
    waitFor(() => {
      element.dispatchEvent(new MouseEvent("mouseenter"));
      expect(result.current).toBe(true);
    });
    
  });

  it("should return false on mouse leave", () => {
    const { result } = renderHook(() => useHover(element));
    
    waitFor(() => {
      element.dispatchEvent(new MouseEvent("mouseenter"));
    });

    waitFor(() => {
      element.dispatchEvent(new MouseEvent("mouseleave"));
      expect(result.current).toBe(false);
    });

  });

  it("should clean up event listeners on unmount", () => {
    const addEventListenerSpy = vi.spyOn(element, "addEventListener");
    const removeEventListenerSpy = vi.spyOn(element, "removeEventListener");

    const { unmount } = renderHook(() => useHover(element));

    expect(addEventListenerSpy).toHaveBeenCalledTimes(2);
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledTimes(2);
  });

  it("should not re-add listeners if the same element is passed", () => {
    const addEventListenerSpy = vi.spyOn(element, "addEventListener");
    const { rerender } = renderHook(() => useHover(element));

    rerender();
    
    expect(addEventListenerSpy).toHaveBeenCalledTimes(2);
  });
});
