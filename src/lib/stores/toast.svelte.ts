export type ToastKind = 'success' | 'error';
export type ToastEntry = { id: number; message: string; kind: ToastKind };

let nextId = 1;
let entries = $state<ToastEntry[]>([]);

export const toast = {
  get list(): ToastEntry[] {
    return entries;
  },
  show(message: string, kind: ToastKind = 'success', durationMs = 2500) {
    const id = nextId++;
    entries = [...entries, { id, message, kind }];
    setTimeout(() => {
      entries = entries.filter((e) => e.id !== id);
    }, durationMs);
  },
  dismiss(id: number) {
    entries = entries.filter((e) => e.id !== id);
  }
};
