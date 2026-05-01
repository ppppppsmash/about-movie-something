<script lang="ts">
  import { invalidate } from '$app/navigation';
  import { page } from '$app/state';
  import { roman } from '$lib/data/movies';
  import { t, resolveLocale, localePath } from '$lib/i18n';
  import NoteEditor from '$lib/components/NoteEditor.svelte';
  import BestToggle from '$lib/components/BestToggle.svelte';

  let { data } = $props();
  const m = $derived(data.movie);
  const locale = $derived(resolveLocale(page.params.lang));
  const isSignedIn = $derived(!!(page.data.session as { user?: unknown } | null)?.user);

  let actionState = $state<'idle' | 'pending' | 'error'>('idle');

  async function add(action: 'watched' | 'queue' | 'best') {
    actionState = 'pending';
    try {
      const body =
        action === 'best'
          ? { tmdb_id: m.tmdb_id, title: m.title, status: 'watched', best: true }
          : { tmdb_id: m.tmdb_id, title: m.title, status: action };
      const res = await fetch('/api/movies', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error(String(res.status));
      await invalidate('app:movies');
      actionState = 'idle';
    } catch {
      actionState = 'error';
    }
  }

  async function changeStatus(next: 'watched' | 'queue') {
    if (!m.notion_page_id) return;
    actionState = 'pending';
    try {
      const res = await fetch(`/api/movies/${m.notion_page_id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status: next })
      });
      if (!res.ok) throw new Error(String(res.status));
      await invalidate('app:movies');
      actionState = 'idle';
    } catch {
      actionState = 'error';
    }
  }
</script>

<svelte:head>
  <title>{m.title} — Movie Log</title>
</svelte:head>

<article class="grid gap-10">
  <!-- Hero: poster + title + meta -->
  <header class="grid gap-4 min-[500px]:grid-cols-[150px_1fr] items-start">
    {#if m.poster}
      <img
        src={m.poster}
        alt=""
        loading="eager"
        class="w-full h-auto block border border-mute"
      />
    {/if}
    <div class="leading-tight">
      <h2 class="font-serif-bold text-md">{m.title}</h2>
      {#if m.original_title && m.original_title !== m.title}
        <p class="mt-1 text-sm font-serif-italic">{m.original_title}</p>
      {/if}
      <p class="mt-3 text-sm font-serif-light">
        {m.director} · {m.year}{#if m.runtime} · {m.runtime} {t(locale, 'meta.runtime_unit')}{/if}
      </p>
      {#if m.genres && m.genres.length}
        <p class="mt-1 text-xs font-serif-light uppercase tracking-wider">
          {m.genres.join(' · ')}
        </p>
      {/if}
      <div class="mt-4 text-sm font-serif-light space-y-1">
        {#if m.rating}
          <p>{t(locale, 'meta.rated')} <span class="font-serif-bold tracking-wider">{roman(m.rating)}</span></p>
        {/if}
        {#if m.watched_on}
          <p>{t(locale, 'meta.watched')} {m.watched_on}</p>
        {/if}
        {#if m.best}
          <p class="text-xs uppercase tracking-wider">{t(locale, 'meta.best_pick')}</p>
        {/if}
      </div>
    </div>
  </header>

  {#if isSignedIn}
    <div class="-mt-6 flex items-center gap-4 text-xs uppercase tracking-wider">
      {#if data.isOwn}
        <span class="font-serif-bold">
          {m.status === 'watched' ? t(locale, 'tab.watched') : t(locale, 'tab.queue')}
        </span>
        {#if m.status === 'queue'}
          <button
            type="button"
            disabled={actionState === 'pending'}
            class="font-serif-light no-underline hover:underline hover:decoration-wavy hover:underline-offset-[3px] disabled:opacity-50"
            onclick={() => changeStatus('watched')}
          >
            {t(locale, 'search.mark.watched')}
          </button>
        {:else}
          <button
            type="button"
            disabled={actionState === 'pending'}
            class="font-serif-light no-underline hover:underline hover:decoration-wavy hover:underline-offset-[3px] disabled:opacity-50"
            onclick={() => changeStatus('queue')}
          >
            {t(locale, 'search.mark.queue')}
          </button>
        {/if}
        <BestToggle movie={m} />
      {:else}
        <button
          type="button"
          disabled={actionState === 'pending'}
          class="font-serif-light no-underline hover:underline hover:decoration-wavy hover:underline-offset-[3px] disabled:opacity-50"
          onclick={() => add('watched')}
        >
          {t(locale, 'search.mark.watched')}
        </button>
        <button
          type="button"
          disabled={actionState === 'pending'}
          class="font-serif-light no-underline hover:underline hover:decoration-wavy hover:underline-offset-[3px] disabled:opacity-50"
          onclick={() => add('queue')}
        >
          {t(locale, 'search.mark.queue')}
        </button>
        <button
          type="button"
          disabled={actionState === 'pending'}
          class="font-serif-light no-underline hover:underline hover:decoration-wavy hover:underline-offset-[3px] disabled:opacity-50"
          onclick={() => add('best')}
        >
          {t(locale, 'search.mark.best')}
        </button>
      {/if}
      {#if actionState === 'pending'}
        <span class="font-serif-italic normal-case text-mute">…</span>
      {:else if actionState === 'error'}
        <span class="font-serif-italic normal-case text-mute">{t(locale, 'search.error')}</span>
      {/if}
    </div>
  {/if}

  {#if m.tagline}
    <p class="font-serif-italic text-md text-center">"{m.tagline}"</p>
  {/if}

  {#if m.overview}
    <section>
      <h3 class="font-serif-bold uppercase text-xs mb-3">{t(locale, 'section.overview')}</h3>
      <p class="leading-relaxed">{m.overview}</p>
    </section>
  {/if}

  {#if m.trailer}
    <section>
      <h3 class="font-serif-bold uppercase text-xs mb-3">{t(locale, 'section.trailer')}</h3>
      <div class="aspect-video w-full border border-mute">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${m.trailer.key}`}
          title="Trailer"
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
          referrerpolicy="strict-origin-when-cross-origin"
          class="block w-full h-full"
        ></iframe>
      </div>
    </section>
  {/if}

  {#if m.cast && m.cast.length}
    <section>
      <h3 class="font-serif-bold uppercase text-xs mb-3">{t(locale, 'section.cast')}</h3>
      <ul class="grid gap-1 text-sm">
        {#each m.cast as actor}
          <li class="flex items-baseline gap-2 flex-wrap">
            <span class="font-serif-bold">{actor.name}</span>
            <span class="font-serif-light">— {actor.character}</span>
          </li>
        {/each}
      </ul>
    </section>
  {/if}

  {#if m.notion_page_id}
    <NoteEditor movie={m} />
  {:else if m.note}
    <section>
      <h3 class="font-serif-bold uppercase text-xs mb-3">{t(locale, 'notes.section')}</h3>
      <p class="leading-relaxed whitespace-pre-wrap">{m.note}</p>
    </section>
  {/if}

  {#if m.similar && m.similar.length}
    <section>
      <h3 class="font-serif-bold uppercase text-xs mb-3">{t(locale, 'section.similar')}</h3>
      <ul class="grid grid-cols-3 gap-3">
        {#each m.similar as s}
          <li>
            <a
              href={localePath(locale, `/movies/movie-${s.id}`)}
              class="block no-underline group"
            >
              {#if s.poster}
                <img
                  src={s.poster}
                  alt={s.title}
                  loading="lazy"
                  class="w-full h-auto block border border-mute grayscale group-hover:grayscale-0 transition-[filter] duration-150"
                />
              {/if}
              <p
                class="mt-1 text-xs font-serif-light leading-tight group-hover:underline group-hover:decoration-wavy group-hover:underline-offset-[3px]"
              >
                {s.title}{#if s.year} <span class="text-mute">({s.year})</span>{/if}
              </p>
            </a>
          </li>
        {/each}
      </ul>
    </section>
  {/if}
</article>
