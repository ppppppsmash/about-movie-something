import { sequence } from '@sveltejs/kit/hooks';
import { handle as authHandle } from './auth';
import type { Handle } from '@sveltejs/kit';

/** Rewrite `<html lang="…">` per route so each page declares the correct language.
 *  Default = ja (no prefix), English = /en/* */
const langHandle: Handle = async ({ event, resolve }) => {
  const lang = event.url.pathname.startsWith('/en') ? 'en' : 'ja';
  return resolve(event, {
    transformPageChunk: ({ html }) => html.replace('<html lang="ja">', `<html lang="${lang}">`)
  });
};

export const handle = sequence(authHandle, langHandle);
