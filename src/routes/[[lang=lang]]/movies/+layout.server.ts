import { getCombinedMovies } from '$lib/server/notion';
import { resolveLocale } from '$lib/i18n';

// Disable prerender for /movies/* — data comes from Notion at runtime so additions
// from the /search page show up immediately on the next visit.
export const prerender = false;

export async function load({ params }: { params: { lang?: string } }) {
  const locale = resolveLocale(params.lang);
  const movies = await getCombinedMovies(locale);
  return { movies };
}
