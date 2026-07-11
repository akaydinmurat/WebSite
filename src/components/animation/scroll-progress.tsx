"use client";

import { useEffect, useRef } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const update = () => {
      frameRef.current = null;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      barRef.current?.style.setProperty("transform", `scaleX(${progress})`);
    };

    const requestUpdate = () => {
      if (frameRef.current === null) frameRef.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [reducedMotion]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[80] h-px" aria-hidden="true">
      <div ref={barRef} className="h-full origin-left scale-x-0 bg-[var(--color-accent)]" />
    </div>
  );
}
