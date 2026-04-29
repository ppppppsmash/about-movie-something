export type Rating = 1 | 2 | 3 | 4 | 5;

export type CastMember = { name: string; character: string; profile?: string };

export type SimilarMovie = {
  id: number;
  title: string;
  year: number;
  poster?: string;
};

export type Movie = {
  slug: string;
  /** TMDB movie ID — when present and TMDB_API_KEY is set, build-time fetch overrides
      title / year / director with TMDB's data and adds poster / overview / genres / etc. */
  tmdb_id?: number;
  title: string;
  year: number;
  director: string;
  status: 'watched' | 'queue';
  best?: boolean;
  watched_on?: string; // ISO date (YYYY-MM-DD)
  rating?: Rating;
  // ----- Filled by src/lib/server/tmdb.ts at build time (do not hand-edit): -----
  poster?: string;
  overview?: string;
  genres?: string[];
  tagline?: string;
  runtime?: number;
  original_title?: string;
  cast?: CastMember[];
  similar?: SimilarMovie[];
};

/** Seed movies — kept empty now that Notion is the source of truth.
 *  Add hand-curated entries here only if you want them to appear regardless of Notion state. */
export const movies: Movie[] = [];

const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V'] as const;
export const roman = (n: Rating | undefined): string => (n ? ROMAN[n] : '');
