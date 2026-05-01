<script lang="ts">
  import { invalidate } from '$app/navigation';
  import { page } from '$app/state';
  import { untrack } from 'svelte';
  import type { Movie } from '$lib/data/movies';
  import { resolveLocale, t } from '$lib/i18n';

  let { movie }: { movie: Movie } = $props();

  const locale = $derived(resolveLocale(page.params.lang));

  // Owned locally so re-renders from invalidate('app:movies') don't clobber typed input.
  let text = $state(untrack(() => movie.note ?? ''));
  let isPublic = $state(untrack(() => movie.public ?? false));
  let saving = $state(false);
  let saved = $state(false);
  let errored = $state(false);

  let timer: ReturnType<typeof setTimeout> | null = null;
  let savedTimer: ReturnType<typeof setTimeout> | null = null;

  let dialog = $state<HTMLDialogElement | null>(null);

  function openEditor() {
    dialog?.showModal();
  }

  function closeEditor() {
    // `onclose` handler (ESC, close(), backdrop) is the single point that triggers save.
    dialog?.close();
  }

  /** Auto-grow the textarea to fit its content. */
  function autoGrow(node: HTMLTextAreaElement) {
    const grow = () => {
      node.style.height = 'auto';
      node.style.height = `${node.scrollHeight}px`;
    };
    node.addEventListener('input', grow);
    queueMicrotask(grow);
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

  // Close on backdrop click — the click target is the <dialog> itself only when
  // the user hits the backdrop (not the inner panel), thanks to the panel filling
  // the dialog's content box.
  function onDialogClick(e: MouseEvent) {
    if (e.target === dialog) closeEditor();
  }
</script>

<section>
  <div class="mb-3 flex items-baseline justify-between gap-3">
    <h3 class="font-serif-bold uppercase text-xs">{t(locale, 'notes.section')}</h3>
    {#if isPublic}
      <span class="text-xs uppercase tracking-wider font-serif-light">
        ☑ {t(locale, 'notes.public')}
      </span>
    {/if}
  </div>

  {#if text.trim()}
    <p class="mb-3 leading-relaxed whitespace-pre-wrap">{text}</p>
    <button
      type="button"
      class="text-xs uppercase tracking-wider font-serif-light no-underline hover:underline"
      onclick={openEditor}
    >
      {t(locale, 'notes.edit')} ›
    </button>
  {:else}
    <p class="mb-3 text-sm font-serif-italic text-mute">{t(locale, 'notes.empty_one')}</p>
    <button
      type="button"
      class="text-xs uppercase tracking-wider font-serif-bold no-underline hover:underline hover:decoration-wavy hover:underline-offset-[3px]"
      onclick={openEditor}
    >
      {t(locale, 'notes.write')} ›
    </button>
  {/if}
</section>

<dialog
  bind:this={dialog}
  onclose={save}
  onclick={onDialogClick}
  class="note-dialog bg-paper text-ink p-0 border border-mute backdrop:bg-black/40"
>
  <div class="p-6 grid gap-4">
    <div class="flex items-baseline justify-between gap-3">
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

    <div class="flex items-baseline justify-between gap-3">
      <p class="text-xs font-serif-light text-mute min-h-[1.2em]">
        {#if saving}
          {t(locale, 'notes.saving')}
        {:else if errored}
          {t(locale, 'notes.save_error')}
        {:else if saved}
          ✓ {t(locale, 'notes.saved')}
        {/if}
      </p>
      <button
        type="button"
        class="text-xs uppercase tracking-wider font-serif-bold no-underline hover:underline"
        onclick={closeEditor}
      >
        {t(locale, 'notes.close')}
      </button>
    </div>
  </div>
</dialog>

<style>
  /* Desktop default: centered modal, capped width.
     Explicit `inset: 0` + `margin: auto` to keep centering even when other
     scoped/utility styles win specificity over the UA `dialog:modal` rules. */
  .note-dialog {
    width: 500px;
    max-width: 90vw;
    inset: 0;
    margin: auto;
  }
  .note-dialog[open] {
    animation: fade-in 150ms ease-out;
  }
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Mobile: bottom sheet — pinned to viewport bottom, full width. */
  @media (max-width: 499px) {
    .note-dialog {
      width: 100%;
      max-width: 100%;
      margin: auto auto 0; /* push to bottom edge */
      border-bottom: none;
      border-left: none;
      border-right: none;
    }
    .note-dialog[open] {
      animation: slide-up 200ms ease-out;
    }
    @keyframes slide-up {
      from {
        transform: translateY(100%);
      }
      to {
        transform: translateY(0);
      }
    }
  }

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
  .dots-frame::-webkit-resizer {
    display: none;
  }
  .dots-frame::-webkit-scrollbar {
    display: none;
  }
</style>
