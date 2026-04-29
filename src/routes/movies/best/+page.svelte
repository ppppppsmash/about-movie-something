<script lang="ts">
  import { roman, type Movie } from '$lib/data/movies';

  let { data } = $props();

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
  <p class="text-center text-sm font-serif-italic">no picks yet.</p>
{:else}
  <ul class="grid gap-8">
    {#each best as movie}
      <li class="flex items-start gap-4">
        {#if movie.poster}
          <img
            src={movie.poster}
            alt=""
            loading="lazy"
            class="block w-24 h-auto border border-mute"
          />
        {/if}
        <div class="flex-1">
          <h3 class="font-serif-bold text-md leading-tight">{movie.title}</h3>
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
      </li>
    {/each}
  </ul>
{/if}
