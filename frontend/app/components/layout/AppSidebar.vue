<script setup lang="ts">
import {
  LayoutDashboard,
  Users,
  Package,
  Image as ImageIcon,
  Settings,
  FileCode2,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  Moon,
  ShieldCheck,
  X,
} from 'lucide-vue-next';

const route = useRoute();
const uiStore = useUiStore();
const colorMode = useColorMode();

const primaryIcon = ImageIcon;

const navigationItems = [
  { label: 'Overview', to: '/', icon: LayoutDashboard, badge: 'Live' },
  { label: 'Media Library', to: '/media', icon: primaryIcon },
  { label: 'Settings', to: '/settings', icon: Settings },
  { label: 'API Documentation', to: '/api-docs', icon: FileCode2 },
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
    class="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
    @click="uiStore.closeMobileSidebar"
  />
  <aside
    class="fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-200 dark:border-slate-800/90 bg-white dark:bg-slate-925 transition-all duration-200 lg:static"
    :class="[
      uiStore.sidebarCollapsed ? 'w-20' : 'w-64',
      uiStore.mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
    ]"
  >
    <div class="flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-800/90 px-4">
      <NuxtLink to="/" class="flex items-center gap-3 min-w-0">
        <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-900 dark:bg-sky-500/15 border border-slate-800 dark:border-sky-500/30 text-sky-400">
          <ShieldCheck class="h-5 w-5" />
        </div>
        <div v-if="!uiStore.sidebarCollapsed" class="min-w-0">
          <span class="truncate text-sm font-bold tracking-tight text-slate-900 dark:text-white block">
            PROJECT 3
          </span>
          <p class="truncate text-[11px] text-slate-500 dark:text-slate-400">
            Media Library
          </p>
        </div>
      </NuxtLink>
      <button type="button" class="hidden lg:inline-flex rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" @click="uiStore.toggleSidebar">
        <PanelLeftOpen v-if="uiStore.sidebarCollapsed" class="h-4 w-4" />
        <PanelLeftClose v-else class="h-4 w-4" />
      </button>
      <button type="button" class="lg:hidden rounded-lg p-1.5 text-slate-400" @click="uiStore.closeMobileSidebar">
        <X class="h-4 w-4" />
      </button>
    </div>

    <nav class="flex-1 space-y-1 overflow-y-auto px-3 py-4">
      <NuxtLink
        v-for="item in navigationItems"
        :key="item.to"
        :to="item.to"
        class="group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
        :class="
          isActive(item.to)
            ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/70'
        "
      >
        <component :is="item.icon" class="h-4 w-4 shrink-0" />
        <span v-if="!uiStore.sidebarCollapsed" class="truncate flex-1">{ item.label }</span>
      </NuxtLink>
    </nav>

    <div class="border-t border-slate-200 dark:border-slate-800/90 p-3 space-y-2">
      <button
        type="button"
        class="flex w-full items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-xs font-medium"
        @click="toggleTheme"
      >
        <span class="flex items-center gap-2">
          <Sun v-if="colorMode.value === 'dark'" class="h-4 w-4 text-amber-400" />
          <Moon v-else class="h-4 w-4 text-slate-600" />
          <span v-if="!uiStore.sidebarCollapsed">{ colorMode.value === 'dark' ? 'Light Mode' : 'Dark Mode' }</span>
        </span>
      </button>
    </div>
  </aside>
</template>
