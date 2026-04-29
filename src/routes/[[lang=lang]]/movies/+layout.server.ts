import { getCombinedMovies } from '$lib/server/notion';
import { resolveLocale } from '$lib/i18n';
import type { LayoutServerLoad } from './$types';

export const prerender = false;

export const load: LayoutServerLoad = async ({ params, depends, locals }) => {
  // Tag this load so BestToggle can re-trigger it via invalidate('app:movies').
  depends('app:movies');

  const session = await locals.auth();
  const locale = resolveLocale(params.lang);

  // No session = no Notion data; show only seed (currently empty).
  const movies = session?.user?.email
    ? await getCombinedMovies(locale, session.user.email)
    : await getCombinedMovies(locale);

  return { movies };
};
