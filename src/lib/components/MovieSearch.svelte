<script lang="ts">
  import { page } from '$app/state';
  import { resolveLocale, t } from '$lib/i18n';

  const locale = $derived(resolveLocale(page.params.lang));
  const isSignedIn = $derived(!!(page.data.session as { user?: unknown } | null)?.user);

  type SearchResult = {
    tmdb_id: number;
    title: string;
    year: number;
    overview?: string;
    poster?: string;
  };

  let q = $state('');
  let results = $state<SearchResult[]>([]);
  let loading = $state(false);
  let marks = $state<Record<number, 'watched' | 'queue' | 'best' | 'error' | 'pending'>>({});

  let timer: ReturnType<typeof setTimeout> | null = null;

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
    } catch {
      marks = { ...marks, [r.tmdb_id]: 'error' };
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
    <ul class="mt-6 grid gap-6">
      {#each results as r}
        {@const state = marks[r.tmdb_id]}
        <li class="flex items-start gap-3">
          {#if r.poster}
            <img
              src={r.poster}
              alt=""
              loading="lazy"
              class="block w-16 h-auto border border-mute"
            />
          {/if}
          <div class="flex-1 leading-tight">
            <p class="font-serif-bold">{r.title}</p>
            {#if r.year}
              <p class="text-sm font-serif-light">{r.year}</p>
            {/if}
            {#if r.overview}
              <p class="mt-1 text-sm font-serif-light line-clamp-2">{r.overview}</p>
            {/if}
            <div class="mt-2 flex gap-3 text-xs uppercase">
              {#if state === 'watched' || state === 'queue' || state === 'best'}
                <span class="font-serif-light">✓ {t(locale, 'search.added')}</span>
              {:else if state === 'pending'}
                <span class="font-serif-light">…</span>
              {:else if state === 'error'}
                <span class="font-serif-light">{t(locale, 'search.error')}</span>
              {:else if !isSignedIn}
                <span class="font-serif-italic normal-case text-mute"
                  >{t(locale, 'auth.required')}</span
                >
              {:else}
                <button
                  type="button"
                  class="font-serif-light no-underline hover:underline"
                  onclick={() => mark(r, 'watched')}
                >
                  {t(locale, 'search.mark.watched')}
                </button>
                <button
                  type="button"
                  class="font-serif-light no-underline hover:underline"
                  onclick={() => mark(r, 'queue')}
                >
                  {t(locale, 'search.mark.queue')}
                </button>
                <button
                  type="button"
                  class="font-serif-light no-underline hover:underline"
                  onclick={() => mark(r, 'best')}
                >
                  {t(locale, 'search.mark.best')}
                </button>
              {/if}
            </div>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</section>
