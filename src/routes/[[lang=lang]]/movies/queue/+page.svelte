<script lang="ts">
  import { page } from '$app/state';
  import type { Movie } from '$lib/data/movies';
  import { t, resolveLocale, localePath } from '$lib/i18n';

  let { data } = $props();

  const locale = $derived(resolveLocale(page.params.lang));
  const queue = $derived(data.movies.filter((m: Movie) => m.status === 'queue'));
</script>

<svelte:head>
  <title>Movies · Queue — Movie Log</title>
</svelte:head>

{#if queue.length === 0}
  <p class="text-center text-sm font-serif-italic">{t(locale, 'empty.queue')}</p>
{:else}
  <ul class="grid gap-4">
    {#each queue as movie}
      <li>
        <a href={localePath(locale, `/movies/${movie.slug}`)} class="flex items-start gap-3 no-underline group">
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
      </li>
    {/each}
  </ul>
{/if}
