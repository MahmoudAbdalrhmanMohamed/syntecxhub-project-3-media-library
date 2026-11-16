<script setup lang="ts">
import {
  Image as ImageIcon,
  Sparkles,
  HardDrive,
  FileCode2,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  Moon,
  Layers,
  UploadCloud,
  X,
  Palette,
  Compass,
} from 'lucide-vue-next';

const route = useRoute();
const uiStore = useUiStore();
const colorMode = useColorMode();
const uploadsStore = useUploadsStore();

const studioChannels = [
  {
    channelName: 'CREATIVE WORKSPACE',
    items: [
      { label: 'Studio Intelligence', to: '/', icon: Sparkles, tag: 'ANALYTICS' },
      { label: 'Media Asset Vault', to: '/media', icon: ImageIcon, count: computed(() => uploadsStore.totalUploads || 8) },
    ],
  },
  {
    channelName: 'MEDIA ENGINE',
    items: [
      { label: 'Storage & Compression', to: '/settings', icon: HardDrive, tag: 'BUFFER' },
      { label: 'CDN Edge & OpenAPI', to: '/api-docs', icon: FileCode2, tag: 'FASTLY' },
    ],
  },
];

const isActive = (target: string) => {
  if (target === '/') return route.path === '/';
  return route.path.startsWith(target);
};

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
};
</script>

<template>
  <div
    v-if="uiStore.mobileSidebarOpen"
    class="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-md lg:hidden"
    @click="uiStore.closeMobileSidebar"
  />

  <aside
    class="fixed inset-y-0 left-0 z-40 flex flex-col border-r border-rose-950/60 bg-[#08040F] transition-all duration-200 lg:sticky lg:top-0 lg:h-screen lg:shrink-0"
    :class="[
      uiStore.sidebarCollapsed ? 'w-20' : 'w-64',
      uiStore.mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
    ]"
  >
    <!-- Studio Brand Header -->
    <div
      class="flex h-16 items-center border-b border-rose-950/70 bg-[#06030B] transition-all duration-200"
      :class="uiStore.sidebarCollapsed ? 'justify-center px-2' : 'justify-between px-4'"
    >
      <NuxtLink
        v-if="!uiStore.sidebarCollapsed"
        to="/"
        class="flex items-center min-w-0 gap-3"
      >
        <BrandProjectLogo :size="'md'" />
        <div class="min-w-0">
          <div class="flex items-center gap-1.5">
            <span class="truncate text-sm font-bold tracking-tight text-white block">
              Prism
            </span>
            <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-gradient-to-r from-rose-500/20 to-fuchsia-500/20 text-rose-300 border border-rose-500/30">
              STUDIO DAM
            </span>
          </div>
          <div class="flex items-center gap-1.5 mt-0.5">
            <span class="h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulse" />
            <p class="truncate text-[10px] text-rose-300/80 font-medium">
              CREATIVE PIPELINE // READY
            </p>
          </div>
        </div>
      </NuxtLink>

      <!-- Collapsed State Header: Aperture Iris Emblem with Quick Rail Expand Toggle -->
      <button
        v-else
        type="button"
        class="group/rail flex h-11 w-11 items-center justify-center rounded-xl border border-rose-950/80 bg-[#0D0716] hover:border-rose-500 hover:bg-rose-950/70 transition-all cursor-pointer shadow-sm relative"
        title="Expand Sidebar (Ctrl+B)"
        aria-label="Expand Sidebar"
        @click="uiStore.toggleSidebar"
      >
        <BrandProjectLogo :size="'sm'" class="transition-opacity duration-150 group-hover/rail:opacity-0" />
        <PanelLeftOpen class="absolute h-5 w-5 text-rose-400 opacity-0 group-hover/rail:opacity-100 transition-opacity duration-150" />
      </button>

      <!-- Desktop Collapse Button (Expanded State) -->
      <button
        v-if="!uiStore.sidebarCollapsed"
        type="button"
        class="hidden lg:inline-flex rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-rose-950/60 transition-all cursor-pointer"
        title="Collapse Sidebar (Ctrl+B)"
        aria-label="Collapse Sidebar"
        @click="uiStore.toggleSidebar"
      >
        <PanelLeftClose class="h-4 w-4" />
      </button>

      <!-- Mobile Close Button -->
      <button type="button" class="lg:hidden rounded-lg p-1.5 text-slate-400" @click="uiStore.closeMobileSidebar">
        <X class="h-4 w-4" />
      </button>
    </div>

    <!-- Format Support Strip (Expanded) -->
    <div
      v-if="!uiStore.sidebarCollapsed"
      class="border-b border-rose-950/50 bg-rose-950/20 px-4 py-2 flex items-center justify-between text-[11px] text-rose-300/80"
    >
      <span class="flex items-center gap-1.5">
        <Palette class="h-3 w-3 text-rose-400" />
        <span>MIME: SVG • PNG • WEBP</span>
      </span>
      <span class="px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-400 text-[10px] border border-rose-500/20">
        LOSSLESS
      </span>
    </div>

    <!-- Navigation List (Creative Studio Style) -->
    <nav class="flex-1 space-y-6 overflow-y-auto custom-scrollbar px-3 py-4">
      <div v-for="group in studioChannels" :key="group.channelName" class="space-y-1">
        <div
          v-if="!uiStore.sidebarCollapsed"
          class="flex items-center justify-between px-3 pb-1.5"
        >
          <span class="text-[10px] font-bold uppercase tracking-wider text-rose-300/60">
            {{ group.channelName }}
          </span>
        </div>

        <NuxtLink
          v-for="item in group.items"
          :key="item.to"
          :to="item.to"
          :title="uiStore.sidebarCollapsed ? item.label : undefined"
          class="group relative flex items-center rounded-xl text-xs sm:text-sm font-medium transition-all duration-150"
          :class="[
            uiStore.sidebarCollapsed ? 'justify-center w-12 h-10 mx-auto px-0' : 'gap-3 px-3 py-2.5',
            isActive(item.to)
              ? 'bg-gradient-to-r from-rose-600 to-fuchsia-600 text-white shadow-md shadow-rose-600/25 border border-rose-400/30'
              : 'text-slate-300 hover:bg-rose-950/40 hover:text-white',
          ]"
        >
          <component
            :is="item.icon"
            class="h-4 w-4 shrink-0 transition-colors"
            :class="isActive(item.to) ? 'text-white' : 'text-rose-400 group-hover:text-rose-300'"
          />
          <span v-if="!uiStore.sidebarCollapsed" class="truncate flex-1">{{ item.label }}</span>
          
          <!-- Count badge -->
          <span
            v-if="!uiStore.sidebarCollapsed && item.count"
            class="text-[10px] font-bold px-2 py-0.5 rounded-full"
            :class="isActive(item.to) ? 'bg-rose-800 text-white' : 'bg-rose-950/80 text-rose-300 border border-rose-800/40'"
          >
            {{ item.count.value }} Assets
          </span>

          <!-- Tag badge -->
          <span
            v-else-if="!uiStore.sidebarCollapsed && item.tag"
            class="text-[9px] font-mono px-1.5 py-0.5 rounded"
            :class="isActive(item.to) ? 'bg-rose-800 text-white' : 'bg-rose-950/40 text-rose-400'"
          >
            {{ item.tag }}
          </span>
        </NuxtLink>
      </div>
    </nav>

    <!-- Bottom Studio Storage Meter & Actions -->
    <div class="border-t border-rose-950/60 p-3 space-y-2.5 bg-[#05020A]">
      <!-- Creative Format Breakdown Meter -->
      <div v-if="!uiStore.sidebarCollapsed" class="p-2.5 rounded-xl bg-rose-950/30 border border-rose-900/40 space-y-2">
        <div class="flex items-center justify-between text-xs font-semibold">
          <span class="text-rose-200 flex items-center gap-1.5">
            <HardDrive class="h-3.5 w-3.5 text-rose-500" /> Cloud Media Buffer
          </span>
          <span class="font-mono text-[11px] text-rose-400">12%</span>
        </div>
        <div class="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
          <div class="h-full bg-gradient-to-r from-rose-500 via-fuchsia-500 to-purple-500 rounded-full w-[12%]" />
        </div>
        <div class="flex items-center justify-between text-[10px] text-slate-400">
          <span>12.4 MB of 100 MB</span>
          <NuxtLink to="/media" class="text-rose-400 hover:text-rose-300 font-medium">
            Ingest &rarr;
          </NuxtLink>
        </div>
      </div>

      <!-- Rail Expand / Collapse Toggle -->
      <button
        type="button"
        class="flex items-center rounded-xl border border-rose-950/80 bg-[#0E061A] font-medium text-slate-300 hover:border-rose-500 hover:text-rose-400 transition-colors cursor-pointer"
        :class="
          uiStore.sidebarCollapsed
            ? 'w-12 h-10 mx-auto justify-center px-0'
            : 'w-full justify-between px-3 py-2 text-xs'
        "
        :title="uiStore.sidebarCollapsed ? 'Expand Sidebar (Ctrl+B)' : 'Collapse Sidebar (Ctrl+B)'"
        aria-label="Toggle Sidebar Rail"
        @click="uiStore.toggleSidebar"
      >
        <span class="flex items-center gap-2">
          <PanelLeftOpen v-if="uiStore.sidebarCollapsed" class="h-4 w-4 text-rose-400 shrink-0" />
          <PanelLeftClose v-else class="h-4 w-4 shrink-0 text-slate-400" />
          <span v-if="!uiStore.sidebarCollapsed">Collapse Rail</span>
        </span>
        <kbd v-if="!uiStore.sidebarCollapsed" class="hidden sm:inline font-mono text-[10px] text-slate-400 bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-900/60">Ctrl+B</kbd>
      </button>

      <button
        type="button"
        class="flex items-center rounded-xl border border-rose-950/80 bg-[#0E061A] font-medium text-slate-300 hover:border-rose-500 hover:text-rose-400 transition-colors cursor-pointer"
        :class="
          uiStore.sidebarCollapsed
            ? 'w-12 h-10 mx-auto justify-center px-0'
            : 'w-full justify-between px-3 py-2 text-xs'
        "
        :title="colorMode.value === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
        @click="toggleTheme"
      >
        <span class="flex items-center gap-2">
          <Sun v-if="colorMode.value === 'dark'" class="h-4 w-4 text-amber-400 shrink-0" />
          <Moon v-else class="h-4 w-4 text-rose-400 shrink-0" />
          <span v-if="!uiStore.sidebarCollapsed">{{ colorMode.value === 'dark' ? 'Light Mode' : 'Dark Mode' }}</span>
        </span>
      </button>
    </div>
  </aside>
</template>