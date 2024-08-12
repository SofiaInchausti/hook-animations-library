import { renderHook, act } from '@testing-library/react-hooks';
import { useOnlineStatus } from '../useOnlineStatus';

describe('useOnlineStatus', () => {
  it('should return initial online status based on navigator.onLine', () => {
    const { result } = renderHook(() => useOnlineStatus());

    expect(result.current).toBe(navigator.onLine);
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
