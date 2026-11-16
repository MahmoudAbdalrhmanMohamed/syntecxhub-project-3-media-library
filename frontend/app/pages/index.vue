<script setup lang="ts">
import {
  HardDrive,
  FileImage,
  RefreshCw,
  ArrowUpRight,
  Sparkles,
  Layers,
  FileCode,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-vue-next';

useSeoMeta({
  title: 'Asset Telemetry — Prism Studio',
  description: 'Digital asset management telemetry, vector pipeline analytics, and storage quota utilization.',
});

const dashboardStore = useDashboardStore();
const { formatBytes, formatDate } = useFormatters();
const { resolveAssetUrl } = useApiClient();

await useAsyncData('project3-dashboard', async () => {
  await dashboardStore.fetchDashboardData();
  return true;
});
</script>

<template>
  <div class="space-y-6">
    <!-- Creative Studio Header Banner -->
    <div class="relative overflow-hidden rounded-2xl border border-rose-200/80 dark:border-rose-950/80 bg-gradient-to-r from-rose-950/40 via-purple-950/25 to-transparent p-6 sm:p-8">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
        <div class="space-y-2">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold">
            <Sparkles class="h-3.5 w-3.5 text-rose-500" />
            <span>PRISM STUDIO // DIGITAL ASSET ENGINE</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Media Storage &amp; Asset Intelligence
          </h2>
          <p class="text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
            High-speed asset distribution, MIME validation pipeline, SVG vector rendering, and persistent storage indexing across your media clusters.
          </p>
        </div>

        <div class="flex items-center gap-3 shrink-0">
          <button type="button" class="btn-secondary" @click="dashboardStore.fetchDashboardData()">
            <RefreshCw class="h-4 w-4" :class="{ 'animate-spin': dashboardStore.loading }" />
            Sync Storage
          </button>
          <NuxtLink to="/media" class="btn-primary">
            <span>Open Asset Vault</span>
            <ArrowUpRight class="h-4 w-4" />
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Media Storage KPIs -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div class="surface-card p-5 group">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Indexed Assets</span>
          <div class="h-9 w-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <FileImage class="h-4 w-4" />
          </div>
        </div>
        <p class="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {{ dashboardStore.stats?.summary.totalUploadedFiles ?? 0 }}
        </p>
        <p class="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1">
          <CheckCircle2 class="h-3 w-3" /> Vector &amp; Raster Verified
        </p>
      </div>

      <div class="surface-card p-5 group">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Disk Storage Allocated</span>
          <div class="h-9 w-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <HardDrive class="h-4 w-4" />
          </div>
        </div>
        <p class="mt-3 text-3xl font-extrabold font-mono text-purple-600 dark:text-purple-400 tracking-tight">
          {{ formatBytes(dashboardStore.stats?.summary.totalStorageBytes) }}
        </p>
        <p class="mt-1 text-xs text-purple-600/80 font-medium">
          Zero Compression Loss
        </p>
      </div>

      <div class="surface-card p-5 group sm:col-span-2 lg:col-span-1">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Pipeline Formats</span>
          <div class="h-9 w-9 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center text-fuchsia-600 dark:text-fuchsia-400">
            <Layers class="h-4 w-4" />
          </div>
        </div>
        <p class="mt-3 text-3xl font-extrabold text-fuchsia-600 dark:text-fuchsia-400 tracking-tight">
          {{ dashboardStore.stats?.distributions?.uploadsByType?.length || 1 }} Active
        </p>
        <p class="mt-1 text-xs text-fuchsia-600/80 font-medium">
          image/svg+xml Standard
        </p>
      </div>
    </div>

    <!-- Visual Asset Showcase -->
    <div class="surface-card p-6">
      <div class="flex items-center justify-between border-b border-slate-200 dark:border-rose-950/60 pb-4">
        <div class="flex items-center gap-2.5">
          <div class="h-2 w-2 rounded-full bg-rose-500" />
          <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Recent Media Assets in Pipeline
          </h3>
        </div>
        <NuxtLink to="/media" class="text-xs font-medium text-rose-600 dark:text-rose-400 hover:underline">
          View Gallery
        </NuxtLink>
      </div>

      <div class="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div
          v-for="item in dashboardStore.stats?.recent?.uploads || []"
          :key="item._id"
          class="rounded-xl border border-slate-200/80 dark:border-rose-950/80 bg-slate-50/60 dark:bg-[#0B0612] p-3 text-center space-y-2 group hover:border-rose-500/50 hover:shadow-lg hover:shadow-rose-950/20 transition-all"
        >
          <div class="aspect-square rounded-lg bg-slate-900/90 flex items-center justify-center p-2 overflow-hidden border border-slate-800">
            <img
              :src="resolveAssetUrl(item.publicUrl)"
              :alt="item.originalName"
              class="h-full w-full object-contain group-hover:scale-110 transition-transform duration-200"
            />
          </div>
          <p class="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
            {{ item.originalName }}
          </p>
          <p class="font-mono text-[10px] text-slate-400">
            {{ formatBytes(item.size) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
