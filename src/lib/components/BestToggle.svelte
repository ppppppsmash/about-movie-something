<script lang="ts">
  import { invalidate } from '$app/navigation';
  import type { Movie } from '$lib/data/movies';

  let { movie }: { movie: Movie } = $props();

  let pending = $state(false);

  async function toggle() {
    if (!movie.notion_page_id || pending) return;
    pending = true;
    const next = !(movie.best ?? false);
    try {
      const res = await fetch(`/api/movies/${movie.notion_page_id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ best: next })
      });
      if (!res.ok) {
        console.error('[best-toggle] failed:', res.status, await res.text().catch(() => ''));
        return;
      }
      // Re-fetch the movies list so the UI reflects the new state.
      await invalidate('app:movies');
    } finally {
      pending = false;
    }
  }
</script>

{#if movie.notion_page_id}
  <button
    type="button"
    aria-label={movie.best ? 'Remove from Best' : 'Add to Best'}
    aria-pressed={movie.best ?? false}
    disabled={pending}
    onclick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      toggle();
    }}
    class="text-base leading-none disabled:opacity-50 transition-transform duration-150 hover:scale-110"
  >
    {movie.best ? '★' : '☆'}
  </button>
{/if}
