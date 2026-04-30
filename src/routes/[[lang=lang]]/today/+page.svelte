<script lang="ts">
  import { page } from '$app/state';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import MovieSearch from '$lib/components/MovieSearch.svelte';
  import { resolveLocale, t, localePath } from '$lib/i18n';

  let { data } = $props();

  const locale = $derived(resolveLocale(page.params.lang));
  const movies = $derived(data.movies);
</script>

<svelte:head>
  <title>Today — Movie Log</title>
</svelte:head>

<PageHeader chapter="III" title={t(locale, 'header.today')} />

<div class="mb-12">
  <MovieSearch />
</div>

<main id="content">
  <p class="mb-12 text-center text-sm font-serif-italic">{t(locale, 'today.subtitle')}</p>

  {#if movies.length === 0}
    <p class="text-center text-sm font-serif-italic">{t(locale, 'today.empty')}</p>
  {:else}
    <ul class="grid gap-8">
      {#each movies as m}
        <li class="flex items-start gap-4">
          {#if m.poster}
            <img
              src={m.poster}
              alt=""
              loading="lazy"
              class="block w-24 h-auto border border-mute"
            />
          {/if}
          <div class="flex-1">
            <h3 class="font-serif-bold text-md leading-tight">{m.title}</h3>
            {#if m.year}
              <p class="mt-1 text-sm font-serif-light">{m.year}</p>
            {/if}
            {#if m.overview}
              <p class="mt-2 text-sm font-serif-light line-clamp-3">{m.overview}</p>
            {/if}
          </div>
        </li>
      {/each}
    </ul>
  {/if}

  {#if movies.length > 0}
    <p class="mt-12 text-right text-sm">
      <a
        href={localePath(locale, '/today/share')}
        class="font-serif-italic no-underline hover:underline"
      >
        {t(locale, 'today.share')}
      </a>
    </p>
  {/if}
</main>

<Footer />
