// @ts-check
import { defineConfig } from 'astro/config';
import { resultsApi } from './results-api.mjs';

// https://astro.build/config
export default defineConfig({
  vite: { plugins: [resultsApi()] },
});
