<script lang="ts">
  import { page } from '$app/state';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import SubNav from '$lib/components/SubNav.svelte';
  import Footer from '$lib/components/Footer.svelte';
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

<main id="content">
  {#if isList}
    <SubNav />
  {:else}
    <nav class="mb-12 flex text-sm uppercase">
      <a href={moviesPath} class="font-serif-light no-underline hover:underline">{t(locale, 'back.movies')}</a>
    </nav>
  {/if}
  {@render children()}
</main>

<Footer />
