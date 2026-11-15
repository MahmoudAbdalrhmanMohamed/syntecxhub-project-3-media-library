import type { Config } from 'tailwindcss';

export default <Partial<Config>>{
  darkMode: 'class',
  content: [
    './app/components/**/*.{vue,js,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/composables/**/*.{js,ts}',
    './app/plugins/**/*.{js,ts}',
    './app/app.vue',
    './app/error.vue',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        slate: {
          925: '#0B1120',
          950: '#060A12',
        },
      },
    },
  },
  plugins: [],
};
