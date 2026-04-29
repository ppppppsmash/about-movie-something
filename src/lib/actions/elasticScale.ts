import type { Action } from 'svelte/action';

export const elasticScale: Action<HTMLElement> = (node) => {
  const initialAppWidth = node.offsetWidth;
  let lastInnerWidth = window.innerWidth;
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const ro = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const w = entry.contentRect.width;
      const scale = Math.max(
        0.01,
        (w - lastInnerWidth) / initialAppWidth + 1
      );
      node.style.transform = `scale(${scale}, 1)`;

      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        lastInnerWidth = window.innerWidth;
        node.style.transform = 'scale(1, 1)';
      }, 200);
    }
  });
  ro.observe(document.body);

  return {
    destroy() {
      ro.disconnect();
      if (timeout) clearTimeout(timeout);
    }
  };
};
