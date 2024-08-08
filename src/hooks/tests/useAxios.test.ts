import { renderHook, waitFor } from "@testing-library/react";
import axios, { Method } from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import { useAxios } from "../useAxios";
import { describe, expect, it } from "vitest";

describe("useAxios", () => {
  // it("throws error if config is undefined", () => {
  //   const config = undefined;
  //    //@ts-expect-error: checking undefined config
  //   expect(() => renderHook(() => useAxios(config))).toThrowError(
  //     "useAxios must be initialized with config params"
  //   );
  // });
  // it("throw error if config is undefined", () => {
  //   try {
  //     const config = undefined;
  //     //@ts-expect-error: checking undefined config
  //     renderHook(() => useAxios(config));
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       expect(error).toBeInstanceOf(Error);
  //       expect(error.message).toBe(
  //         "useAxios must be initialized with config params"
  //       );
  //     }
  //   }
  // });
  // it('throw error if the config missing a parameter instance', ()=>{
  //   try{
  //   const config={
  //       url:"example.com",
  //      method:'GET',
  //       enabled: true
  //   }
  //    //@ts-expect-error checking undefined instance
  //   renderHook(()=> useAxios(config))
  //   }catch(error){
  //       if(error instanceof Error){
  //           expect(error).toBeInstanceOf(Error)
  //           expect(error.message).toBe(
  //               'useAxios must be initialized with an instance of axios'
  //           )
  //       }

  //   }
  // })
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
    mock.onGet("example.com").reply(200, responseData);

    const config = {
      instance: axios,
      url: "example.com",
      method: "GET" as Method, // Cast method to 'Method'
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
    mock.onGet("example.com").reply(500);

    const config = {
      instance: axios,
      url: "example.com",
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
      method: "GET" as Method, // Cast method to 'Method'
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
    mock.onGet("example.com").reply(500);

    const config = {
      instance: axios,
      url: "example.com",
      method: "GET" as Method, // Cast method to 'Method'
      enabled: true,
      onErrorCallback: onErrorCallback,
    };
    renderHook(() => useAxios(config));

    await waitFor(() => {
      expect(onErrorCallback).toHaveBeenCalled();
    });
  });
});
