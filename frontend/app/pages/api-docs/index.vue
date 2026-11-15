<script setup lang="ts">
import {
  ExternalLink,
  Play,
  FileCode2,
  CheckCircle2,
} from 'lucide-vue-next';

useSeoMeta({
  title: 'API Documentation',
  description: 'Interactive REST API endpoint reference and live request tester for Syntecxhub NestJS backend.',
});

const config = useRuntimeConfig();
const api = useApiClient();

interface EndpointSpec {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  path: string;
  module: 'Dashboard' | 'Users' | 'Products' | 'Uploads';
  summary: string;
  queryOrBody?: string;
  testableGetPath?: string;
}

const endpoints: EndpointSpec[] = [
  {
    method: 'GET',
    path: '/api/dashboard/stats',
    module: 'Dashboard',
    summary: 'Aggregate total users, products, inventory value, media storage, and recent items',
    testableGetPath: '/dashboard/stats',
  },
  {
    method: 'GET',
    path: '/api/dashboard/activity',
    module: 'Dashboard',
    summary: 'Retrieve chronological platform activity stream across modules',
    testableGetPath: '/dashboard/activity',
  },
  {
    method: 'GET',
    path: '/api/users',
    module: 'Users',
    summary: 'Paginated user directory with search, role, status, and department filters',
    queryOrBody: '?page=1&limit=10&search=&role=admin&status=active',
    testableGetPath: '/users',
  },
  {
    method: 'GET',
    path: '/api/users/:id',
    module: 'Users',
    summary: 'Retrieve single user details by 24-char MongoDB ObjectId',
  },
  {
    method: 'POST',
    path: '/api/users',
    module: 'Users',
    summary: 'Create user with class-validator validation and duplicate email prevention (409 Conflict)',
    queryOrBody: '{ fullName, email, phoneNumber, role, status, department, jobTitle }',
  },
  {
    method: 'PATCH',
    path: '/api/users/:id',
    module: 'Users',
    summary: 'Update existing user attributes and verify unique email constraint',
  },
  {
    method: 'DELETE',
    path: '/api/users/:id',
    module: 'Users',
    summary: 'Permanently delete a user by MongoDB ObjectId',
  },
  {
    method: 'GET',
    path: '/api/products',
    module: 'Products',
    summary: 'Paginated products catalog with search, category, minPrice/maxPrice, and sorting',
    queryOrBody: '?page=1&limit=10&category=Network+Hardware&minPrice=100&maxPrice=5000',
    testableGetPath: '/products',
  },
  {
    method: 'GET',
    path: '/api/products/categories',
    module: 'Products',
    summary: 'List all available enterprise product categories',
    testableGetPath: '/products/categories',
  },
  {
    method: 'GET',
    path: '/api/products/:id',
    module: 'Products',
    summary: 'Retrieve single product details by MongoDB ObjectId',
  },
  {
    method: 'POST',
    path: '/api/products',
    module: 'Products',
    summary: 'Create new inventory product with unique SKU validation and auto stock status',
    queryOrBody: '{ name, sku, price, description, category, stockQuantity, image }',
  },
  {
    method: 'PATCH',
    path: '/api/products/:id',
    module: 'Products',
    summary: 'Update product details, stock quantity, or pricing',
  },
  {
    method: 'DELETE',
    path: '/api/products/:id',
    module: 'Products',
    summary: 'Remove product SKU from MongoDB catalog',
  },
  {
    method: 'GET',
    path: '/api/uploads',
    module: 'Uploads',
    summary: 'Paginated media library records with filename search and MIME filter',
    testableGetPath: '/uploads',
  },
  {
    method: 'POST',
    path: '/api/uploads',
    module: 'Uploads',
    summary: 'Multipart image upload (Multer) with MIME whitelist and 5MB size limit',
    queryOrBody: 'multipart/form-data: files[] (JPEG, PNG, WebP, GIF, SVG)',
  },
  {
    method: 'DELETE',
    path: '/api/uploads/:id',
    module: 'Uploads',
    summary: 'Delete uploaded image file from disk (/uploads) and MongoDB',
  },
];

const liveResponseJson = ref<string>('');
const activeTestedPath = ref<string>('');
const testingEndpoint = ref(false);

const runLiveGetTest = async (path: string) => {
  testingEndpoint.value = true;
  activeTestedPath.value = path;
  try {
    const res = await api.get(path);
    liveResponseJson.value = JSON.stringify(res, null, 2);
  } catch (err: unknown) {
    liveResponseJson.value = JSON.stringify(
      { error: api.extractApiErrorMessage(err) },
      null,
      2,
    );
  } finally {
    testingEndpoint.value = false;
  }
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          OpenAPI &amp; REST Endpoint Reference
        </h2>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Complete specification of the NestJS backend modules and live response inspector.
        </p>
      </div>
      <a
        :href="`${config.public.backendOrigin}/api/docs`"
        target="_blank"
        rel="noopener noreferrer"
        class="btn-primary"
      >
        <FileCode2 class="h-4 w-4" />
        Open Interactive Swagger UI (/api/docs)
        <ExternalLink class="h-3.5 w-3.5" />
      </a>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Endpoints List -->
      <div class="lg:col-span-2 space-y-3">
        <div
          v-for="ep in endpoints"
          :key="`${ep.method}-${ep.path}`"
          class="surface-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div class="space-y-1">
            <div class="flex items-center gap-2.5">
              <span
                class="rounded px-2 py-0.5 font-mono text-xs font-bold"
                :class="{
                  'bg-sky-500/15 text-sky-500 border border-sky-500/30': ep.method === 'GET',
                  'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30': ep.method === 'POST',
                  'bg-amber-500/15 text-amber-500 border border-amber-500/30': ep.method === 'PATCH',
                  'bg-rose-500/15 text-rose-500 border border-rose-500/30': ep.method === 'DELETE',
                }"
              >
                {{ ep.method }}
              </span>
              <code class="font-mono text-xs font-semibold text-slate-900 dark:text-white">
                {{ ep.path }}
              </code>
              <span class="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                {{ ep.module }}Module
              </span>
            </div>
            <p class="text-xs text-slate-600 dark:text-slate-400">
              {{ ep.summary }}
            </p>
            <p
              v-if="ep.queryOrBody"
              class="font-mono text-[11px] text-slate-400 dark:text-slate-500"
            >
              {{ ep.queryOrBody }}
            </p>
          </div>

          <button
            v-if="ep.testableGetPath"
            type="button"
            class="btn-secondary text-xs shrink-0"
            :disabled="testingEndpoint"
            @click="runLiveGetTest(ep.testableGetPath)"
          >
            <Play class="h-3.5 w-3.5 text-sky-500" />
            Test Live
          </button>
        </div>
      </div>

      <!-- Live JSON Response Inspector -->
      <div class="surface-card p-5 h-fit sticky top-20 space-y-3">
        <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <h3 class="text-sm font-bold text-slate-900 dark:text-white">
            Live Response Inspector
          </h3>
          <span
            v-if="activeTestedPath"
            class="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-500"
          >
            <CheckCircle2 class="h-3.5 w-3.5" />
            GET {{ activeTestedPath }}
          </span>
        </div>

        <pre
          v-if="liveResponseJson"
          class="max-h-[520px] overflow-auto rounded-lg bg-slate-950 p-3.5 font-mono text-[11px] text-sky-300 border border-slate-800"
        >{{ liveResponseJson }}</pre>
        <div
          v-else
          class="py-12 text-center text-xs text-slate-400"
        >
          Click "Test Live" on any GET endpoint to execute a real request against the NestJS API and inspect the JSON response payload.
        </div>
      </div>
    </div>
  </div>
</template>
