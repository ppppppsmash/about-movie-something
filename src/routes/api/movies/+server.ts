import { json, error } from '@sveltejs/kit';
import { addNotionMovie } from '$lib/server/notion';
import type { RequestHandler } from './$types';

export const prerender = false;

type AddMovieBody = {
  tmdb_id: number;
  title: string;
  status: 'watched' | 'queue';
  best?: boolean;
  watched_on?: string;
  rating?: 1 | 2 | 3 | 4 | 5;
};

/** POST /api/movies — add a new movie row to Notion (owner = current user's email). */
export const POST: RequestHandler = async ({ request, locals }) => {
  const session = await locals.auth();
  if (!session?.user?.email) error(401, 'Sign in required');

  let body: AddMovieBody;
  try {
    body = await request.json();
  } catch {
    error(400, 'Invalid JSON body');
  }

  if (typeof body.tmdb_id !== 'number' || !body.title) {
    error(400, 'Missing tmdb_id or title');
  }
  if (body.status !== 'watched' && body.status !== 'queue') {
    error(400, "status must be 'watched' or 'queue'");
  }

  const result = await addNotionMovie({ ...body, owner: session.user.email });
  if (!result.ok) error(500, result.error);

  return json({ page_id: result.page_id }, { status: 201 });
};
