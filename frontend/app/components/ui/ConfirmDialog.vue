<script setup lang="ts">
import { AlertTriangle, X } from 'lucide-vue-next';

const { state, confirm, cancel } = useConfirm();
</script>

<template>
  <Teleport to="body">
    <div
      v-if="state.isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="surface-card w-full max-w-md overflow-hidden p-6 shadow-xl border border-slate-200 dark:border-slate-800"
      >
        <div class="flex items-start gap-4">
          <div
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
            :class="
              state.variant === 'danger'
                ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                : 'bg-sky-500/10 text-sky-500 border border-sky-500/20'
            "
          >
            <AlertTriangle class="h-5 w-5" />
          </div>
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <h3 class="text-base font-semibold text-slate-900 dark:text-slate-100">
                {{ state.title }}
              </h3>
              <button
                type="button"
                class="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                @click="cancel"
              >
                <X class="h-4 w-4" />
              </button>
            </div>
            <p class="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {{ state.message }}
            </p>
          </div>
        </div>

        <div class="mt-6 flex items-center justify-end gap-3">
          <button type="button" class="btn-secondary" @click="cancel">
            {{ state.cancelLabel }}
          </button>
          <button
            type="button"
            :class="state.variant === 'danger' ? 'btn-danger' : 'btn-primary'"
            @click="confirm"
          >
            {{ state.confirmLabel }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
