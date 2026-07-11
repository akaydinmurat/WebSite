"use client";

import { useRef, type ReactNode } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap, useGSAP } from "@/lib/animation/gsap";

export function ProjectReelMotion({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (!rootRef.current || reducedMotion) return;

      const mediaQuery = gsap.matchMedia();

      mediaQuery.add(
        "(min-width: 768px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)",
        () => {
          const cards = gsap.utils.toArray<HTMLElement>("[data-reel-card]", rootRef.current);

          cards.forEach((card, index) => {
            const media = card.querySelector<HTMLElement>("[data-reel-media-motion]");
            const shade = card.querySelector<HTMLElement>("[data-reel-shade]");
            const item = card.closest<HTMLElement>(".project-reel-item");

            if (media && item) {
              gsap.fromTo(
                media,
                { scale: 1.055 },
                {
                  scale: 1,
                  ease: "none",
                  scrollTrigger: {
                    trigger: item,
                    start: "top 94%",
                    end: "top 18%",
                    scrub: 0.4,
                    invalidateOnRefresh: true,
                  },
                },
              );
            }

            const nextItem = cards[index + 1]?.closest<HTMLElement>(".project-reel-item");
            if (shade && nextItem) {
              gsap.fromTo(
                shade,
                { opacity: 0 },
                {
                  opacity: 0.28,
                  ease: "none",
                  scrollTrigger: {
                    trigger: nextItem,
                    start: "top 92%",
                    end: "top 24%",
                    scrub: 0.4,
                    invalidateOnRefresh: true,
                  },
                },
              );
            }
          });
        },
      );

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
