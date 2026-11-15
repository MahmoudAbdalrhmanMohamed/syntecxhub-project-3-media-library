<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import type { PaginationMeta } from '#shared/types/api';

const props = defineProps<{
  meta: PaginationMeta;
}>();

const emit = defineEmits<{
  (e: 'change', page: number): void;
}>();

const startRecord = computed(() => {
  if (props.meta.total === 0) return 0;
  return (props.meta.page - 1) * props.meta.limit + 1;
});

const endRecord = computed(() => {
  return Math.min(props.meta.total, props.meta.page * props.meta.limit);
});

const visiblePages = computed(() => {
  const total = props.meta.totalPages || 1;
  const current = props.meta.page || 1;
  const pages: number[] = [];
  const start = Math.max(1, current - 2);
  const end = Math.min(total, start + 4);
  for (let i = start; i <= end; i += 1) {
    pages.push(i);
  }
  return pages;
});
</script>

<template>
  <div
    class="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800 px-5 py-3.5 text-xs text-slate-600 dark:text-slate-400"
  >
    <div>
      Showing
      <span class="font-semibold text-slate-900 dark:text-slate-200">{{
        startRecord
      }}</span>
      to
      <span class="font-semibold text-slate-900 dark:text-slate-200">{{
        endRecord
      }}</span>
      of
      <span class="font-semibold text-slate-900 dark:text-slate-200">{{
        meta.total
      }}</span>
      records
    </div>

    <div class="flex items-center gap-1.5">
      <button
        type="button"
        class="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-800 px-2.5 py-1.5 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
        :disabled="!meta.hasPrevPage"
        @click="emit('change', meta.page - 1)"
      >
        <ChevronLeft class="h-3.5 w-3.5" />
        Prev
      </button>

      <button
        v-for="p in visiblePages"
        :key="p"
        type="button"
        class="h-7 min-w-7 rounded-lg px-2 font-medium transition-colors"
        :class="
          p === meta.page
            ? 'bg-sky-600 text-white shadow-xs'
            : 'border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
        "
        @click="emit('change', p)"
      >
        {{ p }}
      </button>

      <button
        type="button"
        class="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-800 px-2.5 py-1.5 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
        :disabled="!meta.hasNextPage"
        @click="emit('change', meta.page + 1)"
      >
        Next
        <ChevronRight class="h-3.5 w-3.5" />
      </button>
    </div>
  </div>
</template>
