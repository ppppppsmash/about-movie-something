<script lang="ts">
  import { page } from '$app/state';

  const tabs = [
    { href: '/movies', label: 'Watched' },
    { href: '/movies/queue', label: 'Queue' },
    { href: '/movies/best', label: 'Best' }
  ];

  function isActive(href: string): boolean {
    const path = page.url.pathname;
    if (href === '/movies') return path === '/movies';
    return path === href || path.startsWith(href + '/');
  }
</script>

<nav class="mb-12 flex justify-between gap-4 text-sm uppercase">
  {#each tabs as { href, label }}
    {@const active = isActive(href)}
    <a
      {href}
      class={active
        ? 'font-serif-bold underline decoration-wavy underline-offset-[3px]'
        : 'font-serif-light no-underline hover:underline'}
      aria-current={active ? 'page' : undefined}
    >{label}</a>
  {/each}
</nav>
