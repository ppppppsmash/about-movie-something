<script lang="ts">
  import PageHeader from '$lib/components/PageHeader.svelte';
  import SubNav from '$lib/components/SubNav.svelte';
  import Footer from '$lib/components/Footer.svelte';

  let { children } = $props();
</script>

<PageHeader chapter="I" title="MOVIES" />

<main id="content">
  <SubNav />
  {@render children()}
</main>

<Footer />
