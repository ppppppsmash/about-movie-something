export type Rating = 1 | 2 | 3 | 4 | 5;

export type Movie = {
  slug: string;
  /** TMDB movie ID — when present and TMDB_API_KEY is set, build-time fetch overrides
      title / year / director with TMDB's data and adds poster / overview / genres. */
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
};

export const movies: Movie[] = [
  { slug: 'rashomon', tmdb_id: 548, title: 'Rashomon', year: 1950, director: 'Akira Kurosawa', status: 'watched', watched_on: '2026-04-05', rating: 5, best: true },
  { slug: 'in-the-mood-for-love', tmdb_id: 843, title: 'In the Mood for Love', year: 2000, director: 'Wong Kar-wai', status: 'watched', watched_on: '2026-03-12', rating: 5, best: true },
  { slug: 'parasite', tmdb_id: 496243, title: 'Parasite', year: 2019, director: 'Bong Joon-ho', status: 'watched', watched_on: '2026-02-20', rating: 5 },
  { slug: 'tokyo-story', tmdb_id: 18148, title: 'Tokyo Story', year: 1953, director: 'Yasujirō Ozu', status: 'watched', watched_on: '2025-12-08', rating: 5, best: true },
  { slug: 'la-la-land', tmdb_id: 313369, title: 'La La Land', year: 2016, director: 'Damien Chazelle', status: 'watched', watched_on: '2025-09-15', rating: 4 },
  { slug: 'mulholland-drive', tmdb_id: 1018, title: 'Mulholland Drive', year: 2001, director: 'David Lynch', status: 'watched', watched_on: '2025-06-22', rating: 5, best: true },
  { slug: 'past-lives', tmdb_id: 614934, title: 'Past Lives', year: 2023, director: 'Celine Song', status: 'watched', watched_on: '2024-11-30', rating: 4 },
  { slug: 'the-zone-of-interest', tmdb_id: 467244, title: 'The Zone of Interest', year: 2023, director: 'Jonathan Glazer', status: 'queue' },
  { slug: 'perfect-days', tmdb_id: 1186532, title: 'Perfect Days', year: 2023, director: 'Wim Wenders', status: 'queue' },
  { slug: 'anora', tmdb_id: 1064213, title: 'Anora', year: 2024, director: 'Sean Baker', status: 'queue' }
];

const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V'] as const;
export const roman = (n: Rating | undefined): string => (n ? ROMAN[n] : '');
