"use client";

import { useEffect, useRef } from "react";

import { useFinePointer } from "@/hooks/use-pointer-capability";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const frameRef = useRef<number | null>(null);
  const pointRef = useRef({ x: -100, y: -100 });
  const finePointer = useFinePointer();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!finePointer || reducedMotion) return;

    const update = () => {
      frameRef.current = null;
      cursorRef.current?.style.setProperty(
        "transform",
        `translate3d(${pointRef.current.x}px, ${pointRef.current.y}px, 0) translate(-50%, -50%)`,
      );
      cursorRef.current?.style.setProperty("opacity", "1");
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointRef.current = { x: event.clientX, y: event.clientY };
      if (frameRef.current === null) frameRef.current = requestAnimationFrame(update);
    };

    const handlePointerOver = (event: PointerEvent) => {
      const target =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>("[data-cursor-label], a, button")
          : null;
      const label = target?.dataset.cursorLabel ?? "";
      cursorRef.current?.toggleAttribute("data-active", Boolean(target));
      cursorRef.current?.toggleAttribute("data-label", Boolean(label));
      if (labelRef.current) labelRef.current.textContent = label;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("pointerover", handlePointerOver, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerover", handlePointerOver);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [finePointer, reducedMotion]);

  if (!finePointer || reducedMotion) return null;

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 z-[var(--z-cursor)] grid size-3 place-items-center rounded-full border border-white/50 bg-[var(--color-accent)] text-[var(--color-paper)] shadow-lg transition-[width,height,background-color] duration-300 ease-out data-[active]:size-10 data-[label]:h-20 data-[label]:w-20"
      style={{ opacity: 0, transform: "translate3d(-100px, -100px, 0)" }}
      aria-hidden="true"
    >
      <span
        ref={labelRef}
        className="max-w-16 text-center text-[0.55rem] leading-tight font-semibold tracking-[0.08em] uppercase"
      />
    </div>
  );
}
