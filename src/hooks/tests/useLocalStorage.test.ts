import { renderHook, act } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import useLocalStorage from '../useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test('should return the initial value if there is nothing in localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'initial'));
    expect(result.current[0]).toBe('initial');
  });

  test('should store and retrieve the value of localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'initial'));
    act(() => {
      result.current[1]('newValue');
    });
    expect(result.current[0]).toBe('newValue');
    expect(window.localStorage.getItem('key')).toBe('"newValue"');
  });

  test('should retrieve an existing value in localStorage', () => {
    window.localStorage.setItem('key', JSON.stringify('storedValue'));
    const { result } = renderHook(() => useLocalStorage('key', 'initial'));
    expect(result.current[0]).toBe('storedValue');
  });

  test('should retrieve the function', () => {
    const fn = vi.fn();
    window.localStorage.setItem('key', JSON.stringify(fn));
    const { result } = renderHook(() => useLocalStorage('key', fn));
    expect(result.current[0]).toBe(fn);
  });

  it('should handle errors when setting a value in localStorage', () => {
    const setItemMock = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('Failed to set item');
      });
    const consoleErrorMock = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const { result } = renderHook(() =>
      useLocalStorage('testKey', 'initialValue')
    );
    act(() => {
      result.current[1]('newValue');
    });
    expect(consoleErrorMock).toHaveBeenCalledWith(
      'Error setting localStorage value',
      new Error('Failed to set item')
    );
    setItemMock.mockRestore();
    consoleErrorMock.mockRestore();
  });
});
