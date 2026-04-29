import type { Handle } from '@sveltejs/kit';

/** Rewrite `<html lang="…">` per route so each prerendered page declares the correct language.
 *  Default = ja (no prefix), English = /en/* */
export const handle: Handle = async ({ event, resolve }) => {
  const lang = event.url.pathname.startsWith('/en') ? 'en' : 'ja';
  return resolve(event, {
    transformPageChunk: ({ html }) => html.replace('<html lang="ja">', `<html lang="${lang}">`)
  });
};
