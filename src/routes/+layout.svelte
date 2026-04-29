<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { elasticScale } from '$lib/actions/elasticScale';
  import { colorScheme } from '$lib/stores/colorScheme.svelte';

  let { children } = $props();

  onMount(() => {
    document.body.classList.remove('no-js');
    colorScheme.init();
  });
</script>

<svelte:head>
  <title>Movie Log</title>
</svelte:head>

<div
  class="m-[var(--content-padding)] w-[calc(100%_-_var(--content-padding)_*_2)] min-[500px]:w-[calc(500px_-_var(--content-padding)_*_2)] transition-transform duration-100 ease-elastic"
  use:elasticScale
>
  {@render children()}
</div>
