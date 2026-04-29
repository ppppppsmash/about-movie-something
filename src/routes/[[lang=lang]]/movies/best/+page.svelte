<script lang="ts">
  import { page } from '$app/state';
  import { roman, type Movie } from '$lib/data/movies';
  import { t, resolveLocale, localePath } from '$lib/i18n';

  let { data } = $props();

  const locale = $derived(resolveLocale(page.params.lang));
  const best = $derived(
    data.movies
      .filter((m: Movie) => m.best && m.status === 'watched')
      .sort((a: Movie, b: Movie) => (b.rating ?? 0) - (a.rating ?? 0))
  );
</script>

<svelte:head>
  <title>Movies · Best — Movie Log</title>
</svelte:head>

{#if best.length === 0}
  <p class="text-center text-sm font-serif-italic">{t(locale, 'empty.best')}</p>
{:else}
  <ul class="grid gap-8">
    {#each best as movie}
      <li>
        <a href={localePath(locale, `/movies/${movie.slug}`)} class="flex items-start gap-4 no-underline group">
          {#if movie.poster}
            <img
              src={movie.poster}
              alt=""
              loading="lazy"
              class="block w-24 h-auto border border-mute grayscale group-hover:grayscale-0 transition-[filter] duration-150"
            />
          {/if}
          <div class="flex-1">
            <h3
              class="font-serif-bold text-md leading-tight group-hover:underline group-hover:decoration-wavy group-hover:underline-offset-[3px]"
            >
              {movie.title}
            </h3>
            <p class="mt-1 text-sm font-serif-light">
              {movie.director} · {movie.year}
              {#if movie.rating}
                <span class="ml-2 tracking-wider">{roman(movie.rating)}</span>
              {/if}
            </p>
            {#if movie.overview}
              <p class="mt-2 text-sm font-serif-light line-clamp-3">{movie.overview}</p>
            {/if}
          </div>
        </a>
      </li>
    {/each}
  </ul>
{/if}
