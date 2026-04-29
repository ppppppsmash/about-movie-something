import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    prerender: {
      // All page routes opt out of prerender (Auth.js sessions are per-request) — only the
      // shell + assets remain static. No silenced routes at the moment (everything in the
      // nav has a corresponding route).
      handleHttpError: ({ path, referrer, message }) => {
        throw new Error(`${message} (linked from ${referrer})`);
      }
    }
  }
};

export default config;
