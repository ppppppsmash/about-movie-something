import { getDailyPicks } from '$lib/server/tmdb';
import { resolveLocale } from '$lib/i18n';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load: PageServerLoad = async ({ params }) => {
  const locale = resolveLocale(params.lang);
  const movies = await getDailyPicks(locale, 5);
  return { movies };
};
