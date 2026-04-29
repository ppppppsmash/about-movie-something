<script lang="ts">
  import MainNav from './MainNav.svelte';
  import ModeToggle from './ModeToggle.svelte';
</script>

<footer class="mt-16 text-sm">
  <!-- Mobile-only: at >= 1024px the MainNav lives in the left sidebar (root +layout.svelte) -->
  <div class="min-[1024px]:hidden">
    <MainNav transitionName />
  </div>
  <small class="block mt-12 font-serif-bold text-center">
    <a href="/" class="no-underline hover:underline">№ XLII</a>
  </small>
  <ModeToggle />
</footer>
