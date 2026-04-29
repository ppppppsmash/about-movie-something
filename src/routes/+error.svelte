<script lang="ts">
  import { page } from '$app/state';

  // Pick locale by URL prefix (page.params may be empty for unmatched routes).
  const isEn = $derived(page.url.pathname.startsWith('/en'));
  const homeHref = $derived(isEn ? '/en' : '/');
  const heading = $derived(isEn ? 'Page not found' : 'ページが見つかりません');
  const back = $derived(isEn ? '← Home' : '← トップへ');
</script>

<svelte:head>
  <title>{page.status} · Movie Log</title>
</svelte:head>

<main class="min-h-[100dvh] grid place-content-center text-center px-[var(--content-padding)]">
  <p class="font-display text-2xl">{page.status}</p>
  <p class="mt-4 font-serif-bold text-md">
    {page.error?.message || heading}
  </p>
  <p class="mt-12 text-sm font-serif-light uppercase">
    <a href={homeHref} class="no-underline hover:underline">{back}</a>
  </p>
</main>
