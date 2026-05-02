<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { resolveLocale, localePath, t } from '$lib/i18n';
  import { toast } from '$lib/stores/toast.svelte';

  const locale = $derived(resolveLocale(page.params.lang));
  const isSignedIn = $derived(!!(page.data.session as { user?: unknown } | null)?.user);

  type SearchResult = {
    tmdb_id: number;
    title: string;
    year: number;
    overview?: string;
    poster?: string;
  };

  const STORAGE_KEY = 'movieSearch:q';
  let q = $state('');
  let results = $state<SearchResult[]>([]);
  let loading = $state(false);
  let marks = $state<Record<number, 'watched' | 'queue' | 'best' | 'error' | 'pending'>>({});

  let timer: ReturnType<typeof setTimeout> | null = null;

  // Restore previous query on mount; the existing $effect repopulates results.
  onMount(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) q = saved;
  });

  $effect(() => {
    sessionStorage.setItem(STORAGE_KEY, q);
  });

  function runSearch(query: string) {
    if (timer) clearTimeout(timer);
    if (!query.trim()) {
      results = [];
      return;
    }
    timer = setTimeout(async () => {
      loading = true;
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&lang=${locale}`);
        const data = await res.json();
        results = data.results ?? [];
      } finally {
        loading = false;
      }
    }, 250);
  }

  $effect(() => {
    runSearch(q);
  });

  async function mark(r: SearchResult, action: 'watched' | 'queue' | 'best') {
    marks = { ...marks, [r.tmdb_id]: 'pending' };
    try {
      const body =
        action === 'best'
          ? { tmdb_id: r.tmdb_id, title: r.title, status: 'watched', best: true }
          : { tmdb_id: r.tmdb_id, title: r.title, status: action };
      const res = await fetch('/api/movies', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        const msg = errBody.message || (await res.text().catch(() => '')) || String(res.status);
        console.error('[search] mark failed:', msg);
        throw new Error(msg);
      }
      marks = { ...marks, [r.tmdb_id]: action };
      toast.show(`${r.title} · ${t(locale, 'search.added')}`);
    } catch {
      marks = { ...marks, [r.tmdb_id]: 'error' };
      toast.show(t(locale, 'search.error'), 'error');
    }
  }
</script>

<section>
  <input
    type="search"
    bind:value={q}
    placeholder={t(locale, 'search.placeholder')}
    class="w-full px-3 py-2 bg-transparent border-b border-mute font-serif-light text-base placeholder:text-sm transition-all duration-300 ease-elastic focus:outline-none focus:border-ink focus:scale-[1.03] focus:tracking-wider"
  />

  {#if loading}
    <p class="mt-4 text-center text-sm font-serif-italic">…</p>
  {:else if q && results.length === 0}
    <p class="mt-4 text-center text-sm font-serif-italic">{t(locale, 'search.empty')}</p>
  {:else if results.length > 0}
    <ul
      class="results-scroll mt-6 grid gap-6 min-[500px]:max-h-[60vh] min-[500px]:overflow-y-auto min-[500px]:pr-2"
    >
      {#each results as r}
        {@const state = marks[r.tmdb_id]}
        <li>
          <a
            href={localePath(locale, `/movies/movie-${r.tmdb_id}`)}
            class="flex items-start gap-3 no-underline group"
          >
            {#if r.poster}
              <img
                src={r.poster}
                alt=""
                loading="lazy"
                class="block w-16 h-auto border border-mute grayscale group-hover:grayscale-0 transition-[filter] duration-150"
              />
            {/if}
            <div class="flex-1 leading-tight">
              <p
                class="font-serif-bold group-hover:underline group-hover:decoration-wavy group-hover:underline-offset-[3px]"
              >
                {r.title}
              </p>
              {#if r.year}
                <p class="text-sm font-serif-light">{r.year}</p>
              {/if}
              {#if r.overview}
                <p class="mt-1 text-sm font-serif-light line-clamp-2">{r.overview}</p>
              {/if}
            </div>
          </a>
          <div class="mt-2 flex gap-3 text-xs uppercase pl-[calc(4rem+0.75rem)]">
            {#if state === 'watched' || state === 'queue' || state === 'best'}
              <span class="font-serif-light">✓ {t(locale, 'search.added')}</span>
            {:else if state === 'pending'}
              <span class="font-serif-light">…</span>
            {:else if !isSignedIn}
              <span class="font-serif-italic normal-case text-mute"
                >{t(locale, 'auth.required')}</span
              >
            {:else}
              <button
                type="button"
                class="font-serif-light no-underline hover:underline hover:decoration-wavy hover:underline-offset-[3px]"
                onclick={() => mark(r, 'watched')}
              >
                {t(locale, 'search.mark.watched')}
              </button>
              <button
                type="button"
                class="font-serif-light no-underline hover:underline hover:decoration-wavy hover:underline-offset-[3px]"
                onclick={() => mark(r, 'queue')}
              >
                {t(locale, 'search.mark.queue')}
              </button>
              <button
                type="button"
                class="font-serif-light no-underline hover:underline hover:decoration-wavy hover:underline-offset-[3px]"
                onclick={() => mark(r, 'best')}
              >
                {t(locale, 'search.mark.best')}
              </button>
            {/if}
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</section>

<style>
  /* Match scrollbar to the literary palette: thin track, ink-toned thumb that
     darkens on hover. Falls back to Firefox's `scrollbar-color` syntax. */
  .results-scroll {
    scrollbar-width: thin;
    scrollbar-color: var(--color-mute) transparent;
  }
  .results-scroll::-webkit-scrollbar {
    width: 6px;
  }
  .results-scroll::-webkit-scrollbar-track {
    background: transparent;
  }
  .results-scroll::-webkit-scrollbar-thumb {
    background: var(--color-mute);
    border-radius: 0;
  }
  .results-scroll::-webkit-scrollbar-thumb:hover {
    background: var(--color-ink);
  }
</style>
