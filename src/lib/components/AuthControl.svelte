<script lang="ts">
  import { signIn, signOut } from '@auth/sveltekit/client';
  import { page } from '$app/state';
  import { resolveLocale, t } from '$lib/i18n';

  const locale = $derived(resolveLocale(page.params.lang));
  const session = $derived(
    page.data.session as { user?: { email?: string; name?: string } } | null
  );
  const isSignedIn = $derived(!!session?.user);

  function toggle() {
    if (isSignedIn) signOut();
    else signIn('google');
  }
</script>

<div class="grid place-content-center">
  <button
    type="button"
    class="flex items-center p-0 bg-transparent border-none cursor-pointer active:translate-y-px focus-visible:outline-none focus-visible:rounded-full"
    aria-label={t(locale, isSignedIn ? 'auth.signout' : 'auth.signin')}
    title={isSignedIn ? (session?.user?.email ?? '') : t(locale, 'auth.signin')}
    onclick={toggle}
  >
    <span
      class="w-[1.6rem] h-[1.6rem] transition-transform duration-100 ease-in-out hover:scale-[1.15] hover:rotate-[5deg]"
      aria-hidden="true"
    >
      <svg
        class="w-full h-auto"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
      >
        {#if isSignedIn}
          <!-- Door / exit icon (Sign out) -->
          <g>
            <path
              d="M9 17h-5a2 2 0 01-2-2v-10a2 2 0 012-2h5"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M13 14l4-4-4-4M17 10h-9"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </g>
        {:else}
          <!-- User silhouette (Sign in) -->
          <g>
            <circle cx="10" cy="7.5" r="3" fill="none" stroke-linecap="round" stroke-linejoin="round" />
            <path
              d="M3.5 17c0-3.6 2.9-5.6 6.5-5.6s6.5 2 6.5 5.6"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </g>
        {/if}
      </svg>
    </span>
  </button>
</div>

<style>
  svg :global(circle),
  svg :global(path) {
    stroke: var(--color-ink);
    vector-effect: none;
  }
</style>
