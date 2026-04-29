import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  // Expose the Auth.js session to every page via $page.data.session.
  return { session: await locals.auth() };
};
