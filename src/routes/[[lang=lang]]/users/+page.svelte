<script lang="ts">
  import { page } from '$app/state';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { resolveLocale, localePath, t } from '$lib/i18n';

  let { data } = $props();

  const locale = $derived(resolveLocale(page.params.lang));
</script>

<svelte:head>
  <title>People — Movie Log</title>
</svelte:head>

<PageHeader chapter="IV" title={t(locale, 'header.users')} />

<main id="content">
  <p class="mb-12 text-center text-sm font-serif-italic">{t(locale, 'users.subtitle')}</p>

  {#if !data.signedIn}
    <p class="text-center text-sm font-serif-italic">{t(locale, 'auth.signin_to_start')}</p>
  {:else if data.users.length === 0}
    <p class="text-center text-sm font-serif-italic">{t(locale, 'users.empty')}</p>
  {:else}
    <ul class="grid gap-4">
      {#each data.users as u}
        <li>
          <a
            href={localePath(locale, `/u/${u.handle}`)}
            class="font-serif-bold no-underline hover:underline hover:decoration-wavy hover:underline-offset-[3px]"
          >
            {u.handle}
          </a>
        </li>
      {/each}
    </ul>
  {/if}
</main>

<Footer />
