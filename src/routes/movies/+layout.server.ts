import { getMovies } from '$lib/server/tmdb';

export async function load() {
  const movies = await getMovies();
  return { movies };
}
