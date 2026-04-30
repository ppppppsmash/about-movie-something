const KEY = 'user-theme';

export type Theme = 'noir' | 'vintage' | 'original';
export const themes: Theme[] = ['noir', 'vintage', 'original'];
const DEFAULT: Theme = 'noir';

let current = $state<Theme>(DEFAULT);

export const theme = {
  get value(): Theme {
    return current;
  },
  init() {
    const stored = localStorage.getItem(KEY);
    if (stored && (themes as string[]).includes(stored)) {
      current = stored as Theme;
    }
  },
  set(next: Theme) {
    current = next;
    localStorage.setItem(KEY, next);
    if (next === DEFAULT) {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', next);
    }
  },
  cycle() {
    const idx = themes.indexOf(current);
    const next = themes[(idx + 1) % themes.length];
    this.set(next);
  }
};
