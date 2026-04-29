import { resolveLocale } from '$lib/i18n';

// Auth.js sessions are per-request, so pages can no longer be prerendered.
export const prerender = false;
export const ssr = true;
export const trailingSlash = 'never';

export function load({ params }: { params: { lang?: string } }) {
  return { locale: resolveLocale(params.lang) };
}
