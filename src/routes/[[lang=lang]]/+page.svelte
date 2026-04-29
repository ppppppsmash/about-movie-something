<script lang="ts">
  import { page } from '$app/state';
  import Header from '$lib/components/Header.svelte';
  import MainNav from '$lib/components/MainNav.svelte';
  import ModeToggle from '$lib/components/ModeToggle.svelte';
  import LocaleToggle from '$lib/components/LocaleToggle.svelte';
  import { resolveLocale, localePath, t } from '$lib/i18n';

  const locale = $derived(resolveLocale(page.params.lang));
  const homeHref = $derived(localePath(locale, '/'));

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

<div class="min-h-[calc(100dvh_-_var(--content-padding)_*_2_-_3rem)] grid content-center">
  <Header />
  <main id="content">
    <input
      type="search"
      bind:value={q}
      placeholder={t(locale, 'search.placeholder')}
      class="w-full mt-12 px-3 py-2 bg-transparent border-b border-mute font-serif-light text-base transition-all duration-300 ease-elastic focus:outline-none focus:border-ink focus:scale-[1.03] focus:tracking-wider"
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

    <MainNav transitionName />
    <!-- <small class="block mt-12 font-serif-bold text-center">
      <a href={homeHref} class="no-underline hover:underline">№ XLII</a>
    </small> -->
    <ModeToggle />
    <LocaleToggle />
  </main>
</div>
