import { renderHook, act, waitFor } from '@testing-library/react';
import { useClipboard } from '../useClipboard';

const mockWriteText = vi.fn();
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});

describe('useClipboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  //   it("should copy text to clipboard and update isCopied state", async () => {
  //     const { result } = renderHook(() => useClipboard("Hello, World!"));
  //     const mockWriteText = vi.spyOn(navigator.clipboard, "writeText").mockImplementation(() => Promise.resolve());
  //     result.current.copyToClipboard("Hello, World!");
  //     waitFor(() => expect(mockWriteText).toHaveBeenCalledWith("Hello, World!"));
  //     waitFor(() => expect(result.current.isCopied).toBe(true));
  //     mockWriteText.mockRestore();
  //   });

  it('should handle clipboard write failure gracefully', async () => {
    mockWriteText.mockRejectedValue(new Error('Failed to write to clipboard'));
    const { result } = renderHook(() => useClipboard('Hello, World!'));
    act(() => {
      result.current.copyToClipboard('Hello, World!');
    });
    expect(result.current.isCopied).toBe(false);
  });

  it('should copy text using the fallback method', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined, // Forzar que navigator.clipboard sea undefined
    });

    const { result } = renderHook(() => useClipboard('Hello, World!'));

    document.execCommand = vi.fn().mockImplementation(() => true);

    await waitFor(async () => {
      result.current.copyToClipboard('Sample text');
    });
    expect(document.execCommand).toHaveBeenCalledWith('copy');
    expect(result.current.isCopied).toBe(true);
  });

  it('should handle error when copy fails using the fallback method', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
    });
    const { result } = renderHook(() => useClipboard('Hello, World!'));
    document.execCommand = vi.fn().mockImplementation(() => false);
    await waitFor(async () => {
      result.current.copyToClipboard('Sample text');
      expect(result.current.isCopied).toBe(false);
    });
  });

  it('should set isCopied to true when clipboard write succeeds', async () => {
    const text = 'Hello, World!';
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValueOnce(undefined),
      },
    });
    Object.defineProperty(window, 'isSecureContext', {
      value: true,
      configurable: true,
    });
    const { result } = renderHook(() => useClipboard());
    await act(async () => {
      result.current.copyToClipboard(text);
    });
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(text);
    expect(result.current.isCopied).toBe(true);
  });
});
