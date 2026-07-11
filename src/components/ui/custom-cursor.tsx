"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import { useFinePointer } from "@/hooks/use-pointer-capability";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const coordinateRef = useRef<HTMLSpanElement>(null);
  const frameRef = useRef<number | null>(null);
  const pointRef = useRef({ x: -100, y: -100 });
  const finePointer = useFinePointer();
  const reducedMotion = useReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    if (!finePointer || reducedMotion) return;

    const root = document.documentElement;
    const cursor = cursorRef.current;

    const reset = () => {
      cursorRef.current?.setAttribute("data-active", "false");
      cursorRef.current?.setAttribute("data-label", "false");
      cursorRef.current?.setAttribute("data-kind", "default");
      cursorRef.current?.setAttribute("data-pressed", "false");
      if (labelRef.current) labelRef.current.textContent = "";
    };

    const update = () => {
      frameRef.current = null;
      root.setAttribute("data-cursor", "enhanced");
      cursorRef.current?.style.setProperty(
        "transform",
        `translate3d(${pointRef.current.x}px, ${pointRef.current.y}px, 0) translate(-50%, -50%)`,
      );
      cursorRef.current?.setAttribute("data-visible", "true");
      if (coordinateRef.current) {
        coordinateRef.current.textContent = `X ${Math.round(pointRef.current.x)
          .toString()
          .padStart(4, "0")} / Y ${Math.round(pointRef.current.y).toString().padStart(4, "0")}`;
      }
    };

    const hide = () => cursorRef.current?.setAttribute("data-visible", "false");

    const handlePointerMove = (event: PointerEvent) => {
      pointRef.current = { x: event.clientX, y: event.clientY };
      if (frameRef.current === null) frameRef.current = requestAnimationFrame(update);
    };

    const handlePointerOver = (event: PointerEvent) => {
      const element = event.target instanceof Element ? event.target : null;
      const nativeTarget = element?.closest(
        "input, textarea, select, iframe, [contenteditable='true']",
      );
      const target = element?.closest<HTMLElement>("[data-cursor-label], a, button");
      const theme = element?.closest<HTMLElement>("[data-cursor-theme]")?.dataset.cursorTheme;
      const label = target?.dataset.cursorLabel ?? "";
      const index = target?.dataset.cursorIndex ?? "";
      const kind = nativeTarget
        ? "native"
        : (target?.dataset.cursorKind ?? (target ? "action" : "default"));
      const fullLabel = [label, index].filter(Boolean).join(" / ");

      cursorRef.current?.setAttribute("data-active", target && !nativeTarget ? "true" : "false");
      cursorRef.current?.setAttribute("data-label", fullLabel ? "true" : "false");
      cursorRef.current?.setAttribute("data-kind", kind);
      cursorRef.current?.setAttribute("data-theme", theme === "dark" ? "dark" : "light");
      if (labelRef.current) labelRef.current.textContent = fullLabel;
    };

    const handlePointerDown = () => cursorRef.current?.setAttribute("data-pressed", "true");
    const handlePointerUp = () => cursorRef.current?.setAttribute("data-pressed", "false");
    const handleVisibility = () => {
      if (document.hidden) hide();
    };

    reset();
    cursor?.setAttribute("data-ready", "true");
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    window.addEventListener("pointercancel", handlePointerUp, { passive: true });
    window.addEventListener("blur", hide);
    document.addEventListener("pointerover", handlePointerOver, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cursor?.setAttribute("data-ready", "false");
      root.removeAttribute("data-cursor");
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
      window.removeEventListener("blur", hide);
      document.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("visibilitychange", handleVisibility);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [finePointer, pathname, reducedMotion]);

  if (!finePointer || reducedMotion) return null;

  return (
    <div
      ref={cursorRef}
      className="custom-cursor pointer-events-none fixed top-0 left-0 z-[var(--z-cursor)]"
      data-active="false"
      data-label="false"
      data-kind="default"
      data-ready="false"
      data-theme="light"
      data-visible="false"
      aria-hidden="true"
    >
      <span className="custom-cursor-frame" />
      <span className="custom-cursor-dot" />
      <span ref={labelRef} className="custom-cursor-label" />
      <span ref={coordinateRef} className="custom-cursor-coordinates" />
    </div>
  );
}
