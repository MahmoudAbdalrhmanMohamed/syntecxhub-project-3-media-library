<script setup lang="ts">
import {
  UploadCloud,
  Copy,
  Check,
  Trash2,
  Search,
  FileImage,
  ExternalLink,
  X,
  HardDrive,
} from 'lucide-vue-next';
import { useClipboard, useDebounceFn } from '@vueuse/core';
import type { UploadRecord } from '#shared/types/api';
import { validateClientImageFile } from '#shared/validation/schemas';

useSeoMeta({
  title: 'Media Library',
  description:
    'Drag-and-drop multi-image upload pipeline with MIME validation, preview queue, and MongoDB metadata indexing.',
});

const uploadsStore = useUploadsStore();
const toast = useToast();
const confirmDialog = useConfirm();
const { formatBytes, formatDateTime } = useFormatters();
const { resolveAssetUrl, extractApiErrorMessage } = useApiClient();
const { copy, copied } = useClipboard();

await useAsyncData('media-library', async () => {
  await uploadsStore.fetchUploads();
  if (uploadsStore.items[0] && !uploadsStore.selectedFile) {
    uploadsStore.selectedFile = uploadsStore.items[0];
  }
  return true;
});

const debouncedSearch = useDebounceFn(() => {
  uploadsStore.filters.page = 1;
  uploadsStore.fetchUploads();
}, 300);

// Drag & Drop + Pre-upload Preview Queue
interface QueuedPreviewFile {
  id: string;
  file: File;
  previewUrl: string;
  error: string | null;
}

const isDragging = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);
const queuedFiles = ref<QueuedPreviewFile[]>([]);

const addFilesToQueue = (fileList: FileList | File[]) => {
  const incoming = Array.from(fileList);
  for (const file of incoming) {
    const validationErr = validateClientImageFile(file);
    const previewUrl =
      !validationErr && import.meta.client ? URL.createObjectURL(file) : '';
    queuedFiles.value.push({
      id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      file,
      previewUrl,
      error: validationErr,
    });
  }
};

const handleFileSelect = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    addFilesToQueue(input.files);
    input.value = '';
  }
};

const handleDrop = (e: DragEvent) => {
  isDragging.value = false;
  if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
    addFilesToQueue(e.dataTransfer.files);
  }
};

const removeQueuedFile = (id: string) => {
  const item = queuedFiles.value.find((q) => q.id === id);
  if (item?.previewUrl && import.meta.client) {
    URL.revokeObjectURL(item.previewUrl);
  }
  queuedFiles.value = queuedFiles.value.filter((q) => q.id !== id);
};

const validQueuedFiles = computed(() =>
  queuedFiles.value.filter((q) => !q.error).map((q) => q.file),
);

const handleUploadQueued = async () => {
  if (validQueuedFiles.value.length === 0) {
    toast.warning('No Valid Files', 'Please remove invalid files before uploading.');
    return;
  }

  try {
    const saved = await uploadsStore.uploadFilesWithProgress(validQueuedFiles.value);
    for (const q of queuedFiles.value) {
      if (q.previewUrl && import.meta.client) {
        URL.revokeObjectURL(q.previewUrl);
      }
    }
    queuedFiles.value = [];
    toast.success(
      'Upload Complete',
      `${saved.length} image asset(s) stored on disk and indexed in MongoDB.`,
    );
  } catch (err: unknown) {
    toast.error('Upload Error', extractApiErrorMessage(err));
  }
};

const handleCopyUrl = async (url: string) => {
  const fullUrl = resolveAssetUrl(url);
  await copy(fullUrl);
  toast.success('Public URL Copied', fullUrl);
};

const handleDeleteAsset = async (record: UploadRecord) => {
  const confirmed = await confirmDialog.ask({
    title: 'Delete Media Asset',
    message: `Are you sure you want to delete "${record.originalName}" (${record.storedName}) from the server and MongoDB?`,
    confirmLabel: 'Delete File',
    variant: 'danger',
  });
  if (!confirmed) return;

  try {
    await uploadsStore.deleteUpload(record._id);
    toast.success('File Deleted', `${record.originalName} has been removed.`);
  } catch (err: unknown) {
    toast.error('Delete Failed', extractApiErrorMessage(err));
  }
};
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Media Asset Library
        </h2>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Upload product photography and SVG diagrams with automatic MongoDB metadata indexing.
        </p>
      </div>
      <button
        type="button"
        class="btn-primary"
        @click="fileInputRef?.click()"
      >
        <UploadCloud class="h-4 w-4" />
        Select Images
      </button>
      <input
        ref="fileInputRef"
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        class="hidden"
        @change="handleFileSelect"
      />
    </div>

    <!-- Drag & Drop Zone -->
    <div
      class="surface-card border-2 border-dashed p-6 sm:p-8 text-center transition-all cursor-pointer"
      :class="
        isDragging
          ? 'border-rose-500 bg-rose-500/10 shadow-lg shadow-rose-500/20'
          : 'border-slate-300 dark:border-rose-950/60 hover:border-rose-500/60 hover:bg-rose-500/5'
      "
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      @click="fileInputRef?.click()"
    >
      <div
        class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500/20 to-fuchsia-500/20 text-rose-500 border border-rose-500/30 shadow-md shadow-rose-500/10"
      >
        <UploadCloud class="h-6 w-6" />
      </div>
      <h3 class="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
        Drag and drop image files here, or click to browse
      </h3>
      <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
        Supports JPEG, PNG, WebP, GIF, and SVG up to 5.0 MB per file (up to 10 files per batch)
      </p>
    </div>

    <!-- Pre-Upload Staging Queue & Progress Bar -->
    <div v-if="queuedFiles.length > 0" class="surface-card p-5 space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h4 class="text-sm font-semibold text-slate-900 dark:text-white">
            Staged for Upload ({{ queuedFiles.length }} file{{ queuedFiles.length === 1 ? '' : 's' }})
          </h4>
          <p class="text-xs text-slate-500">
            Verify image previews and validation status before committing to NestJS storage.
          </p>
        </div>
        <div class="flex items-center gap-2.5">
          <button
            type="button"
            class="btn-secondary text-xs"
            :disabled="uploadsStore.uploading"
            @click="queuedFiles = []"
          >
            Clear Queue
          </button>
          <button
            type="button"
            class="btn-primary text-xs"
            :disabled="uploadsStore.uploading || validQueuedFiles.length === 0"
            @click="handleUploadQueued"
          >
            <UploadCloud class="h-4 w-4" />
            {{
              uploadsStore.uploading
                ? `Uploading (${uploadsStore.uploadProgress}%)`
                : `Upload ${validQueuedFiles.length} Valid File(s)`
            }}
          </button>
        </div>
      </div>

      <!-- Progress bar -->
      <div
        v-if="uploadsStore.uploading"
        class="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
      >
        <div
          class="h-full bg-gradient-to-r from-rose-500 to-fuchsia-500 transition-all duration-200"
          :style="{ width: `${uploadsStore.uploadProgress}%` }"
        />
      </div>

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="item in queuedFiles"
          :key="item.id"
          class="flex items-center gap-3 rounded-lg border p-2.5"
          :class="
            item.error
              ? 'border-rose-500/40 bg-rose-500/5'
              : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50'
          "
        >
          <div class="h-12 w-12 rounded-lg bg-slate-900 overflow-hidden shrink-0 flex items-center justify-center">
            <img
              v-if="item.previewUrl"
              :src="item.previewUrl"
              :alt="item.file.name"
              class="h-full w-full object-cover"
            />
            <FileImage v-else class="h-5 w-5 text-rose-400" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-xs font-semibold text-slate-900 dark:text-slate-100">
              {{ item.file.name }}
            </p>
            <p
              v-if="item.error"
              class="text-[11px] text-rose-500 line-clamp-2"
            >
              {{ item.error }}
            </p>
            <p v-else class="font-mono text-[11px] text-emerald-500">
              {{ formatBytes(item.file.size) }} • Ready
            </p>
          </div>
          <button
            type="button"
            class="rounded p-1 text-slate-400 hover:text-rose-500"
            @click="removeQueuedFile(item.id)"
          >
            <X class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Search & MIME Filter + Main Gallery & Details Split View -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Left 2 Columns: Gallery Grid -->
      <div class="lg:col-span-2 space-y-4">
        <div class="surface-card p-3.5 flex flex-col sm:flex-row items-center gap-3">
          <div class="relative flex-1 w-full">
            <Search
              class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            />
            <input
              v-model="uploadsStore.filters.search"
              type="search"
              placeholder="Search uploaded files by filename..."
              class="input-field pl-9"
              @input="debouncedSearch"
            />
          </div>
          <select
            v-model="uploadsStore.filters.mimeType"
            class="input-field sm:w-48"
            @change="
              uploadsStore.filters.page = 1;
              uploadsStore.fetchUploads();
            "
          >
            <option value="">All Image Formats</option>
            <option value="image/svg+xml">SVG Vector (image/svg+xml)</option>
            <option value="image/png">PNG (image/png)</option>
            <option value="image/jpeg">JPEG (image/jpeg)</option>
            <option value="image/webp">WebP (image/webp)</option>
          </select>
        </div>

        <div v-if="uploadsStore.loading" class="surface-card p-6">
          <UiTableSkeleton :rows="4" :columns="3" />
        </div>

        <div v-else-if="uploadsStore.items.length === 0" class="surface-card p-6">
          <UiEmptyState
            title="No uploaded media files"
            description="Drag and drop images above to populate the media library."
          />
        </div>

        <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div
            v-for="asset in uploadsStore.items"
            :key="asset._id"
            class="surface-card overflow-hidden cursor-pointer transition-all"
            :class="
              uploadsStore.selectedFile?._id === asset._id
                ? 'ring-2 ring-rose-500 border-rose-500 shadow-md shadow-rose-500/20'
                : 'hover:border-rose-500/40 dark:hover:border-rose-800/60'
            "
            @click="uploadsStore.selectedFile = asset"
          >
            <div class="aspect-16/10 w-full bg-slate-900 border-b border-slate-200 dark:border-slate-800 overflow-hidden">
              <img
                :src="resolveAssetUrl(asset.publicUrl)"
                :alt="asset.originalName"
                class="h-full w-full object-cover"
              />
            </div>
            <div class="p-3.5">
              <p class="truncate text-xs font-semibold text-slate-900 dark:text-slate-100">
                {{ asset.originalName }}
              </p>
              <div class="mt-1 flex items-center justify-between font-mono text-[11px] text-slate-500">
                <span>{{ formatBytes(asset.size) }}</span>
                <span>{{ asset.mimeType.split('/')[1] }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="uploadsStore.items.length > 0" class="surface-card">
          <UiPaginationBar
            :meta="uploadsStore.meta"
            @change="
              (p: number) => {
                uploadsStore.filters.page = p;
                uploadsStore.fetchUploads();
              }
            "
          />
        </div>
      </div>

      <!-- Right Column: Metadata Details Panel -->
      <div class="surface-card p-5 h-fit sticky top-20">
        <div
          v-if="uploadsStore.selectedFile"
          class="space-y-5"
        >
          <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 class="text-sm font-bold text-slate-900 dark:text-white">
              Asset Metadata Inspector
            </h3>
            <span class="rounded bg-rose-500/10 px-2 py-0.5 font-mono text-[10px] text-rose-400 border border-rose-500/20">
              {{ uploadsStore.selectedFile.mimeType }}
            </span>
          </div>

          <div class="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900">
            <img
              :src="resolveAssetUrl(uploadsStore.selectedFile.publicUrl)"
              :alt="uploadsStore.selectedFile.originalName"
              class="w-full h-44 object-contain"
            />
          </div>

          <div class="space-y-2.5 text-xs">
            <div>
              <span class="text-slate-400 block text-[11px]">Original Filename</span>
              <span class="font-semibold text-slate-900 dark:text-white break-all">
                {{ uploadsStore.selectedFile.originalName }}
              </span>
            </div>
            <div>
              <span class="text-slate-400 block text-[11px]">Stored Filename</span>
              <span class="font-mono text-slate-700 dark:text-slate-300 break-all">
                {{ uploadsStore.selectedFile.storedName }}
              </span>
            </div>
            <div class="grid grid-cols-2 gap-2 pt-1">
              <div class="rounded-lg bg-slate-50 dark:bg-slate-950 p-2.5 border border-slate-200 dark:border-slate-800">
                <span class="text-slate-400 block text-[10px]">File Size</span>
                <span class="font-mono font-semibold text-slate-900 dark:text-white">
                  {{ formatBytes(uploadsStore.selectedFile.size) }}
                </span>
              </div>
              <div class="rounded-lg bg-slate-50 dark:bg-slate-950 p-2.5 border border-slate-200 dark:border-slate-800">
                <span class="text-slate-400 block text-[10px]">Uploaded</span>
                <span class="font-mono text-[11px] text-slate-900 dark:text-white">
                  {{ formatDateTime(uploadsStore.selectedFile.uploadDate) }}
                </span>
              </div>
            </div>
            <div>
              <span class="text-slate-400 block text-[11px]">Server File Path</span>
              <span class="font-mono text-[11px] text-slate-600 dark:text-slate-400 break-all">
                {{ uploadsStore.selectedFile.filePath }}
              </span>
            </div>
            <div>
              <span class="text-slate-400 block text-[11px] mb-1">Public URL</span>
              <div class="flex items-center gap-1.5">
                <input
                  :value="resolveAssetUrl(uploadsStore.selectedFile.publicUrl)"
                  readonly
                  class="input-field font-mono text-[11px] py-1.5"
                />
                <button
                  type="button"
                  class="btn-secondary px-2.5 py-1.5 shrink-0"
                  title="Copy Public URL"
                  @click="handleCopyUrl(uploadsStore.selectedFile.publicUrl)"
                >
                  <Check v-if="copied" class="h-4 w-4 text-emerald-500" />
                  <Copy v-else class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2.5 border-t border-slate-200 dark:border-slate-800 pt-4">
            <a
              :href="resolveAssetUrl(uploadsStore.selectedFile.publicUrl)"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-secondary flex-1 text-xs"
            >
              Open Raw Asset
              <ExternalLink class="h-3.5 w-3.5" />
            </a>
            <button
              type="button"
              class="btn-danger text-xs"
              @click="handleDeleteAsset(uploadsStore.selectedFile)"
            >
              <Trash2 class="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        </div>

        <div v-else class="py-12 text-center text-xs text-slate-400 space-y-2">
          <HardDrive class="h-8 w-8 mx-auto text-slate-500" />
          <p>Select any image asset from the gallery to inspect its MongoDB metadata.</p>
        </div>
      </div>
    </div>
  </div>
</template>
