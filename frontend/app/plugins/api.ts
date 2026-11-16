import type { ApiErrorPayload } from '#shared/types/api';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const authToken = useCookie<string | null>('prism_auth_token', {
    default: () => null,
    sameSite: 'lax',
  });

  const api = $fetch.create({
    baseURL: config.public.apiBaseUrl,
    headers: {
      Accept: 'application/json',
    },
    onRequest({ options }) {
      const headers = new Headers(options.headers as HeadersInit | undefined);
      if (authToken.value) {
        headers.set('Authorization', `Bearer ${authToken.value}`);
      }
      headers.set('X-Client-Platform', 'Prism-Studio-Nuxt4');
      options.headers = headers;
    },
    onResponseError({ response }) {
      const payload = response._data as ApiErrorPayload | undefined;
      const rawMessage = payload?.message;
      const formattedMessage = Array.isArray(rawMessage)
        ? rawMessage.join('; ')
        : rawMessage || response.statusText || 'Request failed';

      if (import.meta.client) {
        console.warn(
          `[Prism API Error ${response.status}]: ${formattedMessage}`,
        );
      }
    },
  });

  return {
    provide: {
      api,
    },
  };
});
