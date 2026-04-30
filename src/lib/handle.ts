/** URL-safe handle for a user, derived from the local-part of their email. */
export function handleFor(email: string): string {
  return email.split('@')[0]!.toLowerCase();
}

/** Resolve a `/u/[handle]` segment back to an owner email by scanning known owners.
 *  Returns the first match (handles collide rarely; later we can add a profile DB). */
export function emailFromHandle(handle: string, owners: string[]): string | undefined {
  const h = handle.toLowerCase();
  return owners.find((e) => handleFor(e) === h);
}
