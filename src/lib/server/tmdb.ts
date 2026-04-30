import { env } from '$env/dynamic/private';
import { movies as raw, type Movie } from '$lib/data/movies';
import type { Locale } from '$lib/i18n';

const API_BASE = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/w342';
const PROFILE_BASE = 'https://image.tmdb.org/t/p/w185';

/** Enrich an arbitrary list of movies with TMDB metadata for the given locale.
 *  No caching — caller should cache if needed. Falls back to input if API key missing. */
export async function enrichMovies(movies: Movie[], locale: Locale): Promise<Movie[]> {
  const key = env.TMDB_API_KEY;
  if (!key) {
    console.warn('[tmdb] TMDB_API_KEY not set — skipping enrichment.');
    return movies;
  }
  const language = locale === 'ja' ? 'ja-JP' : 'en-US';
  return Promise.all(movies.map((m) => enrichOne(m, key, language)));
}

const seedCache: Record<Locale, Movie[] | null> = { en: null, ja: null };

/** Returns the seed movie list (movies.ts) with TMDB enrichment, memoized per-locale. */
export async function getMovies(locale: Locale = 'en'): Promise<Movie[]> {
  if (seedCache[locale]) return seedCache[locale]!;
  seedCache[locale] = await enrichMovies(raw, locale);
  return seedCache[locale]!;
}

type TmdbCrewMember = { job: string; name: string };
type TmdbCastMember = { name: string; character: string; profile_path?: string | null };
type TmdbGenre = { id: number; name: string };
type TmdbSimilarMovie = {
  id: number;
  title: string;
  release_date?: string;
  poster_path?: string | null;
};
type TmdbVideo = {
  key: string;
  site: string;
  type: string;
  official?: boolean;
  published_at?: string;
};

/** Pick the earliest published YouTube "Trailer" from a TMDB videos result list. */
function pickOldestTrailer(videos: TmdbVideo[]): { site: 'YouTube'; key: string } | undefined {
  const trailers = videos
    .filter((v) => v.site === 'YouTube' && v.type === 'Trailer')
    .sort((a, b) => (a.published_at ?? '').localeCompare(b.published_at ?? ''));
  if (trailers.length === 0) return undefined;
  return { site: 'YouTube', key: trailers[0].key };
}

async function enrichOne(m: Movie, key: string, language: string): Promise<Movie> {
  if (!m.tmdb_id) return m;

  try {
    const url = `${API_BASE}/movie/${m.tmdb_id}?append_to_response=credits,similar,videos&language=${language}&api_key=${key}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`[tmdb] ${m.slug} (${language}): ${res.status} ${res.statusText}`);
      return m;
    }
    const data = await res.json();

    const director = data.credits?.crew?.find((p: TmdbCrewMember) => p.job === 'Director')?.name;
    const cast = (data.credits?.cast ?? []).slice(0, 8).map((c: TmdbCastMember) => ({
      name: c.name,
      character: c.character,
      profile: c.profile_path ? `${PROFILE_BASE}${c.profile_path}` : undefined
    }));
    const similar = (data.similar?.results ?? []).slice(0, 6).map((s: TmdbSimilarMovie) => ({
      id: s.id,
      title: s.title,
      year: s.release_date ? Number(s.release_date.slice(0, 4)) : 0,
      poster: s.poster_path ? `${IMG_BASE}${s.poster_path}` : undefined
    }));

    let trailer = pickOldestTrailer((data.videos?.results ?? []) as TmdbVideo[]);
    // ja-JP often returns zero videos — fall back to en-US for trailer discovery.
    if (!trailer && language === 'ja-JP') {
      try {
        const fbRes = await fetch(
          `${API_BASE}/movie/${m.tmdb_id}/videos?language=en-US&api_key=${key}`
        );
        if (fbRes.ok) {
          const fb = (await fbRes.json()) as { results?: TmdbVideo[] };
          trailer = pickOldestTrailer(fb.results ?? []);
        }
      } catch {
        // best-effort; trailer stays undefined
      }
    }

    return {
      ...m,
      title: data.title || m.title,
      year: data.release_date ? Number(data.release_date.slice(0, 4)) : m.year,
      director: director || m.director,
      poster: data.poster_path ? `${IMG_BASE}${data.poster_path}` : undefined,
      overview: data.overview || undefined,
      genres: data.genres?.map((g: TmdbGenre) => g.name) ?? [],
      tagline: data.tagline || undefined,
      runtime: data.runtime || undefined,
      original_title: data.original_title || undefined,
      cast,
      similar,
      trailer
    };
  } catch (err) {
    console.warn(`[tmdb] ${m.slug} (${language}): fetch failed —`, err);
    return m;
  }
}

// ─── Daily picks (random selection from a top-rated pool) ────────────────

export type PickedMovie = {
  id: number;
  title: string;
  year: number;
  overview?: string;
  poster?: string;
};

type TmdbListResult = {
  id: number;
  title?: string;
  original_title?: string;
  overview?: string;
  release_date?: string;
  poster_path?: string | null;
};

const dailyCache: Record<Locale, { date: string; picks: PickedMovie[] } | null> = {
  en: null,
  ja: null
};

/** JST (UTC+9) date as YYYY-MM-DD — picks roll over at JST midnight. */
function jstDateKey(): string {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

/** Fetches a top-rated pool from TMDB and returns `count` movies, deterministically
 *  shuffled by today's JST date (YYYY-MM-DD). Cached per-process until the date rolls over. */
export async function getDailyPicks(
  locale: Locale = 'ja',
  count = 5
): Promise<PickedMovie[]> {
  const today = jstDateKey();
  const cached = dailyCache[locale];
  if (cached && cached.date === today) return cached.picks.slice(0, count);

  const key = env.TMDB_API_KEY;
  if (!key) {
    dailyCache[locale] = { date: today, picks: [] };
    return [];
  }

  const language = locale === 'ja' ? 'ja-JP' : 'en-US';
  const pool: PickedMovie[] = [];

  try {
    // Pool = top_rated pages 1–5 (≈ 100 movies)
    const pages = await Promise.all(
      [1, 2, 3, 4, 5].map((page) =>
        fetch(`${API_BASE}/movie/top_rated?language=${language}&page=${page}&api_key=${key}`).then(
          (res) => (res.ok ? res.json() : { results: [] })
        )
      )
    );
    for (const data of pages) {
      for (const m of (data.results ?? []) as TmdbListResult[]) {
        pool.push({
          id: m.id,
          title: m.title || m.original_title || '',
          year: m.release_date ? Number(m.release_date.slice(0, 4)) : 0,
          overview: m.overview || undefined,
          poster: m.poster_path ? `${IMG_BASE}${m.poster_path}` : undefined
        });
      }
    }
  } catch (err) {
    console.warn(`[tmdb] top_rated (${language}): fetch failed —`, err);
    dailyCache[locale] = { date: today, picks: [] };
    return [];
  }

  const picks = pickRandom(pool, count, today);
  dailyCache[locale] = { date: today, picks };
  return picks;
}

function pickRandom<T>(pool: T[], count: number, seed: string): T[] {
  if (pool.length <= count) return pool.slice();
  const rng = seededRandom(seed);
  const seen = new Set<number>();
  const out: T[] = [];
  while (out.length < count) {
    const i = Math.floor(rng() * pool.length);
    if (!seen.has(i)) {
      seen.add(i);
      out.push(pool[i]);
    }
  }
  return out;
}

/** Tiny deterministic LCG seeded from a string. */
function seededRandom(seed: string): () => number {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) | 0;
  return () => {
    h = (Math.imul(h, 1103515245) + 12345) | 0;
    return (h >>> 0) / 0x100000000;
  };
}

// ─── TMDB search (server-side proxy for /api/search) ─────────────────────

export type SearchResult = {
  tmdb_id: number;
  title: string;
  year: number;
  overview?: string;
  poster?: string;
};

/** Search TMDB by query string, returns up to `count` matching movies. */
export async function searchMovies(
  query: string,
  locale: Locale = 'ja',
  count = 20
): Promise<SearchResult[]> {
  const key = env.TMDB_API_KEY;
  if (!key || !query.trim()) return [];

  const language = locale === 'ja' ? 'ja-JP' : 'en-US';
  try {
    const url = `${API_BASE}/search/movie?query=${encodeURIComponent(query)}&language=${language}&api_key=${key}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results ?? []).slice(0, count).map((m: TmdbListResult) => ({
      tmdb_id: m.id,
      title: m.title || m.original_title || '',
      year: m.release_date ? Number(m.release_date.slice(0, 4)) : 0,
      overview: m.overview || undefined,
      poster: m.poster_path ? `${IMG_BASE}${m.poster_path}` : undefined
    }));
  } catch (err) {
    console.warn('[tmdb] search failed —', err);
    return [];
  }
}
