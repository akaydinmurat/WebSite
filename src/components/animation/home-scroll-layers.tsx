"use client";

import { useRef, type ReactNode } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap, useGSAP } from "@/lib/animation/gsap";

export function HomeScrollLayers({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (!rootRef.current || reducedMotion) return;

      const mediaQuery = gsap.matchMedia();
      mediaQuery.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const sections = gsap.utils.toArray<HTMLElement>("[data-layered-section]", rootRef.current);

        sections.forEach((section) => {
          gsap.fromTo(
            section,
            {
              clipPath: "polygon(0 7%, 100% 0, 100% 100%, 0 100%)",
              y: 72,
              scale: 0.988,
            },
            {
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
              y: 0,
              scale: 1,
              ease: "none",
              transformOrigin: "center top",
              scrollTrigger: {
                trigger: section,
                start: "top 96%",
                end: "top 55%",
                scrub: 0.55,
                invalidateOnRefresh: true,
              },
            },
          );
        });
      });

      return () => mediaQuery.revert();
    },
    {
      scope: rootRef,
      dependencies: [reducedMotion],
      revertOnUpdate: true,
    },
  );

  return <div ref={rootRef}>{children}</div>;
}
