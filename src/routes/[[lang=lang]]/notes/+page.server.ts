import { getCombinedMovies } from '$lib/server/notion';
import { resolveLocale } from '$lib/i18n';
import type { PageServerLoad } from './$types';

export const prerender = false;

export const load: PageServerLoad = async ({ params, locals, depends }) => {
  depends('app:movies');
  const session = await locals.auth();
  const locale = resolveLocale(params.lang);
  const movies = session?.user?.email
    ? await getCombinedMovies(locale, session.user.email)
    : await getCombinedMovies(locale);
  return { movies };
};
