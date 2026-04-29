<script lang="ts">
  import { colorScheme } from '$lib/stores/colorScheme.svelte';
</script>

<div class="grid place-content-center [.no-js_&]:hidden">
  <button
    class="flex items-center p-0 bg-transparent border-none cursor-pointer active:translate-y-px focus-visible:outline-none focus-visible:rounded-full"
    type="button"
    aria-label="Toggle color mode"
    onclick={() => colorScheme.toggle()}
  >
    <span
      class="w-[1.6rem] h-[1.6rem] transition-transform duration-100 ease-in-out hover:scale-[1.15] hover:rotate-[5deg]"
      aria-hidden="true"
    >
      <svg
        class="w-full h-auto"
        xmlns="http://www.w3.org/2000/svg"
        width=".28in"
        height=".28in"
        viewBox="0 0 20 20"
      >
        <g id="moon">
          <path
            d="M9,2.9c-2,0-3.8,.8-5.2,2.2,.7-.3,1.4-.5,2.1-.5,3,.1,5.3,2.7,5.2,5.6-.1,2.9-2.4,5.1-5.2,5.2-.7,0-1.5-.2-2.1-.5,2.8,2.9,7.3,2.9,10.1,.2s3-7.3,.3-10.1c-1.4-1.3-3.3-2.2-5.2-2.1h0Z"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <g id="sun">
          <circle
            cx="10"
            cy="9.96"
            r="4.1"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <line x1="10" y1="1.56" x2="10" y2="3.46" stroke-linecap="round" stroke-linejoin="round" />
          <line x1="10" y1="16.46" x2="10" y2="18.36" stroke-linecap="round" stroke-linejoin="round" />
          <line x1="18.4" y1="9.96" x2="16.5" y2="9.96" stroke-linecap="round" stroke-linejoin="round" />
          <line x1="3.5" y1="9.96" x2="1.6" y2="9.96" stroke-linecap="round" stroke-linejoin="round" />
          <line x1="15.9" y1="15.86" x2="14.6" y2="14.56" stroke-linecap="round" stroke-linejoin="round" />
          <line x1="5.4" y1="5.36" x2="4.1" y2="4.06" stroke-linecap="round" stroke-linejoin="round" />
          <line x1="15.9" y1="4.06" x2="14.6" y2="5.36" stroke-linecap="round" stroke-linejoin="round" />
          <line x1="5.4" y1="14.56" x2="4.1" y2="15.86" stroke-linecap="round" stroke-linejoin="round" />
        </g>
      </svg>
    </span>
    <span
      class="absolute h-px w-px overflow-hidden whitespace-nowrap [clip:rect(1px,1px,1px,1px)] [clip-path:inset(1px)]"
    >mode</span>
  </button>
</div>

<style>
  /* Sun/moon opacity is driven by --toggle-sun / --toggle-moon CSS vars */
  svg :global(#sun) {
    opacity: var(--toggle-sun);
  }
  svg :global(#moon) {
    opacity: var(--toggle-moon);
  }
  svg :global(path),
  svg :global(circle),
  svg :global(line) {
    stroke: var(--color-ink);
    vector-effect: none;
  }
</style>
