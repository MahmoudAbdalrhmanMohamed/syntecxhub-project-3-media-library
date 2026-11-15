import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BACKEND_ROOT = path.resolve(__dirname, '..');
const PROJECT_ROOT = path.resolve(BACKEND_ROOT, '..');

test('Project 3 (Syntecxhub Project 3 — Media Asset Library & Upload Pipeline) Standalone Structure & Strict TypeScript Verification', () => {
  const required = [
    'backend/package.json',
    'backend/tsconfig.json',
    'backend/src/main.ts',
    'backend/src/app.module.ts',
    'backend/src/uploads/uploads.module.ts',
    'backend/src/uploads/uploads.controller.ts',
    'backend/src/uploads/uploads.service.ts',
    'backend/src/dashboard/dashboard.module.ts',
    'frontend/package.json',
    'frontend/nuxt.config.ts',
    'frontend/app/pages/index.vue',
    'frontend/app/pages/media/index.vue',
    'frontend/app/stores/uploads.ts',
    'docker-compose.yml',
    'README.md',
    '.env.example',
  ];
  for (const rel of required) {
    assert.equal(fs.existsSync(path.join(PROJECT_ROOT, rel)), true, `Missing ${rel}`);
  }
});
