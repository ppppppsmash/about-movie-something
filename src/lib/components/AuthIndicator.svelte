<script lang="ts">
  import { signIn, signOut } from '@auth/sveltekit/client';
  import { page } from '$app/state';
  import { resolveLocale, localePath, t } from '$lib/i18n';
  import { handleFor } from '$lib/handle';

  const locale = $derived(resolveLocale(page.params.lang));
  const session = $derived(
    page.data.session as { user?: { email?: string; name?: string } } | null
  );
  const isSignedIn = $derived(!!session?.user?.email);
  const handle = $derived(session?.user?.email ? handleFor(session.user.email) : '');

  let menuOpen = $state(false);
  let root = $state<HTMLDivElement | null>(null);

  function close() {
    menuOpen = false;
  }

  function onWindowClick(e: MouseEvent) {
    if (!menuOpen) return;
    if (root && !root.contains(e.target as Node)) close();
  }
</script>

<div
  bind:this={root}
  class="auth-indicator fixed top-3 right-3 z-30 text-xs font-serif-light [.no-js_&]:hidden"
>
  {#if isSignedIn}
    <button
      type="button"
      class="px-2 py-1 border border-mute hover:border-ink bg-paper text-ink no-underline tracking-wider transition-colors"
      onclick={() => (menuOpen = !menuOpen)}
      aria-haspopup="menu"
      aria-expanded={menuOpen}
    >
      @{handle}
    </button>
    {#if menuOpen}
      <div
        class="absolute right-0 mt-1 min-w-[10rem] border border-ink bg-paper text-ink shadow-[3px_3px_0_var(--color-ink)]"
        role="menu"
      >
        <a
          href={localePath(locale, `/u/${handle}`)}
          class="block px-3 py-2 no-underline hover:bg-mute/20"
          onclick={close}
          role="menuitem"
        >
          {t(locale, 'header.users')}
        </a>
        <button
          type="button"
          class="block w-full px-3 py-2 text-left hover:bg-mute/20"
          onclick={() => {
            close();
            signOut();
          }}
          role="menuitem"
        >
          {t(locale, 'auth.signout')}
        </button>
      </div>
    {/if}
  {:else}
    <button
      type="button"
      class="px-2 py-1 border border-mute hover:border-ink bg-paper text-ink tracking-wider transition-colors"
      onclick={() => signIn('google')}
    >
      {t(locale, 'auth.signin')}
    </button>
  {/if}
</div>

<svelte:window onclick={onWindowClick} />
