<script lang="ts">
  import { page } from '$app/state';
  import { t, resolveLocale, localePath } from '$lib/i18n';

  const locale = $derived(resolveLocale(page.params.lang));

  const tabs = $derived([
    { href: localePath(locale, '/movies'), label: t(locale, 'tab.watched') },
    { href: localePath(locale, '/movies/queue'), label: t(locale, 'tab.queue') },
    { href: localePath(locale, '/movies/best'), label: t(locale, 'tab.best') }
  ]);

  function isActive(href: string): boolean {
    const path = page.url.pathname;
    const moviesPath = localePath(locale, '/movies');
    if (href === moviesPath) return path === moviesPath;
    return path === href || path.startsWith(href + '/');
  }
</script>

<nav class="mb-12 flex justify-between gap-4 text-sm uppercase">
  {#each tabs as { href, label }}
    {@const active = isActive(href)}
    <a
      {href}
      class={active
        ? 'font-serif-bold underline decoration-wavy underline-offset-[3px]'
        : 'font-serif-light no-underline hover:underline'}
      aria-current={active ? 'page' : undefined}
    >{label}</a>
  {/each}
</nav>
