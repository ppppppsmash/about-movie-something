<script lang="ts">
  import { page } from '$app/state';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import SubNav from '$lib/components/SubNav.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import MovieSearch from '$lib/components/MovieSearch.svelte';
  import { t, resolveLocale, localePath } from '$lib/i18n';

  let { children } = $props();

  const locale = $derived(resolveLocale(page.params.lang));
  const moviesPath = $derived(localePath(locale, '/movies'));
  const isList = $derived(
    [
      moviesPath,
      localePath(locale, '/movies/queue'),
      localePath(locale, '/movies/best')
    ].includes(page.url.pathname)
  );
</script>

<PageHeader chapter="I" title={t(locale, 'header.movies')} />

{#if isList}
  <div class="mb-12">
    <MovieSearch />
  </div>
{/if}

<main id="content">
  {#if isList}
    <SubNav />
  {:else}
    <nav class="mb-10 sticky top-0 z-10 -mx-[var(--content-padding)] px-[var(--content-padding)] py-3 bg-paper border-b border-mute">
      <a
        href={moviesPath}
        class="font-serif-bold text-sm uppercase tracking-wider no-underline hover:underline hover:decoration-wavy hover:underline-offset-[3px]"
      >
        {t(locale, 'back.movies')}
      </a>
    </nav>
  {/if}
  {@render children()}
</main>

<Footer />
