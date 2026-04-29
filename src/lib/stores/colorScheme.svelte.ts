const KEY = 'user-color-scheme';

type Scheme = 'light' | 'dark';

function readSystem(): Scheme {
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue('--color-mode')
    .replace(/['"]/g, '')
    .trim();
  return v === 'dark' ? 'dark' : 'light';
}

let scheme = $state<Scheme | null>(null);

export const colorScheme = {
  get value(): Scheme | null {
    return scheme;
  },
  init() {
    const stored = localStorage.getItem(KEY);
    if (stored === 'light' || stored === 'dark') {
      scheme = stored;
    }
  },
  toggle() {
    const current: Scheme = scheme ?? readSystem();
    const next: Scheme = current === 'dark' ? 'light' : 'dark';
    scheme = next;
    localStorage.setItem(KEY, next);
    document.documentElement.setAttribute('data-user-color-scheme', next);
  }
};
