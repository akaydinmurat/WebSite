"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";

import { useFinePointer } from "@/hooks/use-pointer-capability";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  const finePointer = useFinePointer();
  const pathname = usePathname();

  useEffect(() => {
    if (reducedMotion || !finePointer || pathname === "/") return;

    let dispose: (() => void) | undefined;
    let cancelled = false;

    void Promise.all([import("lenis"), import("@/lib/animation/gsap")]).then(
      ([{ default: Lenis }, { gsap, ScrollTrigger }]) => {
        if (cancelled) return;

        const lenis = new Lenis({
          duration: 1.05,
          smoothWheel: true,
          syncTouch: false,
          wheelMultiplier: 0.9,
        });
        const handleScroll = () => ScrollTrigger.update();
        const update = (time: number) => lenis.raf(time * 1000);

        lenis.on("scroll", handleScroll);
        gsap.ticker.add(update);
        gsap.ticker.lagSmoothing(0);
        dispose = () => {
          lenis.off("scroll", handleScroll);
          gsap.ticker.remove(update);
          gsap.ticker.lagSmoothing(500, 33);
          lenis.destroy();
        };
      },
    );

    return () => {
      cancelled = true;
      dispose?.();
    };
  }, [finePointer, pathname, reducedMotion]);

  return children;
}
