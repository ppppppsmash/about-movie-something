import { json, error } from '@sveltejs/kit';
import { updateNotionMovie } from '$lib/server/notion';
import type { RequestHandler } from './$types';

export const prerender = false;

type PatchBody = {
  status?: 'watched' | 'queue';
  best?: boolean;
  rating?: 1 | 2 | 3 | 4 | 5;
  watched_on?: string;
  note?: string;
  public?: boolean;
};

/** PATCH /api/movies/[id] — update a Notion page. Only the page's owner may edit. */
export const PATCH: RequestHandler = async ({ params, request, locals }) => {
  const session = await locals.auth();
  if (!session?.user?.email) error(401, 'Sign in required');

  let body: PatchBody;
  try {
    body = await request.json();
  } catch {
    error(400, 'Invalid JSON body');
  }

  const result = await updateNotionMovie(params.id, body, session.user.email);
  if (!result.ok) error(result.error.startsWith('Not allowed') ? 403 : 500, result.error);

  return json({ ok: true });
};
