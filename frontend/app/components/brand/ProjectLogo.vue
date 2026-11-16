<script setup lang="ts">
defineProps<{
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}>();
</script>

<template>
  <div class="flex items-center" :class="showText ? 'gap-3' : ''">
    <!-- Aperture Prism Iris Emblem -->
    <div
      class="relative shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-rose-500/20 via-fuchsia-950/40 to-slate-950 border border-rose-500/40 shadow-lg shadow-rose-500/20 overflow-hidden"
      :class="[
        size === 'sm' ? 'h-8 w-8' : size === 'lg' ? 'h-12 w-12' : 'h-10 w-10',
      ]"
    >
      <svg
        viewBox="0 0 64 64"
        class="h-full w-full p-1.5"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="p3Grad1" x1="10" y1="10" x2="54" y2="54" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#FB7185" />
            <stop offset="50%" stop-color="#E11D48" />
            <stop offset="100%" stop-color="#9F1239" />
          </linearGradient>
          <linearGradient id="p3Grad2" x1="54" y1="10" x2="10" y2="54" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#F472B6" />
            <stop offset="50%" stop-color="#D946EF" />
            <stop offset="100%" stop-color="#86198F" />
          </linearGradient>
          <radialGradient id="p3Glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#FFFFFF" />
            <stop offset="60%" stop-color="#F43F5E" />
            <stop offset="100%" stop-color="#881337" stop-opacity="0" />
          </radialGradient>
        </defs>

        <!-- Outer Aperture Ring -->
        <circle cx="32" cy="32" r="22" stroke="url(#p3Grad2)" stroke-width="2" stroke-opacity="0.5" stroke-dasharray="3 3" />

        <!-- Aperture Blades -->
        <path d="M32 12 C38 20 42 26 44 32 L34 32 Z" fill="url(#p3Grad1)" opacity="0.95" />
        <path d="M48 20 C46 30 44 36 38 42 L33 34 Z" fill="url(#p3Grad2)" opacity="0.95" />
        <path d="M48 44 C40 46 34 44 26 42 L30 33 Z" fill="url(#p3Grad1)" opacity="0.95" />
        <path d="M32 52 C26 44 22 38 20 32 L30 32 Z" fill="url(#p3Grad2)" opacity="0.95" />
        <path d="M16 44 C18 34 20 28 26 22 L31 30 Z" fill="url(#p3Grad1)" opacity="0.95" />
        <path d="M16 20 C24 18 30 20 38 22 L34 31 Z" fill="url(#p3Grad2)" opacity="0.95" />

        <!-- Center Focal Sparkle -->
        <circle cx="32" cy="32" r="4.5" fill="url(#p3Glow)" />
        <circle cx="32" cy="32" r="2" fill="#FFFFFF" />
      </svg>
    </div>

    <!-- Brand Typography -->
    <div v-if="showText" class="min-w-0">
      <div class="flex items-center gap-1.5">
        <span class="truncate text-sm font-bold tracking-tight text-slate-900 dark:text-white block">
          Prism
        </span>
        <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
          DAM
        </span>
      </div>
      <p class="truncate text-[11px] text-slate-500 dark:text-slate-400 font-medium">
        Studio &amp; Media Pipeline
      </p>
    </div>
  </div>
</template>
