<script setup lang="ts">
import {
  Bell,
  ChevronRight,
  Menu,
  Search,
  UserCheck,
  ExternalLink,
  Code2,
  Settings,
} from 'lucide-vue-next';
import { onClickOutside } from '@vueuse/core';

const route = useRoute();
const router = useRouter();
const uiStore = useUiStore();
const dashboardStore = useDashboardStore();
const { formatDateTime } = useFormatters();

const quickSearch = ref('');
const showNotifications = ref(false);
const showProfileMenu = ref(false);

const notifRef = ref<HTMLElement | null>(null);
const profileRef = ref<HTMLElement | null>(null);

onClickOutside(notifRef, () => {
  showNotifications.value = false;
});
onClickOutside(profileRef, () => {
  showProfileMenu.value = false;
});

const pageMeta = computed(() => {
  const path = route.path;
  if (path.startsWith('/users')) {
    return { title: 'User Directory & Roles', crumb: 'Users' };
  }
  if (path.startsWith('/products')) {
    return { title: 'Product & SKU Inventory', crumb: 'Products' };
  }
  if (path.startsWith('/media')) {
    return { title: 'Media Asset Library', crumb: 'Media Library' };
  }
  if (path.startsWith('/settings')) {
    return { title: 'Platform Configuration', crumb: 'Settings' };
  }
  if (path.startsWith('/api-docs')) {
    return { title: 'OpenAPI & REST Explorer', crumb: 'API Documentation' };
  }
  return { title: 'Executive Telemetry Overview', crumb: 'Overview' };
});

const handleQuickSearch = () => {
  const q = quickSearch.value.trim();
  if (!q) return;
  const uploadsStore = useUploadsStore();
  uploadsStore.filters.search = q;
  uploadsStore.filters.page = 1;
  if (!route.path.startsWith('/media')) {
    router.push('/media');
  } else {
    uploadsStore.fetchUploads();
  }
};
</script>

<template>
  <header
    class="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/90 bg-white/90 dark:bg-slate-925/90 px-4 sm:px-6 backdrop-blur-md"
  >
    <!-- Left: Mobile Menu & Breadcrumbs -->
    <div class="flex items-center gap-3 min-w-0">
      <button
        type="button"
        class="lg:hidden rounded-lg border border-slate-200 dark:border-slate-800 p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        aria-label="Open Navigation"
        @click="uiStore.openMobileSidebar"
      >
        <Menu class="h-4 w-4" />
      </button>

      <div class="min-w-0">
        <div
          class="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400"
        >
          <span>Syntecxhub</span>
          <ChevronRight class="h-3.5 w-3.5 shrink-0" />
          <span class="font-medium text-slate-700 dark:text-slate-300">{{
            pageMeta.crumb
          }}</span>
        </div>
        <h1
          class="truncate text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white"
        >
          {{ pageMeta.title }}
        </h1>
      </div>
    </div>

    <!-- Right: Global Search, Notifications, Profile Dropdown -->
    <div class="flex items-center gap-2.5 sm:gap-3">
      <form
        class="relative hidden md:block w-64 lg:w-72"
        @submit.prevent="handleQuickSearch"
      >
        <Search
          class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        />
        <input
          v-model="quickSearch"
          type="search"
          placeholder="Search users or SKU (Enter)..."
          class="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-sky-500 focus:outline-none"
        />
      </form>

      <!-- Notifications Popover -->
      <div ref="notifRef" class="relative">
        <button
          type="button"
          class="relative rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Platform Notifications"
          @click="showNotifications = !showNotifications"
        >
          <Bell class="h-4 w-4" />
          <span
            class="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-sky-500 ring-2 ring-white dark:ring-slate-900"
          />
        </button>

        <div
          v-if="showNotifications"
          class="surface-card absolute right-0 mt-2 w-80 sm:w-96 overflow-hidden shadow-xl z-50"
        >
          <div
            class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-4 py-3"
          >
            <span class="text-xs font-semibold text-slate-900 dark:text-slate-100">
              Recent Platform Activity
            </span>
            <span
              class="rounded-full bg-sky-500/10 px-2 py-0.5 text-[10px] font-semibold text-sky-500"
            >
              Live Feed
            </span>
          </div>
          <div class="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/70">
            <div
              v-for="ev in dashboardStore.activity.slice(0, 5)"
              :key="ev.id"
              class="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50"
            >
              <p class="text-xs font-medium text-slate-900 dark:text-slate-100">
                {{ ev.title }}
              </p>
              <p class="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                {{ ev.subtitle }}
              </p>
              <p class="mt-1 text-[10px] font-mono text-slate-400">
                {{ formatDateTime(ev.timestamp) }}
              </p>
            </div>
            <div
              v-if="dashboardStore.activity.length === 0"
              class="px-4 py-6 text-center text-xs text-slate-400"
            >
              No recent activity recorded yet.
            </div>
          </div>
        </div>
      </div>

      <!-- Profile Menu -->
      <div ref="profileRef" class="relative">
        <button
          type="button"
          class="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 pr-2.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
          @click="showProfileMenu = !showProfileMenu"
        >
          <img
            :src="uiStore.currentOperator.avatar"
            :alt="uiStore.currentOperator.name"
            class="h-7 w-7 rounded-md object-cover"
          />
          <span class="hidden sm:inline truncate max-w-28">{{
            uiStore.currentOperator.name
          }}</span>
        </button>

        <div
          v-if="showProfileMenu"
          class="surface-card absolute right-0 mt-2 w-60 overflow-hidden p-1.5 shadow-xl z-50"
        >
          <div
            class="border-b border-slate-200 dark:border-slate-800 px-3 py-2.5"
          >
            <p class="text-xs font-semibold text-slate-900 dark:text-white">
              {{ uiStore.currentOperator.name }}
            </p>
            <p class="truncate text-[11px] text-slate-500 dark:text-slate-400">
              {{ uiStore.currentOperator.email }}
            </p>
          </div>
          <div class="py-1">
            <NuxtLink
              to="/users"
              class="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              @click="showProfileMenu = false"
            >
              <UserCheck class="h-4 w-4 text-slate-400" />
              User Directory
            </NuxtLink>
            <NuxtLink
              to="/api-docs"
              class="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              @click="showProfileMenu = false"
            >
              <Code2 class="h-4 w-4 text-slate-400" />
              OpenAPI Explorer
            </NuxtLink>
            <NuxtLink
              to="/settings"
              class="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              @click="showProfileMenu = false"
            >
              <Settings class="h-4 w-4 text-slate-400" />
              Workspace Settings
            </NuxtLink>
          </div>
          <div
            class="border-t border-slate-200 dark:border-slate-800 pt-1 mt-1"
          >
            <a
              href="http://localhost:4000/api/docs"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-sky-600 dark:text-sky-400 hover:bg-sky-500/10"
            >
              <span>Swagger UI (/api/docs)</span>
              <ExternalLink class="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
