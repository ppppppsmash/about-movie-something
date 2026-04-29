import { resolveLocale } from '$lib/i18n';

export const prerender = true;
export const ssr = true;
export const trailingSlash = 'never';

export function load({ params }: { params: { lang?: string } }) {
  return { locale: resolveLocale(params.lang) };
}
