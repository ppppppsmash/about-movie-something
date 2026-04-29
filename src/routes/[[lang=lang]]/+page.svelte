<script lang="ts">
  import { page } from '$app/state';
  import Header from '$lib/components/Header.svelte';
  import MainNav from '$lib/components/MainNav.svelte';
  import ModeToggle from '$lib/components/ModeToggle.svelte';
  import LocaleToggle from '$lib/components/LocaleToggle.svelte';
  import { resolveLocale, localePath } from '$lib/i18n';

  const locale = $derived(resolveLocale(page.params.lang));
  const homeHref = $derived(localePath(locale, '/'));
</script>

<div class="min-h-[calc(100dvh_-_var(--content-padding)_*_2)] grid content-center">
  <Header />
  <main id="content">
    <MainNav transitionName />
    <small class="block mt-12 font-serif-bold text-center">
      <a href={homeHref} class="no-underline hover:underline">№ XLII</a>
    </small>
    <ModeToggle />
    <LocaleToggle />
  </main>
</div>
