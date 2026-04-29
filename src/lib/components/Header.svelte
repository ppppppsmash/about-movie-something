<script lang="ts">
  import { page } from '$app/state';
  import { resolveLocale, t } from '$lib/i18n';

  const locale = $derived(resolveLocale(page.params.lang));
</script>

<header class="text-center">
  <h1 class="font-display text-2xl max-[499px]:text-2xl-sm leading-none">
    MOVIE <br />LOG
  </h1>
  <h2 class="mt-[0.75em] font-serif-bold text-md">{t(locale, 'home.subtitle')}</h2>
</header>
