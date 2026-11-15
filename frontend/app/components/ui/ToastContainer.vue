<script setup lang="ts">
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-vue-next';

const { toasts, dismiss } = useToast();
</script>

<template>
  <div
    class="fixed bottom-5 right-5 z-50 flex w-full max-w-sm flex-col gap-2.5 pointer-events-none"
    aria-live="polite"
  >
    <TransitionGroup
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-2 opacity-0"
    >
      <div
        v-for="item in toasts"
        :key="item.id"
        class="pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-lg backdrop-blur-md"
        :class="{
          'border-emerald-500/30 bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-slate-100':
            item.type === 'success',
          'border-rose-500/40 bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-slate-100':
            item.type === 'error',
          'border-amber-500/40 bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-slate-100':
            item.type === 'warning',
          'border-sky-500/30 bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-slate-100':
            item.type === 'info',
        }"
      >
        <CheckCircle2
          v-if="item.type === 'success'"
          class="h-5 w-5 shrink-0 text-emerald-500 mt-0.5"
        />
        <AlertCircle
          v-else-if="item.type === 'error'"
          class="h-5 w-5 shrink-0 text-rose-500 mt-0.5"
        />
        <AlertTriangle
          v-else-if="item.type === 'warning'"
          class="h-5 w-5 shrink-0 text-amber-500 mt-0.5"
        />
        <Info v-else class="h-5 w-5 shrink-0 text-sky-500 mt-0.5" />

        <div class="min-w-0 flex-1">
          <p class="text-sm font-semibold leading-5">{{ item.title }}</p>
          <p
            v-if="item.description"
            class="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed"
          >
            {{ item.description }}
          </p>
        </div>

        <button
          type="button"
          class="rounded-md p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200"
          @click="dismiss(item.id)"
        >
          <X class="h-4 w-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>
