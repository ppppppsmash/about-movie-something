<script lang="ts">
  import { invalidate } from '$app/navigation';
  import { page } from '$app/state';
  import { untrack } from 'svelte';
  import type { Movie } from '$lib/data/movies';
  import { resolveLocale, t } from '$lib/i18n';

  let { movie }: { movie: Movie } = $props();

  const locale = $derived(resolveLocale(page.params.lang));

  // Intentionally capture only the initial values — user edits are owned locally,
  // and parent re-renders after save shouldn't clobber typed content.
  let text = $state(untrack(() => movie.note ?? ''));
  let isPublic = $state(untrack(() => movie.public ?? false));
  let saving = $state(false);
  let saved = $state(false);
  let errored = $state(false);

  let timer: ReturnType<typeof setTimeout> | null = null;
  let savedTimer: ReturnType<typeof setTimeout> | null = null;

  /** Auto-grow the textarea to fit its content (no scrollbar / no resize handle). */
  function autoGrow(node: HTMLTextAreaElement) {
    const grow = () => {
      node.style.height = 'auto';
      node.style.height = `${node.scrollHeight}px`;
    };
    node.addEventListener('input', grow);
    queueMicrotask(grow); // initial sizing after mount
    return {
      destroy() {
        node.removeEventListener('input', grow);
      }
    };
  }

  function debouncedSave() {
    if (timer) clearTimeout(timer);
    timer = setTimeout(save, 800);
  }

  async function save() {
    if (!movie.notion_page_id) return;
    saving = true;
    saved = false;
    errored = false;
    try {
      const res = await fetch(`/api/movies/${movie.notion_page_id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ note: text, public: isPublic })
      });
      if (!res.ok) throw new Error(String(res.status));
      saved = true;
      if (savedTimer) clearTimeout(savedTimer);
      savedTimer = setTimeout(() => {
        saved = false;
      }, 1500);
      await invalidate('app:movies');
    } catch {
      errored = true;
    } finally {
      saving = false;
    }
  }
</script>

<section>
  <div class="mb-3 flex items-baseline justify-between gap-3">
    <h3 class="font-serif-bold uppercase text-xs">{t(locale, 'notes.section')}</h3>
    <button
      type="button"
      class="flex items-center gap-1 text-xs font-serif-light no-underline hover:underline uppercase tracking-wider"
      aria-pressed={isPublic}
      onclick={() => {
        isPublic = !isPublic;
        save();
      }}
    >
      <span class="text-base leading-none">{isPublic ? '☑' : '☐'}</span>
      {t(locale, 'notes.public')}
    </button>
  </div>

  <textarea
    use:autoGrow
    bind:value={text}
    oninput={debouncedSave}
    onblur={save}
    placeholder={t(locale, 'notes.placeholder')}
    class="dots-frame w-full px-4 py-3 bg-transparent font-serif-light text-sm leading-relaxed resize-none min-h-[14rem] overflow-hidden focus:outline-none"
  ></textarea>

  <p class="mt-2 text-right text-xs font-serif-light text-mute min-h-[1.2em]">
    {#if saving}
      {t(locale, 'notes.saving')}
    {:else if errored}
      {t(locale, 'notes.save_error')}
    {:else if saved}
      ✓ {t(locale, 'notes.saved')}
    {/if}
  </p>
</section>

<style>
  /* Same dotted-leader treatment as MainNav: radial-gradient circles tiled along all four
     edges. `space` ensures the dots terminate cleanly at corners (matches MainNav's
     `background-repeat: space no-repeat`). Color comes from `--dot`. */
  .dots-frame {
    --dot: var(--color-mute);
    background-image:
      radial-gradient(circle, var(--dot) 20%, transparent 21%),
      radial-gradient(circle, var(--dot) 20%, transparent 21%),
      radial-gradient(circle, var(--dot) 20%, transparent 21%),
      radial-gradient(circle, var(--dot) 20%, transparent 21%);
    background-position: left top, left bottom, left top, right top;
    background-repeat: space no-repeat, space no-repeat, no-repeat space, no-repeat space;
    background-size: 0.6em 0.6em;
  }
  .dots-frame:focus {
    --dot: var(--color-ink);
  }
  /* Hide native chrome that some browsers still draw despite resize: none / overflow: hidden. */
  .dots-frame::-webkit-resizer {
    display: none;
  }
  .dots-frame::-webkit-scrollbar {
    display: none;
  }
</style>
