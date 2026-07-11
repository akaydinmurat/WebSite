"use client";

import { useRef, type HTMLAttributes, type ReactNode } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap, useGSAP } from "@/lib/animation/gsap";
import { cn } from "@/lib/utils";

export function ParallaxMedia({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (!root.current || reducedMotion) return;
      const media = root.current.firstElementChild;
      if (!media) return;

      gsap.fromTo(
        media,
        { yPercent: -5 },
        {
          yPercent: 5,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        },
      );
    },
    { scope: root, dependencies: [reducedMotion], revertOnUpdate: true },
  );

  return (
    <div ref={root} className={cn("overflow-hidden", className)} {...props}>
      {children}
    </div>
  );
}
