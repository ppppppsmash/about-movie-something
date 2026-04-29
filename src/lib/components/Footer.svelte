<script lang="ts">
  import MainNav from './MainNav.svelte';
  import ModeToggle from './ModeToggle.svelte';
</script>

<footer class="mt-16 text-sm">
  <!-- Mobile-only: at >= 1024px the MainNav lives in the left sidebar (root +layout.svelte) -->
  <div class="min-[1024px]:hidden">
    <MainNav transitionName />
  </div>

  <!-- Back to home: styled with dotted leaders on both sides, like a section divider -->
  <p class="flex py-8 font-serif-light uppercase">
    <a
      href="/"
      class="dots flex flex-1 gap-[0.4rem] no-underline transition-transform duration-100 ease-in-out hover:scale-105"
    >Top</a>
  </p>

  <small class="block mt-12 font-serif-bold text-center">
    <a href="/" class="no-underline hover:underline">№ XLII</a>
  </small>
  <ModeToggle />
</footer>

<style>
  /* Same dotted-leader treatment as MainNav: label on the left, dots filling, "Ø" on the right
     (null/empty-set symbol — visually aligns with the Roman I/II/III used by the rest of the nav). */
  .dots::before {
    content: '';
    flex: 1;
    background-repeat: space no-repeat;
    background-image: radial-gradient(
      circle,
      var(--color-ink) 20%,
      transparent 21%
    );
    background-size: 0.6em 0.6em;
    background-position: 0 80%;
    order: 2;
  }
  .dots::after {
    content: 'Ø';
    order: 3;
  }
</style>
