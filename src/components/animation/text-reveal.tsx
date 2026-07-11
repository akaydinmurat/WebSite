"use client";

import { useRef, type HTMLAttributes, type ReactNode } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap, useGSAP } from "@/lib/animation/gsap";
import { cn } from "@/lib/utils";

export function TextReveal({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const element = root.current;
      if (!element || reducedMotion) return;

      gsap.fromTo(
        element,
        { autoAlpha: 0, yPercent: 16 },
        {
          autoAlpha: 1,
          yPercent: 0,
          duration: 1.15,
          ease: "power4.out",
          scrollTrigger: { trigger: element, start: "top 90%", once: true },
        },
      );
    },
    { scope: root, dependencies: [reducedMotion], revertOnUpdate: true },
  );

  return (
    <div ref={root} className={cn(className)} {...props}>
      {children}
    </div>
  );
}
