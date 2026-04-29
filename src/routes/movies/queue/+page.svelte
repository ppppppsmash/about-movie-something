<script lang="ts">
  import type { Movie } from '$lib/data/movies';

  let { data } = $props();

  const queue = $derived(data.movies.filter((m: Movie) => m.status === 'queue'));
</script>

<svelte:head>
  <title>Movies · Queue — Movie Log</title>
</svelte:head>

{#if queue.length === 0}
  <p class="text-center text-sm font-serif-italic">queue is empty.</p>
{:else}
  <ul class="grid gap-4">
    {#each queue as movie}
      <li class="flex items-start gap-3">
        {#if movie.poster}
          <img
            src={movie.poster}
            alt=""
            loading="lazy"
            class="block w-12 h-auto border border-mute"
          />
        {/if}
        <div class="flex-1 leading-tight">
          <p class="font-serif-bold">{movie.title}</p>
          <p class="text-sm font-serif-light">{movie.director} · {movie.year}</p>
        </div>
      </li>
    {/each}
  </ul>
{/if}
