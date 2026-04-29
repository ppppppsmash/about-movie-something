<script lang="ts">
  let { chapter, title }: { chapter: string; title: string } = $props();
</script>

<header class="text-center mb-16">
  <p class="my-[2em]">{chapter}</p>
  <h1 class="font-display text-lg leading-tight">{title}</h1>
</header>
