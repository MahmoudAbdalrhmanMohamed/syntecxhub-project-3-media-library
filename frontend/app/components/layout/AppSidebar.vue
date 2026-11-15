<script setup lang="ts">
import {
  LayoutDashboard,
  Image as ImageIcon,
  Settings,
  FileCode2,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  Moon,
  Sparkles,
  X,
  HardDrive,
  FolderKanban,
} from 'lucide-vue-next';

const route = useRoute();
const uiStore = useUiStore();
const colorMode = useColorMode();
const uploadsStore = useUploadsStore();

const navigationGroups = [
  {
    groupTitle: 'STUDIO PIPELINE',
    items: [
      { label: 'Asset Telemetry', to: '/', icon: LayoutDashboard },
      { label: 'Media Asset Vault', to: '/media', icon: ImageIcon, count: computed(() => uploadsStore.totalUploads || 8) },
    ],
  },
  {
    groupTitle: 'INFRASTRUCTURE',
    items: [
      { label: 'Storage & Quotas', to: '/settings', icon: Settings },
      { label: 'CDN & Media API', to: '/api-docs', icon: FileCode2 },
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
    class="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
    @click="uiStore.closeMobileSidebar"
  />

  <aside
    class="fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-200/90 dark:border-rose-950/60 bg-white dark:bg-[#0B0612] transition-all duration-200 lg:static"
    :class="[
      uiStore.sidebarCollapsed ? 'w-20' : 'w-64',
      uiStore.mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
    ]"
  >
    <!-- Brand Header -->
    <div class="flex h-16 items-center justify-between border-b border-slate-200/90 dark:border-rose-950/60 px-4">
      <NuxtLink to="/" class="flex items-center gap-3 min-w-0">
        <BrandProjectLogo :size="'md'" />
        <div v-if="!uiStore.sidebarCollapsed" class="min-w-0">
          <div class="flex items-center gap-1.5">
            <span class="truncate text-sm font-bold tracking-tight text-slate-900 dark:text-white block">
              Syntecxhub
            </span>
            <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
              DAM
            </span>
          </div>
          <p class="truncate text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Studio &amp; Media Pipeline
          </p>
        </div>
      </NuxtLink>

      <button
        type="button"
        class="hidden lg:inline-flex rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-rose-950/60 transition-colors"
        @click="uiStore.toggleSidebar"
      >
        <PanelLeftOpen v-if="uiStore.sidebarCollapsed" class="h-4 w-4" />
        <PanelLeftClose v-else class="h-4 w-4" />
      </button>
      <button type="button" class="lg:hidden rounded-lg p-1.5 text-slate-400" @click="uiStore.closeMobileSidebar">
        <X class="h-4 w-4" />
      </button>
    </div>

    <!-- Grouped Navigation -->
    <nav class="flex-1 space-y-6 overflow-y-auto px-3 py-5">
      <div v-for="group in navigationGroups" :key="group.groupTitle" class="space-y-1">
        <p
          v-if="!uiStore.sidebarCollapsed"
          class="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-rose-300/50"
        >
          {{ group.groupTitle }}
        </p>

        <NuxtLink
          v-for="item in group.items"
          :key="item.to"
          :to="item.to"
          class="group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150"
          :class="
            isActive(item.to)
              ? 'bg-gradient-to-r from-rose-600 to-fuchsia-600 text-white shadow-sm shadow-rose-600/30 font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-300'
          "
        >
          <component :is="item.icon" class="h-4 w-4 shrink-0" />
          <span v-if="!uiStore.sidebarCollapsed" class="truncate flex-1">{{ item.label }}</span>
          <span
            v-if="!uiStore.sidebarCollapsed && item.count"
            class="text-[11px] font-semibold px-2 py-0.5 rounded-full"
            :class="isActive(item.to) ? 'bg-rose-700/80 text-white' : 'bg-slate-100 dark:bg-rose-950/80 text-slate-600 dark:text-rose-300'"
          >
            {{ item.count.value }}
          </span>
        </NuxtLink>
      </div>
    </nav>

    <!-- Bottom Storage Quota Meter -->
    <div class="border-t border-slate-200/90 dark:border-rose-950/60 p-3 space-y-2.5 bg-slate-50/50 dark:bg-[#090510]/50">
      <div v-if="!uiStore.sidebarCollapsed" class="p-3 rounded-xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/50 space-y-2">
        <div class="flex items-center justify-between text-xs font-semibold">
          <span class="text-rose-900 dark:text-rose-200 flex items-center gap-1.5">
            <HardDrive class="h-3.5 w-3.5 text-rose-500" /> Storage Buffer
          </span>
          <span class="font-mono text-[11px] text-rose-600 dark:text-rose-400">12%</span>
        </div>
        <div class="h-1.5 w-full bg-rose-200 dark:bg-rose-950/80 rounded-full overflow-hidden">
          <div class="h-full bg-gradient-to-r from-rose-500 to-fuchsia-500 rounded-full w-[12%]" />
        </div>
        <p class="text-[10px] text-slate-500 dark:text-rose-300/70 font-mono">12.4 MB of 100 MB used</p>
      </div>

      <button
        type="button"
        class="flex w-full items-center justify-between rounded-xl border border-slate-200 dark:border-rose-950/80 bg-white dark:bg-[#120A1D] px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-rose-400 transition-colors"
        @click="toggleTheme"
      >
        <span class="flex items-center gap-2">
          <Sun v-if="colorMode.value === 'dark'" class="h-4 w-4 text-amber-400" />
          <Moon v-else class="h-4 w-4 text-rose-600" />
          <span v-if="!uiStore.sidebarCollapsed">{{ colorMode.value === 'dark' ? 'Light Mode' : 'Dark Mode' }}</span>
        </span>
      </button>
    </div>
  </aside>
</template>
