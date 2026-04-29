import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    prerender: {
      // All page routes opt out of prerender (Auth.js sessions are per-request) — only the
      // shell + assets remain static. handleHttpError still silences not-yet-implemented routes
      // in case they get crawled.
      handleHttpError: ({ path, referrer, message }) => {
        if (/^\/(en\/)?notes/.test(path)) return;
        throw new Error(`${message} (linked from ${referrer})`);
      }
    }
  }
};

export default config;
