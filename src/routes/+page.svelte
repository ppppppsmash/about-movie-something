<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import MainNav from '$lib/components/MainNav.svelte';
  import ModeToggle from '$lib/components/ModeToggle.svelte';
</script>

<div class="min-h-[calc(100dvh_-_var(--content-padding)_*_2)] grid content-center">
  <Header />
  <main id="content">
    <MainNav transitionName />
    <small class="block mt-12 font-serif-bold text-center">
      <a href="/" class="no-underline hover:underline">№ XLII</a>
    </small>
    <ModeToggle />
  </main>
</div>
