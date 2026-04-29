<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import MainNav from '$lib/components/MainNav.svelte';
  import ModeToggle from '$lib/components/ModeToggle.svelte';
  import LocaleToggle from '$lib/components/LocaleToggle.svelte';
  import AuthControl from '$lib/components/AuthControl.svelte';
  import MovieSearch from '$lib/components/MovieSearch.svelte';
</script>

<div class="min-h-[calc(100dvh_-_var(--content-padding)_*_2_-_3rem)] grid content-center">
  <Header />
  <main id="content">
    <div class="mt-12">
      <MovieSearch />
    </div>
    <MainNav transitionName />
    <div class="mt-8 flex justify-center items-center gap-6">
      <AuthControl />
      <ModeToggle />
      <LocaleToggle />
    </div>
  </main>
</div>
