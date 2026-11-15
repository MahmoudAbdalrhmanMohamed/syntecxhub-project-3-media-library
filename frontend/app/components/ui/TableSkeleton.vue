<script setup lang="ts">
withDefaults(
  defineProps<{
    rows?: number;
    columns?: number;
  }>(),
  {
    rows: 6,
    columns: 5,
  },
);
</script>

<template>
  <div class="w-full divide-y divide-slate-200 dark:divide-slate-800/80">
    <div
      v-for="r in rows"
      :key="r"
      class="flex items-center justify-between gap-4 px-5 py-4 animate-pulse"
    >
      <div class="flex items-center gap-3 flex-1">
        <div class="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
        <div class="space-y-2 flex-1 max-w-xs">
          <div class="h-3.5 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
          <div class="h-2.5 w-1/2 rounded bg-slate-100 dark:bg-slate-800/60" />
        </div>
      </div>
      <div
        v-for="c in columns - 1"
        :key="c"
        class="hidden sm:block h-3.5 w-24 rounded bg-slate-200 dark:bg-slate-800"
      />
    </div>
  </div>
</template>
