<script lang="ts">
  import { page } from '$app/state';
  import { resolveLocale, t } from '$lib/i18n';

  const currentLocale = $derived(resolveLocale(page.params.lang));

  const otherHref = $derived.by(() => {
    const path = page.url.pathname;
    if (currentLocale === 'ja') {
      // → English: prefix with /en
      return path === '/' ? '/en' : `/en${path}`;
    }
    // → Japanese: strip /en prefix
    const stripped = path.replace(/^\/en/, '');
    return stripped || '/';
  });
</script>

<small class="block mt-4 text-center font-serif-light text-xs uppercase">
  <a href={otherHref} class="no-underline hover:underline">{t(currentLocale, 'locale.other')}</a>
</small>
