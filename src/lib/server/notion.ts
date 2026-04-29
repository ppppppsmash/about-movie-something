import { env } from '$env/dynamic/private';
import { movies as seed, type Movie, type Rating } from '$lib/data/movies';
import { enrichMovies } from './tmdb';
import type { Locale } from '$lib/i18n';

const NOTION_API = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

async function notionFetch(path: string, init: RequestInit = {}): Promise<Response> {
  return fetch(`${NOTION_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${env.NOTION_API_KEY ?? ''}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
      ...(init.headers ?? {})
    }
  });
}

/** A movie row stored in Notion (subset of Movie — TMDB fills in the rest). */
export type NotionMovie = {
  page_id: string;
  tmdb_id: number;
  status: 'watched' | 'queue';
  best?: boolean;
  watched_on?: string;
  rating?: Rating;
  owner?: string;
};

/** Fetch movie rows from Notion, optionally filtered by owner email. */
export async function getNotionMovies(owner?: string): Promise<NotionMovie[]> {
  if (!env.NOTION_API_KEY || !env.NOTION_DATABASE_ID) return [];

  try {
    const results: NotionMovie[] = [];
    let cursor: string | undefined = undefined;

    do {
      const body: Record<string, unknown> = { page_size: 100 };
      if (cursor) body.start_cursor = cursor;
      if (owner) {
        body.filter = { property: 'owner', email: { equals: owner } };
      }

      const res = await notionFetch(`/databases/${env.NOTION_DATABASE_ID}/query`, {
        method: 'POST',
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        console.warn(`[notion] query failed: ${res.status} ${res.statusText}`);
        return results;
      }
      const data = (await res.json()) as {
        results: unknown[];
        has_more: boolean;
        next_cursor: string | null;
      };
      for (const page of data.results) {
        const m = parseNotionPage(page);
        if (m) results.push(m);
      }
      cursor = data.has_more ? (data.next_cursor ?? undefined) : undefined;
    } while (cursor);

    return results;
  } catch (err) {
    console.warn('[notion] query failed —', err);
    return [];
  }
}

export type AddResult = { ok: true; page_id: string } | { ok: false; error: string };

/** Insert a new movie row into Notion. The current user's email is required as `owner`. */
export async function addNotionMovie(m: {
  tmdb_id: number;
  title: string;
  status: 'watched' | 'queue';
  owner: string;
  best?: boolean;
  watched_on?: string;
  rating?: Rating;
}): Promise<AddResult> {
  if (!env.NOTION_API_KEY) return { ok: false, error: 'NOTION_API_KEY is not set' };
  if (!env.NOTION_DATABASE_ID) return { ok: false, error: 'NOTION_DATABASE_ID is not set' };

  const properties: Record<string, unknown> = {
    Name: { title: [{ text: { content: m.title } }] },
    tmdb_id: { number: m.tmdb_id },
    status: { select: { name: m.status } },
    owner: { email: m.owner }
  };
  if (m.best !== undefined) properties.best = { checkbox: m.best };
  if (m.watched_on) properties.watched_on = { date: { start: m.watched_on } };
  if (m.rating) properties.rating = { number: m.rating };

  try {
    const res = await notionFetch('/pages', {
      method: 'POST',
      body: JSON.stringify({
        parent: { database_id: env.NOTION_DATABASE_ID },
        properties
      })
    });
    if (!res.ok) {
      const text = await res.text();
      console.warn(`[notion] create failed: ${res.status} — ${text}`);
      return { ok: false, error: `Notion ${res.status}: ${text}` };
    }
    const data = (await res.json()) as { id: string };
    return { ok: true, page_id: data.id };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn('[notion] create failed —', err);
    return { ok: false, error: msg };
  }
}

/** Patch an existing Notion page. Verifies ownership against the supplied email first. */
export async function updateNotionMovie(
  page_id: string,
  fields: { status?: 'watched' | 'queue'; best?: boolean; rating?: Rating; watched_on?: string },
  requiredOwner: string
): Promise<AddResult> {
  if (!env.NOTION_API_KEY) return { ok: false, error: 'NOTION_API_KEY is not set' };

  // Verify ownership before mutating.
  try {
    const res = await notionFetch(`/pages/${page_id}`, { method: 'GET' });
    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: `Notion ${res.status}: ${text}` };
    }
    const data = (await res.json()) as { properties?: Record<string, NotionProperty> };
    const owner = data.properties?.owner?.email ?? null;
    if (owner !== requiredOwner) {
      return { ok: false, error: 'Not allowed: page belongs to a different user' };
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, error: msg };
  }

  const properties: Record<string, unknown> = {};
  if (fields.status) properties.status = { select: { name: fields.status } };
  if (fields.best !== undefined) properties.best = { checkbox: fields.best };
  if (fields.rating !== undefined) properties.rating = { number: fields.rating };
  if (fields.watched_on !== undefined)
    properties.watched_on = fields.watched_on ? { date: { start: fields.watched_on } } : null;

  if (Object.keys(properties).length === 0) {
    return { ok: false, error: 'No editable fields supplied' };
  }

  try {
    const res = await notionFetch(`/pages/${page_id}`, {
      method: 'PATCH',
      body: JSON.stringify({ properties })
    });
    if (!res.ok) {
      const text = await res.text();
      console.warn(`[notion] update failed: ${res.status} — ${text}`);
      return { ok: false, error: `Notion ${res.status}: ${text}` };
    }
    return { ok: true, page_id };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn('[notion] update failed —', err);
    return { ok: false, error: msg };
  }
}

/** Notion (filtered by owner) + movies.ts seed, merged + TMDB-enriched. */
export async function getCombinedMovies(locale: Locale, owner?: string): Promise<Movie[]> {
  const notion = owner ? await getNotionMovies(owner) : [];
  const merged = mergeNotionWithSeed(seed, notion);
  return enrichMovies(merged, locale);
}

/** Merge Notion entries on top of a seed list, deduplicated by tmdb_id. */
export function mergeNotionWithSeed(seed: Movie[], notion: NotionMovie[]): Movie[] {
  const byId = new Map<number, Movie>();

  for (const m of seed) {
    if (m.tmdb_id) byId.set(m.tmdb_id, m);
  }
  for (const n of notion) {
    const base = byId.get(n.tmdb_id);
    byId.set(n.tmdb_id, {
      slug: base?.slug ?? `tmdb-${n.tmdb_id}`,
      title: base?.title ?? '',
      year: base?.year ?? 0,
      director: base?.director ?? '',
      ...base,
      tmdb_id: n.tmdb_id,
      status: n.status,
      best: n.best ?? base?.best,
      watched_on: n.watched_on ?? base?.watched_on,
      rating: n.rating ?? base?.rating,
      notion_page_id: n.page_id
    });
  }

  return [...byId.values()];
}

// ---- Notion API page parser ----

type NotionProperty = {
  type: string;
  number?: number | null;
  select?: { name: string } | null;
  checkbox?: boolean;
  date?: { start: string } | null;
  email?: string | null;
  title?: { plain_text: string }[];
};

type NotionPage = {
  id: string;
  properties: Record<string, NotionProperty>;
};

function parseNotionPage(page: unknown): NotionMovie | null {
  if (!isPage(page)) return null;
  const p = page.properties;

  const tmdb_id = p.tmdb_id?.number ?? undefined;
  if (!tmdb_id) return null;

  const status = p.status?.select?.name;
  if (status !== 'watched' && status !== 'queue') return null;

  return {
    page_id: page.id,
    tmdb_id,
    status,
    best: p.best?.checkbox ?? undefined,
    watched_on: p.watched_on?.date?.start ?? undefined,
    rating: clampRating(p.rating?.number),
    owner: p.owner?.email ?? undefined
  };
}

function isPage(v: unknown): v is NotionPage {
  return (
    typeof v === 'object' &&
    v !== null &&
    'id' in v &&
    typeof (v as { id: unknown }).id === 'string' &&
    'properties' in v
  );
}

function clampRating(n: number | null | undefined): Rating | undefined {
  if (n == null) return undefined;
  const r = Math.round(n);
  if (r >= 1 && r <= 5) return r as Rating;
  return undefined;
}
