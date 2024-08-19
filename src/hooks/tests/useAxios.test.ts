import { renderHook, waitFor } from "@testing-library/react";
import axios, { Method } from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import { useAxios } from "../useAxios";
import { describe, expect, it } from "vitest";

describe("useAxios", () => {
  it("throw error if config is undefined", () => {
    try {
      const config = undefined;
      //@ts-expect-error: checking undefined config
      renderHook(() => useAxios(config));
    } catch (error) {
      if (error instanceof Error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe(
          "useAxios must be initialized with config params"
        );
      }
    }
  });
  
  it("throw error if the config missing a parameter instance", () => {
    try {
      const config = {
        url: "example.com",
        method: "GET",
        enabled: true,
      };
      //@ts-expect-error checking undefined instance
      renderHook(() => useAxios(config));
    } catch (error) {
      if (error instanceof Error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe(
          "useAxios must be initialized with an instance of axios"
        );
      }
    }
  });

  it("sets loading state correctly", async () => {
    const config = {
      instance: axios,
      url: "example.com",
      method: "GET" as Method,
      enabled: true,
    };
    const { result } = renderHook(() => useAxios(config));
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it("handles response correctly", async () => {
    const mock = new AxiosMockAdapter(axios);
    const responseData = { data: "test" };
    mock.onGet("/example.com").reply(200, responseData);
    const config = {
      instance: axios,
      url: "/example.com",
      method: "GET" as Method, 
      enabled: true,
    };
    const { result } = renderHook(() => useAxios(config));
    await waitFor(() => {
      expect(result.current.data).toEqual(responseData);
      expect(result.current.error).toBe("");
    });
  });

  it("handles error correctly", async () => {
    const mock = new AxiosMockAdapter(axios);
    mock.onGet("/example.com").reply(500);
    const config = {
      instance: axios,
      url: "/example.com",
      method: "GET" as Method,
      enabled: true,
    };
    const { result } = renderHook(() => useAxios(config));
    await waitFor(() => {
      expect(result.current.error).toBe("Request failed with status code 500");
      expect(result.current.data).toBeNull();
    });
  });

  it("calls onSuccessCallback on successful response", async () => {
    const mock = new AxiosMockAdapter(axios);
    const onSuccessCallback = vi.fn();
    mock.onGet("example.com").reply(200, { data: "test" });
    const config = {
      instance: axios,
      url: "example.com",
      method: "GET" as Method, 
      enabled: true,
      onSucessCallback: onSuccessCallback,
    };
    renderHook(() => useAxios(config));
    await waitFor(() => {
      expect(onSuccessCallback).toHaveBeenCalled();
    });
  });

  it("calls onErrorCallback on error response", async () => {
    const mock = new AxiosMockAdapter(axios);
    const onErrorCallback = vi.fn();
    mock.onGet("/example.com").reply(500);
    const config = {
      instance: axios,
      url: "/example.com",
      method: "GET" as Method,
      enabled: true,
      onErrorCallback: onErrorCallback,
    };
    renderHook(() => useAxios(config));
    await waitFor(() => {
      expect(onErrorCallback).toHaveBeenCalled();
    });
  });

  it("retries request on failure", async () => {
    const mock = new AxiosMockAdapter(axios);
    mock.onGet("/retry").replyOnce(500).onGet("/retry").reply(200, { data: "retry success" });
    const config = {
      instance: axios,
      url: "/retry",
      method: "GET" as Method,
      enabled: true,
      retryCount: 1,
      retryDelay: 100,
    };
    const { result } = renderHook(() => useAxios(config));
    await waitFor(() => {
      expect(result.current.data).toEqual({ data: "retry success" });
      expect(result.current.error).toBe("");
    });
  });
  it("calls onUnauthorizedCallback on 401 response", async () => {
    const mock = new AxiosMockAdapter(axios);
    const onUnauthorizedCallback = vi.fn();
    mock.onGet("/unauthorized").reply(401);

    const config = {
      instance: axios,
      url: "/unauthorized",
      method: "GET" as Method,
      enabled: true,
      onUnauthorizedCallback: onUnauthorizedCallback,
    };

    renderHook(() => useAxios(config));

    await waitFor(() => {
      expect(onUnauthorizedCallback).toHaveBeenCalled();
    });
  });
  it("aborts request after timeout", async () => {
    const mock = new AxiosMockAdapter(axios);
    mock.onGet("/timeout").timeout();

    const config = {
      instance: axios,
      url: "/timeout",
      method: "GET" as Method,
      enabled: true,
      timeout: 500,
    };

    const { result } = renderHook(() => useAxios(config));

    await waitFor(() => {
      expect(result.current.error).toBe("Request failed with status code 500");
      expect(result.current.data).toBeNull();
    });
  });
  it("custom headers are sent with request", async () => {
    const mock = new AxiosMockAdapter(axios);
    const headers = { "Custom-Header": "CustomValue" };
    mock.onGet("/headers", headers).reply(200, { data: "success" });

    const config = {
      instance: axios,
      url: "/headers",
      method: "GET" as Method,
      enabled: true,
      headers,
    };

    const { result } = renderHook(() => useAxios(config));

    await waitFor(() => {
      expect(result.current.data).toEqual({ data: "success" });
    });
  });
  it("fetcher function works as expected", async () => {
    const mock = new AxiosMockAdapter(axios);
    mock.onGet("/fetcher").reply(200, { data: "fetched" });

    const config = {
      instance: axios,
      url: "/fetcher",
      method: "GET" as Method,
      enabled: false, // disable initial fetch
    };

    const { result } = renderHook(() => useAxios(config));

    await waitFor(async () => {
      const data = await result.current.fetcher!(config);
      expect(data).toEqual({ data: "fetched" });
    });
  });

});
