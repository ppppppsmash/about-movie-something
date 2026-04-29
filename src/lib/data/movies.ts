export type Rating = 1 | 2 | 3 | 4 | 5;

export type Movie = {
  slug: string;
  title: string;
  year: number;
  director: string;
  status: 'watched' | 'queue';
  best?: boolean;
  watched_on?: string; // ISO date (YYYY-MM-DD)
  rating?: Rating;
};

export const movies: Movie[] = [
  { slug: 'rashomon', title: 'Rashomon', year: 1950, director: 'Akira Kurosawa', status: 'watched', watched_on: '2026-04-05', rating: 5, best: true },
  { slug: 'in-the-mood-for-love', title: 'In the Mood for Love', year: 2000, director: 'Wong Kar-wai', status: 'watched', watched_on: '2026-03-12', rating: 5, best: true },
  { slug: 'parasite', title: 'Parasite', year: 2019, director: 'Bong Joon-ho', status: 'watched', watched_on: '2026-02-20', rating: 5 },
  { slug: 'tokyo-story', title: 'Tokyo Story', year: 1953, director: 'Yasujirō Ozu', status: 'watched', watched_on: '2025-12-08', rating: 5, best: true },
  { slug: 'la-la-land', title: 'La La Land', year: 2016, director: 'Damien Chazelle', status: 'watched', watched_on: '2025-09-15', rating: 4 },
  { slug: 'mulholland-drive', title: 'Mulholland Drive', year: 2001, director: 'David Lynch', status: 'watched', watched_on: '2025-06-22', rating: 5, best: true },
  { slug: 'past-lives', title: 'Past Lives', year: 2023, director: 'Celine Song', status: 'watched', watched_on: '2024-11-30', rating: 4 },
  { slug: 'the-zone-of-interest', title: 'The Zone of Interest', year: 2023, director: 'Jonathan Glazer', status: 'queue' },
  { slug: 'perfect-days', title: 'Perfect Days', year: 2023, director: 'Wim Wenders', status: 'queue' },
  { slug: 'anora', title: 'Anora', year: 2024, director: 'Sean Baker', status: 'queue' }
];

const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V'] as const;
export const roman = (n: Rating | undefined): string => (n ? ROMAN[n] : '');
