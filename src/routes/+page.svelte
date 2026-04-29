<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import MainNav from '$lib/components/MainNav.svelte';
  import ModeToggle from '$lib/components/ModeToggle.svelte';
</script>

<Header />

<main id="content">
  <MainNav />
  <small class="block mt-12 font-serif-bold text-center">
    <a href="/" class="no-underline hover:underline">№ XLII</a>
  </small>
  <ModeToggle />
</main>
