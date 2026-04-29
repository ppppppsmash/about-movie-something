import { error } from '@sveltejs/kit';
import { getCombinedMovies } from '$lib/server/notion';
import { resolveLocale } from '$lib/i18n';
import type { PageServerLoad } from './$types';

// /movies/[slug] is dynamic now (combined data from Notion + seed), so no prerender / entries.
export const prerender = false;

export const load: PageServerLoad = async ({ params }) => {
  const locale = resolveLocale(params.lang);
  const movies = await getCombinedMovies(locale);
  const movie = movies.find((m) => m.slug === params.slug);
  if (!movie) error(404, 'Movie not found');
  return { movie };
};
