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
  Copy,
  Check,
  UploadCloud,
  Palette,
  ExternalLink,
} from 'lucide-vue-next';
import { useClipboard } from '@vueuse/core';

useSeoMeta({
  title: 'Asset Telemetry — Prism Studio',
  description: 'Digital asset management telemetry, vector pipeline analytics, and storage quota utilization.',
});

const dashboardStore = useDashboardStore();
const uploadsStore = useUploadsStore();
const toast = useToast();
const { formatBytes, formatDate } = useFormatters();
const { resolveAssetUrl } = useApiClient();
const { copy, copied } = useClipboard();

await useAsyncData('project3-dashboard', async () => {
  await Promise.all([
    dashboardStore.fetchDashboardData(),
    uploadsStore.fetchUploads(),
  ]);
  return true;
});

const handleCopyUrl = async (url: string) => {
  const fullUrl = resolveAssetUrl(url);
  await copy(fullUrl);
  toast.success('CDN Link Copied', 'Asset delivery URL copied to clipboard.');
};
</script>

<template>
  <div class="space-y-6">
    <!-- Creative Studio Showcase Hero -->
    <div class="relative overflow-hidden rounded-2xl border border-rose-950/80 bg-gradient-to-r from-[#170517] via-[#1F0726] to-[#0A0412] p-6 sm:p-7 shadow-lg shadow-rose-950/30">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        <div class="space-y-2">
          <div class="flex flex-wrap items-center gap-2">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              <Sparkles class="h-3.5 w-3.5 text-rose-400" />
              <span>PRISM STUDIO // HIGH-SPEED MEDIA ENGINE</span>
            </span>
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/20">
              <span class="h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulse" />
              CDN EDGE ACTIVE
            </span>
          </div>

          <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Media Asset Telemetry &amp; Pipeline
          </h2>
          <p class="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Lossless media distribution, SVG vector inspection, automatic MIME validation, and persistent cloud indexing across creative storage clusters.
          </p>
        </div>

        <div class="flex items-center gap-3 shrink-0">
          <button type="button" class="btn-secondary text-xs sm:text-sm" @click="dashboardStore.fetchDashboardData()">
            <RefreshCw class="h-4 w-4" :class="{ 'animate-spin': dashboardStore.loading }" />
            <span>Sync Buffer</span>
          </button>
          <NuxtLink to="/media" class="btn-primary text-xs sm:text-sm">
            <UploadCloud class="h-4 w-4" />
            <span>Open Asset Vault</span>
            <ArrowUpRight class="h-4 w-4" />
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Media Storage KPIs (Studio Format) -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <!-- Total Indexed Assets -->
      <div class="surface-card rounded-xl border border-rose-950/80 bg-[#0E0617] p-5 relative overflow-hidden group hover:border-rose-500/40 transition-all">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Indexed Assets</span>
          <div class="h-8 w-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <FileImage class="h-4 w-4" />
          </div>
        </div>
        <p class="mt-3 text-3xl font-extrabold text-white tracking-tight">
          {{ dashboardStore.stats?.summary.totalUploadedFiles ?? 0 }}
        </p>
        <p class="mt-2 text-xs text-rose-400 font-medium flex items-center gap-1">
          <CheckCircle2 class="h-3.5 w-3.5" /> Vector &amp; Raster Verified
        </p>
      </div>

      <!-- Disk Storage Allocated -->
      <div class="surface-card rounded-xl border border-rose-950/80 bg-[#0E0617] p-5 relative overflow-hidden group hover:border-fuchsia-500/40 transition-all">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Disk Storage Allocated</span>
          <div class="h-8 w-8 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center text-fuchsia-400">
            <HardDrive class="h-4 w-4" />
          </div>
        </div>
        <p class="mt-3 text-3xl font-extrabold font-mono text-fuchsia-400 tracking-tight">
          {{ formatBytes(dashboardStore.stats?.summary.totalStorageBytes) }}
        </p>
        <p class="mt-2 text-xs text-fuchsia-300/80 font-medium">
          Zero Compression Loss
        </p>
      </div>

      <!-- Active Pipeline Codecs -->
      <div class="surface-card rounded-xl border border-rose-950/80 bg-[#0E0617] p-5 relative overflow-hidden group hover:border-purple-500/40 transition-all sm:col-span-2 lg:col-span-1">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Pipeline Formats</span>
          <div class="h-8 w-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Layers class="h-4 w-4" />
          </div>
        </div>
        <p class="mt-3 text-3xl font-extrabold text-purple-400 tracking-tight">
          {{ dashboardStore.stats?.distributions?.uploadsByType?.length || 1 }} Codecs Active
        </p>
        <div class="mt-2 flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
          <span class="px-1.5 py-0.5 rounded bg-rose-950/60 text-rose-300">SVG</span>
          <span class="px-1.5 py-0.5 rounded bg-rose-950/60 text-fuchsia-300">PNG</span>
          <span class="px-1.5 py-0.5 rounded bg-rose-950/60 text-purple-300">WEBP</span>
          <span class="px-1.5 py-0.5 rounded bg-rose-950/60 text-slate-300">JPEG</span>
        </div>
      </div>
    </div>

    <!-- Main Studio Split: Live Visual Media Showcase & Storage Allocation -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Left 2 Cols: Live Visual Media Asset Showcase Grid -->
      <div class="lg:col-span-2 space-y-6">
        <div class="rounded-xl border border-rose-950/80 bg-[#0C0514] p-5 sm:p-6 shadow-sm">
          <div class="flex items-center justify-between pb-4 border-b border-rose-950/70">
            <div>
              <h3 class="text-base font-bold text-white flex items-center gap-2">
                <ImageIcon class="h-4 w-4 text-rose-400" />
                <span>Live Creative Media Showcase</span>
              </h3>
              <p class="text-xs text-slate-400 mt-0.5">
                Visual preview of indexed vector diagrams and high-speed photography.
              </p>
            </div>
            <NuxtLink to="/media" class="btn-primary text-xs">
              <span>View All</span>
              <ArrowUpRight class="h-3.5 w-3.5" />
            </NuxtLink>
          </div>

          <!-- Visual Grid of Assets with Live Previews -->
          <div class="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              v-for="asset in (uploadsStore.items.slice(0, 4))"
              :key="asset._id"
              class="group rounded-xl border border-rose-950/60 bg-[#09030F] overflow-hidden hover:border-rose-500/50 transition-all shadow-sm flex flex-col"
            >
              <!-- Thumbnail Aspect Box -->
              <div class="aspect-16/9 w-full bg-[#050108] border-b border-rose-950/60 overflow-hidden relative">
                <img
                  :src="resolveAssetUrl(asset.publicUrl)"
                  :alt="asset.originalName"
                  class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span class="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-black/80 text-rose-300 border border-rose-500/30">
                  {{ asset.mimeType?.split('/')[1] || 'media' }}
                </span>
              </div>

              <!-- Content and Copy Button -->
              <div class="p-3.5 flex items-center justify-between gap-2 flex-1">
                <div class="min-w-0">
                  <p class="text-xs font-bold text-white truncate">{{ asset.originalName }}</p>
                  <p class="text-[11px] font-mono text-slate-400 mt-0.5">{{ formatBytes(asset.size) }}</p>
                </div>
                <button
                  type="button"
                  class="shrink-0 p-1.5 rounded-lg border border-rose-950/80 bg-rose-950/30 text-rose-300 hover:text-white hover:bg-rose-600 transition-colors cursor-pointer"
                  title="Copy CDN Link"
                  @click="handleCopyUrl(asset.publicUrl)"
                >
                  <Copy class="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Format Storage Distribution Bars -->
        <div class="rounded-xl border border-rose-950/80 bg-[#0C0514] p-5 sm:p-6 shadow-sm">
          <div class="flex items-center justify-between pb-4 border-b border-rose-950/70">
            <div>
              <h3 class="text-base font-bold text-white flex items-center gap-2">
                <Palette class="h-4 w-4 text-fuchsia-400" />
                <span>Format Storage Allocation</span>
              </h3>
              <p class="text-xs text-slate-400 mt-0.5">
                Disk allocation and compression ratio by MIME class.
              </p>
            </div>
          </div>

          <div class="mt-4 space-y-3">
            <div
              v-for="item in (dashboardStore.stats?.distributions?.uploadsByType ?? [])"
              :key="item._id"
              class="p-3 rounded-lg bg-rose-950/20 border border-rose-900/30 text-xs"
            >
              <div class="flex items-center justify-between font-mono">
                <span class="font-bold text-white uppercase">{{ item._id }}</span>
                <span class="text-rose-400">{{ item.count }} asset(s) • {{ formatBytes(item.size) }}</span>
              </div>
              <div class="mt-2 h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-rose-500 via-fuchsia-500 to-purple-500 rounded-full"
                  :style="{ width: `${Math.min(100, (item.size / (dashboardStore.stats?.summary.totalStorageBytes || 1)) * 100)}%` }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right 1 Col: Media Activity Stream & Fast Ingestion -->
      <div class="rounded-xl border border-rose-950/80 bg-[#0C0514] p-5 sm:p-6 shadow-sm flex flex-col">
        <div class="flex items-center justify-between pb-4 border-b border-rose-950/70">
          <div>
            <h3 class="text-base font-bold text-white flex items-center gap-2">
              <UploadCloud class="h-4 w-4 text-rose-400" />
              <span>Media Ingestion Activity</span>
            </h3>
            <p class="text-xs text-slate-400 mt-0.5">Live upload &amp; transform feed.</p>
          </div>
          <span class="h-2 w-2 rounded-full bg-rose-400 animate-pulse" />
        </div>

        <div class="mt-4 flex-1 space-y-3.5 overflow-y-auto custom-scrollbar pr-1.5 max-h-[500px]">
          <div
            v-for="(event, idx) in (dashboardStore.activity ?? [])"
            :key="idx"
            class="p-3 rounded-lg bg-rose-950/20 border border-rose-900/30 text-xs space-y-1.5"
          >
            <div class="flex items-center justify-between">
              <span class="font-mono text-[10px] text-rose-400 font-bold uppercase">
                {{ event.type || 'ASSET_UPLOAD' }}
              </span>
              <span class="text-[10px] font-mono text-slate-500">
                {{ event.timestamp ? formatDate(event.timestamp) : 'RECENT' }}
              </span>
            </div>
            <p class="font-semibold text-slate-200 truncate">
              {{ event.title }}
            </p>
            <div class="flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>{{ event.description }}</span>
              <span class="text-rose-400 font-bold">SAVED</span>
            </div>
          </div>

          <div
            v-if="!dashboardStore.activity?.length"
            class="text-center py-12 text-slate-500 text-xs font-mono"
          >
            No asset activity logged in current buffer.
          </div>
        </div>

        <div class="mt-4 pt-3 border-t border-rose-950/70 flex items-center justify-between text-xs">
          <NuxtLink to="/media" class="text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1">
            <span>Open Asset Vault</span>
            <ArrowUpRight class="h-3 w-3" />
          </NuxtLink>
          <span class="text-[10px] font-mono text-slate-500">FASTLY CDN READY</span>
        </div>
      </div>
    </div>
  </div>
</template>