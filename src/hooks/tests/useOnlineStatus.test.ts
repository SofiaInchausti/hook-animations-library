import { renderHook, act } from '@testing-library/react-hooks';
import { useOnlineStatus } from '../useOnlineStatus';

describe('useOnlineStatus', () => {
  it('should return initial online status based on navigator.onLine', () => {
    const { result } = renderHook(() => useOnlineStatus());
    expect(result.current).toBe(navigator.onLine);
  });

  it('should not update status to online when an unrelated event is triggered', () => {
    const { result } = renderHook(() => useOnlineStatus());

    // Act: Dispatch an unrelated event, like "click"
    act(() => {
      window.dispatchEvent(new Event(''));
    });

    // Assert: Check that isOnline has not changed (it should still be the initial value)
    const expectedInitialValue = navigator.onLine; // or true/false depending on initial state
    expect(result.current).toBe(expectedInitialValue);
  });

  it('should update status to online when online event is triggered', () => {
    const { result } = renderHook(() => useOnlineStatus());
    act(() => {
      window.dispatchEvent(new Event('online'));
    });
    expect(result.current).toBe(true);
  });

  it('should update status to offline when offline event is triggered', () => {
    const { result } = renderHook(() => useOnlineStatus());
    act(() => {
      window.dispatchEvent(new Event('offline'));
    });
    expect(result.current).toBe(false);
  });
});
