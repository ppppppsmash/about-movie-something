import { env } from '$env/dynamic/private';
import { movies as raw, type Movie } from '$lib/data/movies';

const API_BASE = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/w342';

let cache: Movie[] | null = null;

/** Returns the full movie list with TMDB enrichment applied (poster / overview / genres / etc.).
 *  Memoized at module level so each prerendered page only triggers one round of fetches. */
export async function getMovies(): Promise<Movie[]> {
  if (cache) return cache;

  const key = env.TMDB_API_KEY;
  if (!key) {
    console.warn('[tmdb] TMDB_API_KEY not set — skipping enrichment, using raw data.');
    cache = raw;
    return cache;
  }

  cache = await Promise.all(raw.map((m) => enrichOne(m, key)));
  return cache;
}

type TmdbCrewMember = { job: string; name: string };
type TmdbGenre = { id: number; name: string };

async function enrichOne(m: Movie, key: string): Promise<Movie> {
  if (!m.tmdb_id) return m;

  try {
    const url = `${API_BASE}/movie/${m.tmdb_id}?append_to_response=credits&api_key=${key}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`[tmdb] ${m.slug}: ${res.status} ${res.statusText}`);
      return m;
    }
    const data = await res.json();
    const director = data.credits?.crew?.find((p: TmdbCrewMember) => p.job === 'Director')?.name;

    return {
      ...m,
      title: data.title || m.title,
      year: data.release_date ? Number(data.release_date.slice(0, 4)) : m.year,
      director: director || m.director,
      poster: data.poster_path ? `${IMG_BASE}${data.poster_path}` : undefined,
      overview: data.overview || undefined,
      genres: data.genres?.map((g: TmdbGenre) => g.name) ?? []
    };
  } catch (err) {
    console.warn(`[tmdb] ${m.slug}: fetch failed —`, err);
    return m;
  }
}
