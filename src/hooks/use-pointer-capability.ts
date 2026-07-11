"use client";

import { useMediaQuery } from "@/hooks/use-media-query";

export function useFinePointer() {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}
