import { renderHook, act } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import useLocalStorage from "../useLocalStorage";

describe("useLocalStorage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test("debe devolver el valor inicial si no hay nada en localStorage", () => {
    const { result } = renderHook(() => useLocalStorage("key", "initial"));
    console.log(result);

    expect(result.current[0]).toBe("initial");
  });

  test("debe almacenar y recuperar el valor de localStorage", () => {
    const { result } = renderHook(() => useLocalStorage("key", "initial"));

    act(() => {
      result.current[1]("newValue");
    });

    expect(result.current[0]).toBe("newValue");
    expect(window.localStorage.getItem("key")).toBe('"newValue"');
  });

  test("debe recuperar un valor existente en localStorage", () => {
    window.localStorage.setItem("key", JSON.stringify("storedValue"));

    const { result } = renderHook(() => useLocalStorage("key", "initial"));

    expect(result.current[0]).toBe("storedValue");
  });

  test("debe manejar errores al intentar leer de localStorage", () => {
    const spy = vi
      .spyOn(window.localStorage, "getItem")
      .mockImplementation(() => {
        throw new Error("localStorage read error");
      });

    const { result } = renderHook(() => useLocalStorage("key", "initial"));

    expect(result.current[0]).toBe("initial");

    spy.mockRestore();
  });
});
