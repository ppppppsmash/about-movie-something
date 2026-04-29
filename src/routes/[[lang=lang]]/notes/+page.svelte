<script lang="ts">
  import { page } from '$app/state';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import MovieSearch from '$lib/components/MovieSearch.svelte';
  import { resolveLocale, localePath, t } from '$lib/i18n';

  let { data } = $props();

  const locale = $derived(resolveLocale(page.params.lang));
  const notes = $derived(data.notes);
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

  {#if notes.length === 0}
    <p class="text-center text-sm font-serif-italic">{t(locale, 'notes.empty')}</p>
  {:else}
    <ul class="grid gap-10">
      {#each notes as note}
        <li>
          <a
            href={localePath(locale, `/movies/${note.movie.slug}`)}
            class="flex items-start gap-4 no-underline group"
          >
            {#if note.movie.poster}
              <img
                src={note.movie.poster}
                alt=""
                loading="lazy"
                class="block w-20 h-auto border border-mute grayscale group-hover:grayscale-0 transition-[filter] duration-150"
              />
            {/if}
            <div class="flex-1 leading-tight">
              <h3
                class="font-serif-bold group-hover:underline group-hover:decoration-wavy group-hover:underline-offset-[3px]"
              >
                {note.movie.title}
              </h3>
              <p class="mt-1 text-xs font-serif-light flex flex-wrap gap-x-2">
                <span>{note.movie.year}</span>
                {#if note.updated}<span>{note.updated.slice(0, 10)}</span>{/if}
                <span class="font-serif-italic">
                  — {note.is_own ? t(locale, 'notes.by_you') : note.author}
                </span>
                {#if note.is_public}
                  <span class="uppercase tracking-wider text-mute">{t(locale, 'notes.public')}</span>
                {/if}
              </p>
              <p class="mt-2 text-sm font-serif-light line-clamp-3 whitespace-pre-wrap">
                {note.text}
              </p>
            </div>
          </a>
        </li>
      {/each}
    </ul>
  {/if}
</main>

<Footer />
