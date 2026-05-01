<script lang="ts">
  import { toast } from '$lib/stores/toast.svelte';
</script>

<div
  class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-[90vw]"
  aria-live="polite"
  aria-atomic="false"
>
  {#each toast.list as t (t.id)}
    <button
      type="button"
      onclick={() => toast.dismiss(t.id)}
      class="toast pointer-events-auto px-4 py-2 border border-ink bg-paper text-ink font-serif-light text-sm leading-tight text-left shadow-[3px_3px_0_var(--color-ink)] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0_var(--color-ink)] transition-transform"
      class:err={t.kind === 'error'}
    >
      <span aria-hidden="true">{t.kind === 'error' ? '!' : '✓'}</span>
      {t.message}
    </button>
  {/each}
</div>

<style>
  .toast {
    animation: slide-in 200ms ease-out;
  }
  .toast.err {
    --tw-shadow-color: var(--color-focus);
    border-color: var(--color-focus);
  }
  @keyframes slide-in {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
