<script lang="ts">
  import { page } from '$app/state';
  import { t, resolveLocale, localePath } from '$lib/i18n';

  let { transitionName = false }: { transitionName?: boolean } = $props();

  const locale = $derived(resolveLocale(page.params.lang));

  const link =
    'flex flex-1 gap-[0.4rem] text-sm uppercase no-underline transition-transform duration-100 ease-in-out hover:scale-105';
</script>

<nav class="w-full py-8 font-serif-light" class:vt={transitionName} id="nav">
  <ol class="grid gap-4 [counter-reset:counter]">
    <li class="flex [counter-increment:counter]"><a href={localePath(locale, '/movies')} class={link}>{t(locale, 'nav.movies')}</a></li>
    <li class="flex [counter-increment:counter]"><a href={localePath(locale, '/search')} class={link}>{t(locale, 'nav.search')}</a></li>
    <li class="flex [counter-increment:counter]"><a href={localePath(locale, '/notes')} class={link}>{t(locale, 'nav.notes')}</a></li>
    <li class="flex [counter-increment:counter]"><a href={localePath(locale, '/today')} class={link}>{t(locale, 'nav.today')}</a></li>
  </ol>
</nav>

<style>
  /* Opt-in view-transition-name for cross-route morph (set only when this nav is the
     "primary" instance — avoids duplicate names when a fallback MainNav is also in DOM) */
  .vt {
    view-transition-name: main-nav;
  }

  /* CSS counters + dotted leader — not naturally expressible as utilities */
  a::before {
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
  a::after {
    content: counters(counter, '.', upper-roman);
    order: 3;
  }
</style>
