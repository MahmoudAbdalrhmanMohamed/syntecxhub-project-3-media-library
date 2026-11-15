<script setup lang="ts">
import { FolderSearch } from 'lucide-vue-next';

defineProps<{
  title: string;
  description: string;
  actionLabel?: string;
}>();

defineEmits<{
  (e: 'action'): void;
}>();
</script>

<template>
  <div
    class="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 px-6 py-14 text-center"
  >
    <div
      class="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
    >
      <slot name="icon">
        <FolderSearch class="h-6 w-6" />
      </slot>
    </div>
    <h3 class="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">
      {{ title }}
    </h3>
    <p class="mt-1.5 max-w-md text-sm text-slate-500 dark:text-slate-400">
      {{ description }}
    </p>
    <div v-if="actionLabel" class="mt-5">
      <button type="button" class="btn-primary" @click="$emit('action')">
        {{ actionLabel }}
      </button>
    </div>
  </div>
</template>
