<script setup lang="ts">
import {
  ShieldCheck,
  Server,
  Sun,
  Moon,
  CheckCircle2,
  RefreshCw,
} from 'lucide-vue-next';

useSeoMeta({
  title: 'Platform Settings',
  description: 'Configure workspace operator profile, theme preferences, and inspect NestJS backend security policies.',
});

const uiStore = useUiStore();
const colorMode = useColorMode();
const config = useRuntimeConfig();
const api = useApiClient();
const toast = useToast();

const checkingHealth = ref(false);
const backendLatencyMs = ref<number | null>(14);
const backendConnected = ref(true);

const verifyBackendConnection = async () => {
  checkingHealth.value = true;
  const start = Date.now();
  try {
    await api.get('/dashboard/stats');
    backendLatencyMs.value = Date.now() - start;
    backendConnected.value = true;
    toast.success(
      'Backend Healthy',
      `Connected to ${config.public.apiBaseUrl} (${backendLatencyMs.value} ms).`,
    );
  } catch (err: unknown) {
    backendConnected.value = false;
    toast.error('Connection Check Failed', api.extractApiErrorMessage(err));
  } finally {
    checkingHealth.value = false;
  }
};

const saveOperatorProfile = () => {
  toast.success(
    'Preferences Saved',
    `Operator profile updated for ${uiStore.currentOperator.name}.`,
  );
};
</script>

<template>
  <div class="space-y-6 max-w-5xl">
    <div>
      <h2 class="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
        Workspace &amp; Runtime Configuration
      </h2>
      <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Manage operator identity, interface theme, and inspect active NestJS security policies.
      </p>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Operator Profile Form -->
      <div class="surface-card p-6 space-y-4">
        <h3 class="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">
          Active Operator Profile
        </h3>
        <div class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Display Name
            </label>
            <input v-model="uiStore.currentOperator.name" type="text" class="input-field" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Work Email
            </label>
            <input v-model="uiStore.currentOperator.email" type="email" class="input-field" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Role Title
            </label>
            <input v-model="uiStore.currentOperator.role" type="text" class="input-field" />
          </div>
          <div class="pt-2">
            <button type="button" class="btn-primary" @click="saveOperatorProfile">
              Save Operator Profile
            </button>
          </div>
        </div>
      </div>

      <!-- Theme & Connection Health -->
      <div class="space-y-6">
        <div class="surface-card p-6 space-y-4">
          <h3 class="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">
            Appearance &amp; Theme Mode
          </h3>
          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              class="flex items-center justify-center gap-2 rounded-xl border p-3.5 text-xs font-semibold transition-all"
              :class="
                colorMode.value === 'dark'
                  ? 'border-sky-500 bg-sky-500/10 text-sky-400'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600'
              "
              @click="colorMode.preference = 'dark'"
            >
              <Moon class="h-4 w-4" />
              Dark Slate (Default)
            </button>
            <button
              type="button"
              class="flex items-center justify-center gap-2 rounded-xl border p-3.5 text-xs font-semibold transition-all"
              :class="
                colorMode.value === 'light'
                  ? 'border-sky-500 bg-sky-500/10 text-sky-600'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              "
              @click="colorMode.preference = 'light'"
            >
              <Sun class="h-4 w-4" />
              Light Daylight
            </button>
          </div>
        </div>

        <div class="surface-card p-6 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Server class="h-4 w-4 text-sky-500" />
              NestJS API Gateway Telemetry
            </h3>
            <span
              class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
              :class="
                backendConnected
                  ? 'bg-emerald-500/10 text-emerald-500'
                  : 'bg-rose-500/10 text-rose-500'
              "
            >
              <CheckCircle2 class="h-3.5 w-3.5" />
              {{ backendConnected ? 'Connected' : 'Unreachable' }}
            </span>
          </div>

          <div class="space-y-2 text-xs font-mono">
            <div class="flex justify-between">
              <span class="text-slate-500">runtimeConfig.public.apiBaseUrl:</span>
              <span class="text-slate-900 dark:text-slate-200">{{
                config.public.apiBaseUrl
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Security Middleware:</span>
              <span class="text-emerald-500">Helmet + CORS + Throttler (120 req/min)</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Upload Validation:</span>
              <span class="text-slate-900 dark:text-slate-200">5.0 MB Max • Image MIME Whitelist</span>
            </div>
          </div>

          <button
            type="button"
            class="btn-secondary w-full"
            :disabled="checkingHealth"
            @click="verifyBackendConnection"
          >
            <RefreshCw
              class="h-4 w-4"
              :class="{ 'animate-spin': checkingHealth }"
            />
            Ping NestJS Backend Endpoint
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
