import { json } from '@sveltejs/kit';
import { searchMovies } from '$lib/server/tmdb';
import type { RequestHandler } from './$types';
import type { Locale } from '$lib/i18n';

export const prerender = false;

export const GET: RequestHandler = async ({ url }) => {
  const q = url.searchParams.get('q')?.trim() ?? '';
  const lang = url.searchParams.get('lang') === 'en' ? 'en' : 'ja';
  if (!q) return json({ results: [] });
  const results = await searchMovies(q, lang as Locale, 20);
  return json({ results });
};
