<script lang="ts">
  import { page } from '$app/state';
  import { theme, type Theme } from '$lib/stores/theme.svelte';
  import { resolveLocale, t } from '$lib/i18n';

  const locale = $derived(resolveLocale(page.params.lang));
  const labelKey = $derived(`theme.${theme.value}` as const);
  const label = $derived(t(locale, labelKey as `theme.${Theme}`));
</script>

<div class="theme-toggle grid place-content-center [.no-js_&]:hidden">
  <button
    class="flex items-center p-0 bg-transparent border-none cursor-pointer active:translate-y-px focus-visible:outline-none focus-visible:rounded-full"
    type="button"
    aria-label="Cycle theme"
    title={label}
    onclick={() => theme.cycle()}
  >
    <span
      class="w-[1.6rem] h-[1.6rem] transition-transform duration-100 ease-in-out hover:scale-[1.15] hover:rotate-[5deg]"
      aria-hidden="true"
    >
      <svg
        class="w-full h-auto"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        stroke-width="1.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="6.5" cy="7" r="2.6" />
        <circle cx="13.5" cy="7" r="2.6" />
        <circle cx="10" cy="13.5" r="2.6" />
      </svg>
    </span>
    <span
      class="absolute h-px w-px overflow-hidden whitespace-nowrap [clip:rect(1px,1px,1px,1px)] [clip-path:inset(1px)]"
    >theme: {label}</span>
  </button>
</div>

<style>
  svg :global(circle) {
    stroke: var(--color-ink);
    vector-effect: none;
  }
</style>
