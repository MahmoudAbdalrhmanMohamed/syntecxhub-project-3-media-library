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

  colorMode: {
    classSuffix: '',
    preference: 'dark',
    fallback: 'dark',
    storageKey: 'syntecxhub-color-mode',
  },

  runtimeConfig: {
    internalApiSecret: process.env.NUXT_INTERNAL_API_SECRET || 'syntecxhub-internal-ssr-key',
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api',
      backendOrigin: process.env.NUXT_PUBLIC_BACKEND_ORIGIN || 'http://localhost:4000',
      appName: 'Syntecxhub Studio',
      appVersion: '1.0.0',
    },
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      titleTemplate: '%s — Syntecxhub Studio',
      title: 'Creative DAM & Digital Asset Pipeline',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Syntecxhub Studio — Creative Digital Asset Management, SVG Vector Rendering & High-Speed Media Pipeline.',
        },
        { name: 'theme-color', content: '#0B0612' },
      ],
      link: [
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
    '/': { ssr: true },
    '/users': { ssr: true },
    '/products': { ssr: true },
    '/media': { ssr: true },
    '/settings': { ssr: true },
    '/api-docs': { ssr: true },
  },
});
