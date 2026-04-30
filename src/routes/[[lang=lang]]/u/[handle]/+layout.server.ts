import { error } from '@sveltejs/kit';
import { getOwnerVisibleMovies, listPublicOwners } from '$lib/server/notion';
import { emailFromHandle, handleFor } from '$lib/handle';
import { resolveLocale } from '$lib/i18n';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params, locals }) => {
  const session = await locals.auth();
  if (!session?.user?.email) return { signedIn: false, handle: params.handle, movies: [] };

  const locale = resolveLocale(params.lang);
  const viewerEmail = session.user.email;
  const viewerHandle = handleFor(viewerEmail);

  // Viewer's own profile is always reachable; others must appear in `listPublicOwners`.
  const ownerEmail =
    params.handle === viewerHandle
      ? viewerEmail
      : emailFromHandle(params.handle, await listPublicOwners());
  if (!ownerEmail) error(404, 'User not found');

  const movies = await getOwnerVisibleMovies(locale, viewerEmail, ownerEmail);
  return {
    signedIn: true,
    handle: params.handle,
    isOwn: ownerEmail === viewerEmail,
    movies
  };
};
