import { AxiosError, type AxiosInstance, type AxiosRequestConfig, type Method } from 'axios';
import * as React from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect'
import { setCommonHeaders } from '../utils/headers';

interface Config extends AxiosRequestConfig {
  instance: AxiosInstance;
  url: string;
  method: Method;
  timeout?: number;
  enabled?: boolean;
  onErrorCallback?: () => void;
  onSucessCallback?: () => void;
  onUnauthorizedCallback?: () => void;
  retryCount?: number; // Nuevo: número de reintentos
  retryDelay?: number; // Nuevo: retraso entre reintentos
}

type Error = string | AxiosError;

interface UseAxios<T> {
  data: T | null;
  error: Error;
  loading: boolean;
  fetcher?: (config: Config) => Promise<T | undefined>;
}

export const useAxios = <T>(config: Config): UseAxios<T> => {
  if (config === undefined) throw new Error('useAxios must be initialized with config params');
  if (config.instance === undefined) throw new Error('useAxios must be initialized with an instance of axios');
  
  const configRef = React.useRef(config);
  const { instance } = configRef.current;
  
  setCommonHeaders(instance);

  const [response, setResponse] = React.useState<T | null>(null);
  const [error, setError] = React.useState<Error>('');
  const [loading, setLoading] = React.useState<boolean>(config.enabled ?? false);

    // Almacenar el ID del interceptor
    const requestInterceptorRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const requestInterceptor = instance.interceptors.response.use((response) => {
      if (response.status === 200 && config?.onSucessCallback) {
        config.onSucessCallback();
      }
      return response;
    }, async (error) => {
      if (error.response.status === 500 && config?.onErrorCallback) {
        config.onErrorCallback();
      }
      if (error.response.status === 401 && config?.onUnauthorizedCallback) {
        config.onUnauthorizedCallback();
      }
      return await Promise.reject(error);
    });

     // Almacenar el ID del interceptor
     requestInterceptorRef.current = requestInterceptor;
    
    return () => {
      instance.interceptors.response.eject(requestInterceptor);
    }
  }, []);

  function newAbortSignal() {
    const abortController = new AbortController();
    setTimeout(() => abortController.abort(), config.timeout ?? 5000);
    return abortController.signal;
  }

  const errorHandler = (e: unknown): void => {
    if (e instanceof AxiosError) {
      setError(e.message);
    } else {
      setError('Request failed with status code 500');
    }
  }

  const fetch = React.useCallback(async (config: Config, retries: number = config.retryCount ?? 0) => {
    try {
      const enabled = config.enabled;
      if (enabled === false) return;
      setLoading(true);
      const res = await instance.request<T>({
        ...config,
        method: config.method.toLowerCase(),
        signal: newAbortSignal(),
        headers: {
          ...config.headers
        }
      });
      setResponse(res.data);
    } catch (e) {
      if (retries > 0) {
        setTimeout(() => fetch(config, retries - 1), config.retryDelay ?? 1000);
      } else {
        errorHandler(e);
      }
    } finally {
      setLoading(false);
    }
  }, [instance]);

  const fetcher = React.useCallback(async (_config: Config) => {
    try {
      const response = await instance.request<T>({
        ...configRef.current,
        ..._config
      });
      return response.data;
    } catch (e) {
      errorHandler(e);
      return undefined;
    }
  }, [instance]);

  useDeepCompareEffect(() => {
    void fetch(configRef.current);
  }, [config]);

  // Cancelar peticiones en curso si el componente se desmonta
  React.useEffect(() => {
    return () => {
      if (requestInterceptorRef.current !== null) {
        instance.interceptors.response.eject(requestInterceptorRef.current);
      }
    }
  }, [instance]);

  return {
    data: response,
    error,
    loading,
    fetcher
  }
}
