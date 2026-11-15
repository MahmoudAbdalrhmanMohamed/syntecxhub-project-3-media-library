<script setup lang="ts">
import { AlertOctagon, ArrowLeft } from 'lucide-vue-next';

defineProps<{
  error: {
    statusCode?: number;
    message?: string;
  };
}>();

const handleClearError = () => clearError({ redirect: '/' });
</script>

<template>
  <div
    class="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center text-slate-100"
  >
    <div
      class="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400"
    >
      <AlertOctagon class="h-7 w-7" />
    </div>
    <p class="mt-4 font-mono text-xs uppercase tracking-widest text-rose-400">
      HTTP Error {{ error?.statusCode || 500 }}
    </p>
    <h1 class="mt-2 text-2xl font-bold tracking-tight">
      Unable to render requested view
    </h1>
    <p class="mt-2 max-w-md text-sm text-slate-400">
      {{ error?.message || 'An unexpected application exception occurred.' }}
    </p>
    <button type="button" class="btn-primary mt-6" @click="handleClearError">
      <ArrowLeft class="h-4 w-4" />
      Return to Control Plane
    </button>
  </div>
</template>
