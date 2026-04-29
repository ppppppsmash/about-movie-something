import { error } from '@sveltejs/kit';
import { getMovies } from '$lib/server/tmdb';
import { resolveLocale } from '$lib/i18n';
import type { EntryGenerator, PageServerLoad } from './$types';

export const prerender = true;

export const entries: EntryGenerator = async () => {
  const movies = await getMovies();
  // Generate `/movies/<slug>` (Japanese, default) and `/en/movies/<slug>` (English) for each movie.
  return movies.flatMap((m) => [{ slug: m.slug }, { lang: 'en', slug: m.slug }]);
};

export const load: PageServerLoad = async ({ params }) => {
  const locale = resolveLocale(params.lang);
  const movies = await getMovies(locale);
  const movie = movies.find((m) => m.slug === params.slug);
  if (!movie) error(404, 'Movie not found');
  return { movie };
};
