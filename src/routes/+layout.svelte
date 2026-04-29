<script lang="ts">
  import '../app.css';
  let { children } = $props();
</script>

{@render children()}

<footer class="text-center text-xs font-serif-light pb-[var(--content-padding)]">
  Created by <a href="https://kurosawa.fun" target="_blank" rel="noopener noreferrer">a.kurosawa</a>
</footer>
