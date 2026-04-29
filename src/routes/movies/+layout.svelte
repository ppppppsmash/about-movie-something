<script lang="ts">
  import { page } from '$app/state';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import SubNav from '$lib/components/SubNav.svelte';
  import Footer from '$lib/components/Footer.svelte';

  let { children } = $props();

  const isList = $derived(
    ['/movies', '/movies/queue', '/movies/best'].includes(page.url.pathname)
  );
</script>

<PageHeader chapter="I" title="MOVIES" />

<main id="content">
  {#if isList}
    <SubNav />
  {:else}
    <nav class="mb-12 flex text-sm uppercase">
      <a href="/movies" class="font-serif-light no-underline hover:underline">← Movies</a>
    </nav>
  {/if}
  {@render children()}
</main>

<Footer />
