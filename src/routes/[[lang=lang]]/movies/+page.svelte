<script lang="ts">
  import { page } from '$app/state';
  import type { Movie } from '$lib/data/movies';
  import { resolveLocale, localePath } from '$lib/i18n';
  import BestToggle from '$lib/components/BestToggle.svelte';

  let { data } = $props();

  const locale = $derived(resolveLocale(page.params.lang));
  const watched = $derived(data.movies.filter((m: Movie) => m.status === 'watched'));
  const byYear = $derived.by(() => {
    const m: Record<string, Movie[]> = {};
    for (const movie of watched) {
      const y = (movie.watched_on ?? String(movie.year)).slice(0, 4);
      (m[y] ??= []).push(movie);
    }
    return m;
  });
  const years = $derived(Object.keys(byYear).sort().reverse());
</script>

<svelte:head>
  <title>Movies · Watched — Movie Log</title>
</svelte:head>

<div class="grid gap-10">
  {#each years as year}
    <section>
      <h2
        class="mb-4 flex items-center gap-3 font-serif text-xs uppercase after:content-[''] after:flex-1 after:h-px after:bg-mute"
      >
        {year}
      </h2>
      <ul class="grid gap-4">
        {#each byYear[year] as movie}
          <li class="flex items-start gap-3">
            <a
              href={localePath(locale, `/movies/${movie.slug}`)}
              class="flex-1 flex items-start gap-3 no-underline group"
            >
              {#if movie.poster}
                <img
                  src={movie.poster}
                  alt=""
                  loading="lazy"
                  class="block w-12 h-auto border border-mute grayscale group-hover:grayscale-0 transition-[filter] duration-150"
                />
              {/if}
              <div class="flex-1 leading-tight">
                <p
                  class="font-serif-bold group-hover:underline group-hover:decoration-wavy group-hover:underline-offset-[3px]"
                >
                  {movie.title}
                </p>
                <p class="text-sm font-serif-light">{movie.director} · {movie.year}</p>
              </div>
            </a>
            <BestToggle {movie} />
          </li>
        {/each}
      </ul>
    </section>
  {/each}
</div>
