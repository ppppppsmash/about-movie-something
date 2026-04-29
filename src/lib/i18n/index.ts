import en from './en.json';
import ja from './ja.json';

export type Locale = 'en' | 'ja';
export const locales: Locale[] = ['ja', 'en'];
export const defaultLocale: Locale = 'ja';

const dicts = { en, ja } as const;

export type TranslationKey = keyof typeof en;

/** Look up a translation by key, falling back to the default-locale copy then the key itself. */
export function t(locale: Locale, key: TranslationKey): string {
  return dicts[locale][key] ?? dicts[defaultLocale][key] ?? key;
}

/** Resolve the URL `lang` param into a `Locale`. Undefined / unknown → default (ja). */
export function resolveLocale(lang: string | undefined): Locale {
  return lang === 'en' ? 'en' : 'ja';
}

/** Build a locale-prefixed path. Japanese (default) keeps the path as-is; English prefixes `/en`. */
export function localePath(locale: Locale, path: string): string {
  if (locale === 'ja') return path;
  if (path === '/') return '/en';
  return `/en${path}`;
}
