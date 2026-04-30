import { listPublicOwners } from '$lib/server/notion';
import { handleFor } from '$lib/handle';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.auth();
  if (!session?.user?.email) return { signedIn: false, users: [] };
  const owners = await listPublicOwners();
  const users = owners.map((email) => ({ handle: handleFor(email), email }));
  return { signedIn: true, users };
};
