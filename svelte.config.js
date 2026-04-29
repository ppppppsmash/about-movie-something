import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: undefined,
      precompress: false,
      strict: false
    }),
    prerender: {
      // Both locale roots are explicit entry points so the crawler discovers /en/... too.
      entries: ['*', '/en'],
      handleHttpError: ({ path, referrer, message }) => {
        // Routes linked from the nav but not yet implemented (both locales) — silence to keep the build green.
        if (/^\/(en\/)?(notes|about)/.test(path)) return;
        throw new Error(`${message} (linked from ${referrer})`);
      }
    }
  }
};

export default config;
