import { error } from '@sveltejs/kit';
import { getCombinedMovies, getVisibleMovies } from '$lib/server/notion';
import { enrichMovies } from '$lib/server/tmdb';
import { resolveLocale } from '$lib/i18n';
import type { Movie } from '$lib/data/movies';
import type { PageServerLoad } from './$types';

// /movies/[slug] is dynamic (combined data from Notion + seed), so no prerender.
export const prerender = false;

export const load: PageServerLoad = async ({ params, locals }) => {
  const session = await locals.auth();
  const locale = resolveLocale(params.lang);
  const movies = session?.user?.email
    ? await getVisibleMovies(locale, session.user.email)
    : await getCombinedMovies(locale);
  let movie = movies.find((m) => m.slug === params.slug);

  // Fallback: search results link to `/movies/movie-<id>` for films not yet in any
  // user's library — enrich a stub directly from TMDB so the detail page still renders.
  if (!movie) {
    const m = params.slug.match(/^movie-(\d+)$/);
    if (m) {
      const stub: Movie = {
        slug: params.slug,
        tmdb_id: Number(m[1]),
        title: '',
        year: 0,
        director: '',
        status: 'watched'
      };
      const [enriched] = await enrichMovies([stub], locale);
      if (enriched?.title) movie = enriched;
    }
  }

  if (!movie) error(404, 'Movie not found');
  return { movie };
};
