<script lang="ts">
  import { page } from '$app/state';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import MovieSearch from '$lib/components/MovieSearch.svelte';
  import { resolveLocale, localePath, t } from '$lib/i18n';
  import type { Movie } from '$lib/data/movies';

  let { data } = $props();

  const locale = $derived(resolveLocale(page.params.lang));

  // Movies that have a note, sorted by Notion's last_edited_time desc.
  const noted = $derived(
    data.movies
      .filter((m: Movie): m is Movie & { note: string } => Boolean(m.note))
      .sort((a, b) => (b.note_updated ?? '').localeCompare(a.note_updated ?? ''))
  );
</script>

<svelte:head>
  <title>Notes — Movie Log</title>
</svelte:head>

<PageHeader chapter="II" title={t(locale, 'header.notes')} />

<div class="mb-12">
  <MovieSearch />
</div>

<main id="content">
  <p class="mb-12 text-center text-sm font-serif-italic">{t(locale, 'notes.subtitle')}</p>

  {#if noted.length === 0}
    <p class="text-center text-sm font-serif-italic">{t(locale, 'notes.empty')}</p>
  {:else}
    <ul class="grid gap-10">
      {#each noted as m}
        <li>
          <a
            href={localePath(locale, `/movies/${m.slug}`)}
            class="flex items-start gap-4 no-underline group"
          >
            {#if m.poster}
              <img
                src={m.poster}
                alt=""
                loading="lazy"
                class="block w-20 h-auto border border-mute grayscale group-hover:grayscale-0 transition-[filter] duration-150"
              />
            {/if}
            <div class="flex-1 leading-tight">
              <h3
                class="font-serif-bold group-hover:underline group-hover:decoration-wavy group-hover:underline-offset-[3px]"
              >
                {m.title}
              </h3>
              <p class="mt-1 text-xs font-serif-light">
                {m.year}{#if m.note_updated} · {m.note_updated.slice(0, 10)}{/if}
              </p>
              <p class="mt-2 text-sm font-serif-light line-clamp-3 whitespace-pre-wrap">
                {m.note}
              </p>
            </div>
          </a>
        </li>
      {/each}
    </ul>
  {/if}
</main>

<Footer />
