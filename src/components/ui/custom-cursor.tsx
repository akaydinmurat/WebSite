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

    const root = document.documentElement;
    root.setAttribute("data-cursor", "enhanced");

    const update = () => {
      frameRef.current = null;
      cursorRef.current?.style.setProperty(
        "transform",
        `translate3d(${pointRef.current.x}px, ${pointRef.current.y}px, 0) translate(-50%, -50%)`,
      );
      cursorRef.current?.setAttribute("data-visible", "true");
    };

    const hide = () => cursorRef.current?.setAttribute("data-visible", "false");

    const handlePointerMove = (event: MouseEvent) => {
      pointRef.current = { x: event.clientX, y: event.clientY };
      if (frameRef.current === null) frameRef.current = requestAnimationFrame(update);
    };

    const handlePointerOver = (event: PointerEvent) => {
      const element = event.target instanceof Element ? event.target : null;
      const target = element?.closest<HTMLElement>("[data-cursor-label], a, button");
      const theme = element?.closest<HTMLElement>("[data-cursor-theme]")?.dataset.cursorTheme;
      const label = target?.dataset.cursorLabel ?? "";

      cursorRef.current?.setAttribute("data-active", target ? "true" : "false");
      cursorRef.current?.setAttribute("data-label", label ? "true" : "false");
      cursorRef.current?.setAttribute("data-theme", theme === "dark" ? "dark" : "light");
      if (labelRef.current) labelRef.current.textContent = label;
    };

    const handlePointerDown = () => cursorRef.current?.setAttribute("data-pressed", "true");
    const handlePointerUp = () => cursorRef.current?.setAttribute("data-pressed", "false");
    const handleVisibility = () => {
      if (document.hidden) hide();
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    window.addEventListener("blur", hide);
    document.addEventListener("pointerover", handlePointerOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", hide);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      root.removeAttribute("data-cursor");
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("blur", hide);
      document.removeEventListener("pointerover", handlePointerOver);
      document.documentElement.removeEventListener("pointerleave", hide);
      document.removeEventListener("visibilitychange", handleVisibility);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [finePointer, reducedMotion]);

  if (!finePointer || reducedMotion) return null;

  return (
    <div
      ref={cursorRef}
      className="custom-cursor pointer-events-none fixed top-0 left-0 z-[var(--z-cursor)] grid place-items-center"
      data-active="false"
      data-label="false"
      data-theme="light"
      data-visible="false"
      aria-hidden="true"
    >
      <span className="custom-cursor-ring" />
      <span className="custom-cursor-dot" />
      <span ref={labelRef} className="custom-cursor-label" />
    </div>
  );
}
