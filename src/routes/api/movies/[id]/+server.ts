import { json, error } from '@sveltejs/kit';
import { updateNotionMovie } from '$lib/server/notion';
import type { RequestHandler } from './$types';

export const prerender = false;

type PatchBody = {
  status?: 'watched' | 'queue';
  best?: boolean;
  rating?: 1 | 2 | 3 | 4 | 5;
  watched_on?: string;
};

/** PATCH /api/movies/[id] — update Notion page properties (toggle best, change status, etc.). */
export const PATCH: RequestHandler = async ({ params, request }) => {
  let body: PatchBody;
  try {
    body = await request.json();
  } catch {
    error(400, 'Invalid JSON body');
  }

  const result = await updateNotionMovie(params.id, body);
  if (!result.ok) error(500, result.error);

  return json({ ok: true });
};
