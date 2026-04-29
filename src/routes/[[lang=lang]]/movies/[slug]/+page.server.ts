import { error } from '@sveltejs/kit';
import { getCombinedMovies } from '$lib/server/notion';
import { resolveLocale } from '$lib/i18n';
import type { PageServerLoad } from './$types';

// /movies/[slug] is dynamic (combined data from Notion + seed), so no prerender.
export const prerender = false;

export const load: PageServerLoad = async ({ params, locals }) => {
  const session = await locals.auth();
  const locale = resolveLocale(params.lang);
  const movies = session?.user?.email
    ? await getCombinedMovies(locale, session.user.email)
    : await getCombinedMovies(locale);
  const movie = movies.find((m) => m.slug === params.slug);
  if (!movie) error(404, 'Movie not found');
  return { movie };
};
