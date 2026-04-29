<script lang="ts">
  import { page } from '$app/state';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { resolveLocale, t } from '$lib/i18n';

  const locale = $derived(resolveLocale(page.params.lang));

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
  let marks = $state<Record<number, 'watched' | 'queue' | 'error' | 'pending'>>({});

  let timer: ReturnType<typeof setTimeout> | null = null;

  function search(query: string) {
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
    search(q);
  });

  async function mark(r: SearchResult, status: 'watched' | 'queue') {
    marks = { ...marks, [r.tmdb_id]: 'pending' };
    try {
      const res = await fetch('/api/movies', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          tmdb_id: r.tmdb_id,
          title: r.title,
          status
        })
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        const msg = errBody.message || (await res.text().catch(() => '')) || String(res.status);
        console.error('[search] mark failed:', msg);
        throw new Error(msg);
      }
      marks = { ...marks, [r.tmdb_id]: status };
    } catch {
      marks = { ...marks, [r.tmdb_id]: 'error' };
    }
  }
</script>

<svelte:head>
  <title>Search — Movie Log</title>
</svelte:head>

<PageHeader chapter="II" title={t(locale, 'header.search')} />

<main id="content">
  <p class="mb-8 text-center text-sm font-serif-italic">{t(locale, 'search.intro')}</p>

  <input
    type="search"
    bind:value={q}
    placeholder={t(locale, 'search.placeholder')}
    class="w-full mb-8 px-3 py-2 bg-transparent border-b border-mute font-serif-light text-base focus:outline-none focus:border-ink"
  />

  {#if loading}
    <p class="text-center text-sm font-serif-italic">…</p>
  {:else if q && results.length === 0}
    <p class="text-center text-sm font-serif-italic">{t(locale, 'search.empty')}</p>
  {:else}
    <ul class="grid gap-6">
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
              {#if state === 'watched' || state === 'queue'}
                <span class="font-serif-light">✓ {t(locale, 'search.added')}</span>
              {:else if state === 'pending'}
                <span class="font-serif-light">…</span>
              {:else if state === 'error'}
                <span class="font-serif-light">{t(locale, 'search.error')}</span>
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
              {/if}
            </div>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</main>

<Footer />
