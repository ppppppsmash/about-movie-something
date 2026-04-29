<script lang="ts">
  import { movies, roman } from '$lib/data/movies';

  const best = movies
    .filter((m) => m.best && m.status === 'watched')
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
</script>

<svelte:head>
  <title>Movies · Best — Movie Log</title>
</svelte:head>

{#if best.length === 0}
  <p class="text-center text-sm font-serif-italic">no picks yet.</p>
{:else}
  <ul class="grid gap-8">
    {#each best as movie}
      <li>
        <h3 class="font-serif-bold text-md leading-tight">{movie.title}</h3>
        <p class="mt-1 text-sm font-serif-light">
          {movie.director} · {movie.year}
          {#if movie.rating}
            <span class="ml-2 tracking-wider">{roman(movie.rating)}</span>
          {/if}
        </p>
      </li>
    {/each}
  </ul>
{/if}
