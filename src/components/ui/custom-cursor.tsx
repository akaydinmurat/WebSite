"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import { useFinePointer } from "@/hooks/use-pointer-capability";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { publishPointerSnapshot } from "@/lib/animation/pointer-store";

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
    const root = document.documentElement;
    const cursor = cursorRef.current;

    const setPointerVariables = ({ x, y }: { x: number; y: number }, active = false) => {
      const viewportWidth = Math.max(window.innerWidth, 1);
      const viewportHeight = Math.max(window.innerHeight, 1);
      const normalizedX = Math.min(0.5, Math.max(-0.5, x / viewportWidth - 0.5));
      const normalizedY = Math.min(0.5, Math.max(-0.5, y / viewportHeight - 0.5));

      root.style.setProperty("--pointer-vx", `${x}px`);
      root.style.setProperty("--pointer-vy", `${y}px`);
      root.style.setProperty("--pointer-nx", normalizedX.toFixed(4));
      root.style.setProperty("--pointer-ny", normalizedY.toFixed(4));
      root.style.setProperty("--surface-shift-x", `${(normalizedX * 48).toFixed(2)}px`);
      root.style.setProperty("--surface-shift-y", `${(normalizedY * 32).toFixed(2)}px`);
      root.style.setProperty("--surface-shift-x-reverse", `${(normalizedX * -32).toFixed(2)}px`);
      root.style.setProperty("--surface-shift-y-reverse", `${(normalizedY * -22).toFixed(2)}px`);
      root.style.setProperty("--surface-tilt", `${(normalizedX * 3).toFixed(2)}deg`);
      root.style.setProperty("--about-pointer-x", `${(normalizedX * 24).toFixed(2)}px`);
      root.style.setProperty("--about-pointer-y", `${(normalizedY * 16).toFixed(2)}px`);
      root.style.setProperty("--about-pointer-x-reverse", `${(normalizedX * -18).toFixed(2)}px`);
      root.style.setProperty("--about-pointer-y-reverse", `${(normalizedY * -12).toFixed(2)}px`);
      publishPointerSnapshot({
        x,
        y,
        normalizedX,
        normalizedY,
        active,
      });
    };

    const resetPointerVariables = () => {
      pointRef.current = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      };
      setPointerVariables(pointRef.current, false);
    };

    resetPointerVariables();

    if (!finePointer || reducedMotion) {
      root.removeAttribute("data-cursor");
      return resetPointerVariables;
    }

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
      setPointerVariables(pointRef.current, true);
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

    const hide = () => {
      cursorRef.current?.setAttribute("data-visible", "false");
      reset();
      resetPointerVariables();
    };

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
    const handleResize = () => {
      if (cursorRef.current?.dataset.visible === "true") {
        setPointerVariables(pointRef.current, true);
      } else {
        resetPointerVariables();
      }
    };

    reset();
    cursor?.setAttribute("data-ready", "true");
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    window.addEventListener("pointercancel", handlePointerUp, { passive: true });
    window.addEventListener("blur", hide);
    window.addEventListener("resize", handleResize, { passive: true });
    document.addEventListener("pointerover", handlePointerOver, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);
    document.documentElement.addEventListener("pointerleave", hide);

    return () => {
      cursor?.setAttribute("data-ready", "false");
      root.removeAttribute("data-cursor");
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
      window.removeEventListener("blur", hide);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("visibilitychange", handleVisibility);
      document.documentElement.removeEventListener("pointerleave", hide);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      resetPointerVariables();
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
      <span className="custom-cursor-frame">
        <i className="custom-cursor-axis custom-cursor-axis-x" />
        <i className="custom-cursor-axis custom-cursor-axis-y" />
        <i className="custom-cursor-axis custom-cursor-axis-z" />
      </span>
      <span className="custom-cursor-dot" />
      <span ref={labelRef} className="custom-cursor-label" />
      <span ref={coordinateRef} className="custom-cursor-coordinates" />
    </div>
  );
}
