<script lang="ts">
  import { page } from '$app/state';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { t, resolveLocale, localePath } from '$lib/i18n';

  let { data, children } = $props();

  const locale = $derived(resolveLocale(page.params.lang));
  const handle = $derived(page.params.handle ?? '');
  const title = $derived(`${handle}${t(locale, 'users.profile_suffix')}`);

  const tabs = $derived([
    { href: localePath(locale, `/u/${handle}`), label: t(locale, 'tab.watched') },
    { href: localePath(locale, `/u/${handle}/queue`), label: t(locale, 'tab.queue') },
    { href: localePath(locale, `/u/${handle}/best`), label: t(locale, 'tab.best') }
  ]);

  function isActive(href: string): boolean {
    const path = page.url.pathname;
    const root = localePath(locale, `/u/${handle}`);
    if (href === root) return path === root;
    return path === href || path.startsWith(href + '/');
  }
</script>

<PageHeader chapter="IV" title={title} />

<main id="content">
  {#if !data.signedIn}
    <p class="text-center text-sm font-serif-italic">{t(locale, 'auth.signin_to_start')}</p>
  {:else}
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

    {@render children()}

    <p class="mt-12 text-right text-sm">
      <a
        href={localePath(locale, '/users')}
        class="font-serif-italic no-underline hover:underline"
      >
        {t(locale, 'users.back')}
      </a>
    </p>
  {/if}
</main>

<Footer />
