import { renderHook } from "@testing-library/react-hooks";
import { describe, test, expect } from "vitest";
import useHover from "../useHover";
import { waitFor } from "@testing-library/dom";

describe("useHover", () => {
  test("should not change state if no events are triggered", () => {
    const { result } = renderHook(() => useHover());
    expect(result.current[1]).toBe(false);
  });
  test("should toggle isHovered on mouse enter and leave", () => {
    const { result } = renderHook(() => useHover());
    expect(result.current[1]).toBe(false);
    waitFor(() => {
      const event = new MouseEvent("mouseenter", { bubbles: true });
      const node = result.current[0].current;
      node?.dispatchEvent(event);
      expect(result.current[1]).toBe(true);
    });
    waitFor(() => {
      const event = new MouseEvent("mouseleave", { bubbles: true });
      const node = result.current[0].current;
      node?.dispatchEvent(event);
      expect(result.current[1]).toBe(false);
    });
  });
  test("should assign ref to an HTMLElement and handle hover events", () => {
    const { result } = renderHook(() => useHover());
    const div = document.createElement("div");
    result.current[0].current = div;
    expect(result.current[0].current).toBeDefined();
    expect(result.current[0].current instanceof HTMLElement).toBe(true);
  });
});
