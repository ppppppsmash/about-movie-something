/** Optional `[[lang=lang]]` matcher: allows only `en` (Japanese is the default = no prefix). */
export function match(param: string): boolean {
  return param === 'en';
}
