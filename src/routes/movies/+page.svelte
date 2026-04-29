<script lang="ts">
  import { movies, roman, type Movie } from '$lib/data/movies';

  const watched = movies.filter((m) => m.status === 'watched');

  const byYear: Record<string, Movie[]> = {};
  for (const m of watched) {
    const y = (m.watched_on ?? String(m.year)).slice(0, 4);
    (byYear[y] ??= []).push(m);
  }
  const years = Object.keys(byYear).sort().reverse();
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
      <ul class="grid gap-3">
        {#each byYear[year] as movie}
          <li class="flex items-baseline gap-2">
            <span class="font-serif-bold">{movie.title}</span>
            <span class="text-sm font-serif-light">— {movie.director} ({movie.year})</span>
            {#if movie.rating}
              <span class="ml-auto text-xs font-serif-light tracking-wider">{roman(movie.rating)}</span>
            {/if}
          </li>
        {/each}
      </ul>
    </section>
  {/each}
</div>
