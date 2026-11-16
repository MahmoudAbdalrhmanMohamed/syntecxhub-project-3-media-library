import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { scanExports } from 'unimport';

const currentDir = path.dirname(fileURLToPath(import.meta.url));

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',

  hooks: {
    async 'imports:extend'(imports) {
      for (const dirName of ['composables', 'stores']) {
        const dir = path.resolve(currentDir, 'app', dirName);
        if (!fs.existsSync(dir)) continue;
        const files = fs.readdirSync(dir).filter((f) => f.endsWith('.ts') && !f.endsWith('.d.ts'));
        for (const f of files) {
          const filePath = path.join(dir, f);
          const scanned = await scanExports(filePath, false);
          for (const exp of scanned) {
            if (!imports.some((i) => i.name === exp.name)) {
              imports.push({
                name: exp.name,
                as: exp.as,
                from: `~/${dirName}/${f.replace(/\.ts$/, '')}`,
              });
            }
          }
        }
      }
    },
  },

  ssr: true,

  devtools: { enabled: false },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/color-mode',
  ],

  css: ['~/assets/css/main.css'],

  devServer: {
    port: 3003,
    host: '0.0.0.0',
  },

  colorMode: {
    classSuffix: '',
    preference: 'dark',
    fallback: 'dark',
    storageKey: 'prism-color-mode',
  },

  runtimeConfig: {
    internalApiSecret: process.env.NUXT_INTERNAL_API_SECRET || 'prism-internal-ssr-key',
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:4003/api',
      backendOrigin: process.env.NUXT_PUBLIC_BACKEND_ORIGIN || 'http://localhost:4003',
      appName: 'Prism Studio',
      appVersion: '1.0.0',
    },
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      titleTemplate: '%s — Prism Studio',
      title: 'Creative DAM & Digital Asset Pipeline',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'referrer', content: 'strict-origin-when-cross-origin' },
        {
          name: 'description',
          content:
            'Prism Studio — Creative Digital Asset Management, SVG Vector Rendering & High-Speed Media Pipeline.',
        },
        { name: 'keywords', content: 'Creative DAM, Digital Asset Management, SVG Vector Rendering, Media Pipeline, High-Speed Asset Vault, NestJS Media API, Nuxt 4' },
        { name: 'author', content: 'Prism Creative Systems' },
        { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
        { name: 'theme-color', content: '#0B0612' },

        // Google Search Console & Webmaster Verification
        { name: 'google-site-verification', content: process.env.NUXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'prism-studio-gsc-verification-token' },
        { name: 'msvalidate.01', content: process.env.NUXT_PUBLIC_BING_SITE_VERIFICATION || 'prism-studio-bing-verification-token' },
        { name: 'yandex-verification', content: process.env.NUXT_PUBLIC_YANDEX_SITE_VERIFICATION || 'prism-studio-yandex-verification-token' },

        // Geographic (GEO) Meta Tags
        { name: 'geo.region', content: 'US-CA' },
        { name: 'geo.placename', content: 'San Francisco' },
        { name: 'geo.position', content: '37.7749;-122.4194' },
        { name: 'ICBM', content: '37.7749, -122.4194' },

        // OpenGraph (SEO / Social)
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Prism Studio' },
        { property: 'og:title', content: 'Prism Studio — Creative DAM & Digital Asset Pipeline' },
        { property: 'og:description', content: 'High-speed creative media vault, SVG vector inspection, MIME validation pipeline, and disk quota governance.' },
        { property: 'og:url', content: 'https://studio.prismdam.io/' },
        { property: 'og:image', content: 'https://studio.prismdam.io/favicon.svg' },
        { property: 'og:locale', content: 'en_US' },

        // Twitter Card (SEO / Social)
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@prismdam' },
        { name: 'twitter:creator', content: '@prismdam' },
        { name: 'twitter:title', content: 'Prism Studio — Creative DAM & Asset Engine' },
        { name: 'twitter:description', content: 'High-speed SVG vector and media asset management pipeline.' },
        { name: 'twitter:image', content: 'https://studio.prismdam.io/favicon.svg' },
      ],
      link: [
        { rel: 'canonical', href: 'https://studio.prismdam.io/' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'alternate icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap',
        },
      ],
    },
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },

  routeRules: {
    '/**': {
      headers: {
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'X-Content-Type-Options': 'nosniff',
      },
    },
    '/': { ssr: true },
    '/users': { ssr: true },
    '/products': { ssr: true },
    '/media': { ssr: true },
    '/settings': { ssr: true },
    '/api-docs': { ssr: true },
  },
});
