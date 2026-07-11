"use client";

import { useSyncExternalStore } from "react";

export function useMediaQuery(query: string, serverFallback = false) {
  return useSyncExternalStore(
    (onStoreChange) => {
      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener("change", onStoreChange);

      return () => mediaQuery.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia(query).matches,
    () => serverFallback,
  );
}
