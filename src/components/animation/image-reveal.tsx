"use client";

import { useRef, type HTMLAttributes, type ReactNode } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap, useGSAP } from "@/lib/animation/gsap";
import { cn } from "@/lib/utils";

export function ImageReveal({
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

      gsap.fromTo(
        root.current,
        { clipPath: "inset(0 0 100% 0)" },
        {
          clipPath: "inset(0 0 0% 0)",
          duration: 1.05,
          ease: "power3.inOut",
          scrollTrigger: { trigger: root.current, start: "top 88%", once: true },
        },
      );

      if (media) {
        gsap.fromTo(media, { scale: 1.08 }, { scale: 1, duration: 1.4, ease: "power3.out" });
      }
    },
    { scope: root, dependencies: [reducedMotion], revertOnUpdate: true },
  );

  return (
    <div ref={root} className={cn("overflow-hidden", className)} {...props}>
      {children}
    </div>
  );
}
