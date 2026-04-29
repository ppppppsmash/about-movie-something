import { getCombinedMovies } from '$lib/server/notion';
import { resolveLocale } from '$lib/i18n';

// Disable prerender for /movies/* — data comes from Notion at runtime so additions
// from the search box show up immediately on the next visit.
export const prerender = false;

export async function load({
  params,
  depends
}: {
  params: { lang?: string };
  depends: (...deps: string[]) => void;
}) {
  // Tag this load so the BestToggle can re-trigger it via invalidate('app:movies').
  depends('app:movies');
  const locale = resolveLocale(params.lang);
  const movies = await getCombinedMovies(locale);
  return { movies };
}
