export default defineEventHandler(() => {
  const config = useRuntimeConfig();
  return {
    status: 'ok',
    service: 'prism-studio-nuxt4-gateway',
    upstreamApiBaseUrl: config.public.apiBaseUrl,
    timestamp: new Date().toISOString(),
  };
});
