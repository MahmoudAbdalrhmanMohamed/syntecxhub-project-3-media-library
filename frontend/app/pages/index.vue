<script setup lang="ts">
import { HardDrive, FileImage, RefreshCw, ArrowUpRight } from 'lucide-vue-next';

useSeoMeta({
  title: 'Media Storage Analytics — Project 3',
  description: 'Executive overview of uploaded media assets, storage utilization, and MIME distribution.',
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
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Project 3: Media Asset Library Overview
        </h2>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Real-time media storage telemetry, file format distribution, and recent uploads.
        </p>
      </div>
      <div class="flex items-center gap-2.5">
        <button type="button" class="btn-secondary" @click="dashboardStore.fetchDashboardData()">
          <RefreshCw class="h-4 w-4" :class="{ 'animate-spin': dashboardStore.loading }" />
          Refresh
        </button>
        <NuxtLink to="/media" class="btn-primary">
          Open Media Library
          <ArrowUpRight class="h-4 w-4" />
        </NuxtLink>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div class="surface-card p-5">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Uploaded Files</span>
          <FileImage class="h-4 w-4 text-sky-500" />
        </div>
        <p class="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
          {{ dashboardStore.stats?.summary.totalUploadedFiles ?? 0 }}
        </p>
      </div>
      <div class="surface-card p-5">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Disk Storage Used</span>
          <HardDrive class="h-4 w-4 text-amber-500" />
        </div>
        <p class="mt-3 text-2xl font-bold font-mono text-amber-500">
          {{ formatBytes(dashboardStore.stats?.summary.totalStorageBytes) }}
        </p>
      </div>
    </div>

    <div class="surface-card p-5">
      <h3 class="text-sm font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">
        Recently Uploaded Media Assets
      </h3>
      <div class="mt-4 divide-y divide-slate-200 dark:divide-slate-800">
        <div
          v-for="f in dashboardStore.stats?.recent.uploads || []"
          :key="f._id"
          class="flex items-center justify-between py-3"
        >
          <div class="flex items-center gap-3">
            <img :src="resolveAssetUrl(f.publicUrl)" :alt="f.originalName" class="h-9 w-12 rounded object-cover bg-slate-900" />
            <div>
              <p class="text-xs font-semibold text-slate-900 dark:text-white">{{ f.originalName }}</p>
              <p class="text-[11px] font-mono text-slate-500">{{ formatBytes(f.size) }} • {{ formatDate(f.uploadDate) }}</p>
            </div>
          </div>
          <span class="font-mono text-xs text-sky-500">{{ f.mimeType }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
