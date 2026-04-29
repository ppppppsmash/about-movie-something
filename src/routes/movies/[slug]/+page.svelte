<script lang="ts">
  import { roman } from '$lib/data/movies';

  let { data } = $props();
  const m = $derived(data.movie);
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
        {m.director} · {m.year}{#if m.runtime} · {m.runtime} min{/if}
      </p>
      {#if m.genres && m.genres.length}
        <p class="mt-1 text-xs font-serif-light uppercase tracking-wider">
          {m.genres.join(' · ')}
        </p>
      {/if}
      <div class="mt-4 text-sm font-serif-light space-y-1">
        {#if m.rating}
          <p>Rated <span class="font-serif-bold tracking-wider">{roman(m.rating)}</span></p>
        {/if}
        {#if m.watched_on}
          <p>Watched {m.watched_on}</p>
        {/if}
        {#if m.best}
          <p class="text-xs uppercase tracking-wider">★ Best pick</p>
        {/if}
      </div>
    </div>
  </header>

  {#if m.tagline}
    <p class="font-serif-italic text-md text-center">"{m.tagline}"</p>
  {/if}

  {#if m.overview}
    <section>
      <h3 class="font-serif-bold uppercase text-xs mb-3">Overview</h3>
      <p class="leading-relaxed">{m.overview}</p>
    </section>
  {/if}

  {#if m.cast && m.cast.length}
    <section>
      <h3 class="font-serif-bold uppercase text-xs mb-3">Cast</h3>
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

  {#if m.similar && m.similar.length}
    <section>
      <h3 class="font-serif-bold uppercase text-xs mb-3">Similar</h3>
      <ul class="grid grid-cols-3 gap-3">
        {#each m.similar as s}
          <li>
            {#if s.poster}
              <img
                src={s.poster}
                alt={s.title}
                loading="lazy"
                class="w-full h-auto block border border-mute"
              />
            {/if}
            <p class="mt-1 text-xs font-serif-light leading-tight">
              {s.title}{#if s.year} <span class="text-mute">({s.year})</span>{/if}
            </p>
          </li>
        {/each}
      </ul>
    </section>
  {/if}
</article>
