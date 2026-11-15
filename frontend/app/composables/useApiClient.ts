import type { ApiErrorPayload, ApiResponse } from '#shared/types/api';

const activeControllers = new Map<string, AbortController>();

export function extractApiErrorMessage(err: unknown): string {
  if (!err) return 'An unknown network error occurred.';
  if (typeof err === 'object' && err !== null) {
    const fetchErr = err as {
      data?: ApiErrorPayload;
      response?: { _data?: ApiErrorPayload };
      message?: string;
    };
    const payload = fetchErr.data || fetchErr.response?._data;
    if (payload?.message) {
      return Array.isArray(payload.message)
        ? payload.message.join(', ')
        : String(payload.message);
    }
    if (fetchErr.message) {
      return fetchErr.message;
    }
  }
  return String(err);
}

export const useApiClient = () => {
  const { $api } = useNuxtApp();
  const config = useRuntimeConfig();

  const createAbortSignal = (requestKey?: string): AbortSignal | undefined => {
    if (!requestKey || !import.meta.client) return undefined;
    const previous = activeControllers.get(requestKey);
    if (previous) {
      previous.abort();
    }
    const controller = new AbortController();
    activeControllers.set(requestKey, controller);
    return controller.signal;
  };

  const cancelRequest = (requestKey: string) => {
    const controller = activeControllers.get(requestKey);
    if (controller) {
      controller.abort();
      activeControllers.delete(requestKey);
    }
  };

  const get = async <T>(
    endpoint: string,
    query?: Record<string, unknown>,
    requestKey?: string,
  ): Promise<ApiResponse<T>> => {
    const signal = createAbortSignal(requestKey);
    return await $api<ApiResponse<T>>(endpoint, {
      method: 'GET',
      query: query
        ? Object.fromEntries(
            Object.entries(query).filter(
              ([_, v]) => v !== undefined && v !== null && v !== '',
            ),
          )
        : undefined,
      signal,
    });
  };

  const post = async <T>(
    endpoint: string,
    body?: Record<string, unknown> | FormData,
  ): Promise<ApiResponse<T>> => {
    return await $api<ApiResponse<T>>(endpoint, {
      method: 'POST',
      body,
    });
  };

  const patch = async <T>(
    endpoint: string,
    body?: Record<string, unknown>,
  ): Promise<ApiResponse<T>> => {
    return await $api<ApiResponse<T>>(endpoint, {
      method: 'PATCH',
      body,
    });
  };

  const del = async <T>(endpoint: string): Promise<ApiResponse<T>> => {
    return await $api<ApiResponse<T>>(endpoint, {
      method: 'DELETE',
    });
  };

  const resolveAssetUrl = (pathOrUrl: string | undefined): string => {
    if (!pathOrUrl) return '';
    if (
      pathOrUrl.startsWith('http://') ||
      pathOrUrl.startsWith('https://') ||
      pathOrUrl.startsWith('data:')
    ) {
      return pathOrUrl;
    }
    const base = config.public.backendOrigin.replace(/\/+$/, '');
    const cleanPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
    return `${base}${cleanPath}`;
  };

  return {
    get,
    post,
    patch,
    del,
    cancelRequest,
    resolveAssetUrl,
    extractApiErrorMessage,
  };
};
