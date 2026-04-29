<script lang="ts">
  import { movies } from '$lib/data/movies';

  const queue = movies.filter((m) => m.status === 'queue');
</script>

<svelte:head>
  <title>Movies · Queue — Movie Log</title>
</svelte:head>

{#if queue.length === 0}
  <p class="text-center text-sm font-serif-italic">queue is empty.</p>
{:else}
  <ul class="grid gap-4">
    {#each queue as movie}
      <li class="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span class="font-serif-bold">{movie.title}</span>
        <span class="text-sm font-serif-light">— {movie.director} ({movie.year})</span>
      </li>
    {/each}
  </ul>
{/if}
