import { renderHook, act, waitFor } from "@testing-library/react";
import { useClipboard } from "../useClipboard";

const mockWriteText = vi.fn();
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});

describe("useClipboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("should copy text to clipboard and update isCopied state", async () => {
    const { result } = renderHook(() => useClipboard());
    const mockWriteText = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockImplementation(() => Promise.resolve());
    result.current.copyToClipboard("Hello, World!");
    waitFor(() => expect(mockWriteText).toHaveBeenCalledWith("Hello, World!"));
    waitFor(() => expect(result.current.isCopied).toBe(true));
    mockWriteText.mockRestore();
  });

  it("should reset isCopied to false after a delay", () => {
    const { result } = renderHook(() => useClipboard());
    result.current.copyToClipboard("Hello, World!");
    waitFor(() => expect(result.current.isCopied).toBe(true));
  });

  it("should handle clipboard write failure gracefully", async () => {
    mockWriteText.mockRejectedValue(new Error("Failed to write to clipboard"));
    const { result } = renderHook(() => useClipboard());
    act(() => {
      result.current.copyToClipboard("Hello, World!");
    });
    expect(result.current.isCopied).toBe(false);
  });
});
