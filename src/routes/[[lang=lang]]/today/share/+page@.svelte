<script lang="ts">
  import { page } from '$app/state';
  import { resolveLocale, t } from '$lib/i18n';

  let { data } = $props();

  const locale = $derived(resolveLocale(page.params.lang));
  const movies = $derived(data.movies);
  const dateLabel = $derived(
    new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );
  const ogTitle = $derived(`${t(locale, 'today.subtitle')} · ${dateLabel}`);
  const ogDesc = $derived(movies.map((m) => m.title).filter(Boolean).join(' / '));
  const ogImage = $derived(movies[0]?.poster ?? '');
  const ogUrl = $derived(page.url.href);
</script>

<svelte:head>
  <title>{ogTitle}</title>
  <meta name="description" content={ogDesc} />
  <meta property="og:title" content={ogTitle} />
  <meta property="og:description" content={ogDesc} />
  <meta property="og:url" content={ogUrl} />
  <meta property="og:type" content="website" />
  {#if ogImage}
    <meta property="og:image" content={ogImage} />
    <meta name="twitter:image" content={ogImage} />
  {/if}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={ogTitle} />
  <meta name="twitter:description" content={ogDesc} />
</svelte:head>

<main class="mx-auto w-full max-w-[500px] px-[var(--content-padding)] py-10">
  <p class="mb-8 text-center text-xs font-serif-italic uppercase tracking-wider">{dateLabel}</p>
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
</main>
