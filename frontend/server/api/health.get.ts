export default defineEventHandler(() => {
  const config = useRuntimeConfig();
  return {
    status: 'ok',
    service: 'syntecxhub-nuxt4-ssr-gateway',
    upstreamApiBaseUrl: config.public.apiBaseUrl,
    timestamp: new Date().toISOString(),
  };
});
