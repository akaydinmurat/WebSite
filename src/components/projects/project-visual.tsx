"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";

import { useFinePointer } from "@/hooks/use-pointer-capability";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { ProjectVisual as ProjectVisualType } from "@/types";
import { cn } from "@/lib/utils";

const projectImages: Record<string, string> = {
  "sessiz-esik": "/images/placeholders/sessiz-esik.svg",
  "katmanli-isik": "/images/placeholders/katmanli-isik.svg",
  "yumusak-ufuk": "/images/placeholders/yumusak-ufuk.svg",
  "golge-odasi": "/images/placeholders/golge-odasi.svg",
  "mineral-sessizlik": "/images/placeholders/mineral-sessizlik.svg",
};

export function ProjectVisual({
  visual,
  projectSlug,
  className,
  eager = false,
}: {
  visual: ProjectVisualType;
  projectSlug?: string;
  className?: string;
  eager?: boolean;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const finePointer = useFinePointer();
  const reducedMotion = useReducedMotion();
  const imageSrc =
    (projectSlug && projectImages[projectSlug]) || "/images/placeholders/placeholder-plan.svg";

  useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    },
    [],
  );

  const style = {
    "--visual-background": visual.background,
    aspectRatio: visual.aspectRatio,
    position: "relative",
  } as CSSProperties;

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!finePointer || reducedMotion || frameRef.current !== null) return;
    const { clientX, clientY, currentTarget } = event;

    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      const rect = currentTarget.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width - 0.5;
      const y = (clientY - rect.top) / rect.height - 0.5;
      rootRef.current?.style.setProperty("--parallax-x", `${x * 10}px`);
      rootRef.current?.style.setProperty("--parallax-y", `${y * 10}px`);
    });
  };

  const reset = () => {
    rootRef.current?.style.setProperty("--parallax-x", "0px");
    rootRef.current?.style.setProperty("--parallax-y", "0px");
  };

  return (
    <div
      ref={rootRef}
      className={cn("architectural-visual fine-noise group", className)}
      style={style}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
    >
      <Image
        src={imageSrc}
        alt={visual.alt}
        fill
        preload={eager}
        unoptimized
        sizes="(max-width: 768px) 100vw, (max-width: 1440px) 80vw, 1200px"
        className="project-visual-image object-cover opacity-75 mix-blend-luminosity transition-transform duration-700 ease-out group-hover:opacity-90 motion-safe:translate-x-[var(--parallax-x,0px)] motion-safe:translate-y-[var(--parallax-y,0px)]"
      />
      <div className="absolute inset-0 z-[1] bg-[linear-gradient(115deg,rgba(23,22,20,.2),transparent_48%,rgba(238,213,177,.15))]" />
      <span className="absolute right-4 bottom-4 z-[3] border border-white/30 bg-black/15 px-2 py-1 text-[0.58rem] font-semibold tracking-[0.14em] text-white uppercase backdrop-blur-sm">
        Demo Görsel
      </span>
    </div>
  );
}
