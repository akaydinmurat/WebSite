export type PointerSnapshot = Readonly<{
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
  active: boolean;
}>;

type PointerListener = (snapshot: PointerSnapshot) => void;

const listeners = new Set<PointerListener>();

let currentSnapshot: PointerSnapshot = {
  x: 0,
  y: 0,
  normalizedX: 0,
  normalizedY: 0,
  active: false,
};

export function getPointerSnapshot() {
  return currentSnapshot;
}

export function publishPointerSnapshot(snapshot: PointerSnapshot) {
  currentSnapshot = snapshot;
  listeners.forEach((listener) => listener(currentSnapshot));
}

export function resetPointerSnapshot(x = 0, y = 0) {
  publishPointerSnapshot({
    x,
    y,
    normalizedX: 0,
    normalizedY: 0,
    active: false,
  });
}

export function subscribeToPointer(listener: PointerListener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}
