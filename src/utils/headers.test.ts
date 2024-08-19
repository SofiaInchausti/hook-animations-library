import { describe, it, expect, beforeEach} from 'vitest';
import axios, { AxiosInstance } from 'axios';
import { setCommonHeaders } from './headers';


// Mocks
const localStorageMock = (function() {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => store[key] = value.toString(),
    clear: () => store = {},
  };
})();
global.localStorage = localStorageMock;

describe('setCommonHeaders', () => {
  let instance: AxiosInstance;

  beforeEach(() => {
    instance = axios.create();
    // Clear any existing headers
    instance.defaults.headers.common = {};
  });

  it('should set common headers correctly', () => {
    // Set up the mock token
    localStorageMock.setItem('token', 'mockToken');

    // Call the function to set headers
    setCommonHeaders(instance);

    // Check headers
    expect(instance.defaults.headers.common['Content-Type']).toBe('application/json');
    expect(instance.defaults.headers.common['Accept']).toBe('application/json');
    expect(instance.defaults.headers.common['Authorization']).toBe('Bearer mockToken');
    expect(instance.defaults.headers.common['Custom-Header']).toBe('customValue');
  });

  it('should not set Authorization header if no token is present', () => {
    // Ensure no token is set
    localStorageMock.clear();

    // Call the function to set headers
    setCommonHeaders(instance);

    // Check headers
    expect(instance.defaults.headers.common['Authorization']).toBeUndefined();
  });
});
