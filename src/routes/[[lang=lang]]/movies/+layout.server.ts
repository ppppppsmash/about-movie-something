import { getMovies } from '$lib/server/tmdb';
import { resolveLocale } from '$lib/i18n';

export async function load({ params }: { params: { lang?: string } }) {
  const locale = resolveLocale(params.lang);
  const movies = await getMovies(locale);
  return { movies };
}
