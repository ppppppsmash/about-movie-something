import { error } from '@sveltejs/kit';
import { getMovies } from '$lib/server/tmdb';
import type { EntryGenerator, PageServerLoad } from './$types';

export const prerender = true;

export const entries: EntryGenerator = async () => {
  const movies = await getMovies();
  return movies.map((m) => ({ slug: m.slug }));
};

export const load: PageServerLoad = async ({ params }) => {
  const movies = await getMovies();
  const movie = movies.find((m) => m.slug === params.slug);
  if (!movie) error(404, 'Movie not found');
  return { movie };
};
