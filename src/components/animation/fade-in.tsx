"use client";

import { useRef, type HTMLAttributes, type ReactNode } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import { gsap, useGSAP } from "@/lib/animation/gsap";

type FadeInProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  delay?: number;
  distance?: number;
};

export function FadeIn({ children, className, delay = 0, distance = 24, ...props }: FadeInProps) {
  const root = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (!root.current || reducedMotion) return;

      gsap.fromTo(
        root.current,
        { autoAlpha: 0, y: distance },
        {
          autoAlpha: 1,
          y: 0,
          delay,
          duration: 0.95,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root.current,
            start: "top 88%",
            once: true,
          },
        },
      );
    },
    { scope: root, dependencies: [delay, distance, reducedMotion] },
  );

  return (
    <div ref={root} className={cn(className)} {...props}>
      {children}
    </div>
  );
}
