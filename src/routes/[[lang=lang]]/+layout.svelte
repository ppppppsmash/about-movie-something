<script lang="ts">
  import { onMount } from 'svelte';
  import { onNavigate } from '$app/navigation';
  import { page } from '$app/state';
  import { elasticScale } from '$lib/actions/elasticScale';
  import { colorScheme } from '$lib/stores/colorScheme.svelte';
  import MainNav from '$lib/components/MainNav.svelte';

  let { children } = $props();

  // Treat both `/` (Japanese home) and `/en` (English home) as "home" for sidebar purposes.
  const isHome = $derived(page.url.pathname === '/' || page.url.pathname === '/en');

  onMount(() => {
    document.body.classList.remove('no-js');
    colorScheme.init();
  });

  onNavigate((navigation) => {
    if (typeof document === 'undefined') return;
    if (typeof document.startViewTransition !== 'function') return;
    if (window.matchMedia('(max-width: 1149px)').matches) return;

    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });
</script>

<svelte:head>
  <title>Movie Log</title>
</svelte:head>

{#if !isHome}
  <aside
    class="hidden min-[1150px]:block fixed right-[calc(50%_+_250px_+_8rem)] top-56 w-[180px] z-10"
  >
    <MainNav transitionName />
  </aside>
{/if}

<div
  class="m-[var(--content-padding)] w-[calc(100%_-_var(--content-padding)_*_2)] min-[500px]:w-[calc(500px_-_var(--content-padding)_*_2)] transition-transform duration-100 ease-elastic"
  use:elasticScale
>
  {@render children()}
</div>
