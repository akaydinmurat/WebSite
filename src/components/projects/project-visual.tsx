"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";

import { useFinePointer } from "@/hooks/use-pointer-capability";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { ProjectVisual as ProjectVisualType } from "@/types";
import { cn } from "@/lib/utils";

const projectImages: Record<string, string> = {
  "bm-evi-mutfak": "/images/placeholders/katmanli-isik.svg",
  "es-evi-banyo": "/images/placeholders/mineral-sessizlik.svg",
  "aa-evi-yatak-odasi": "/images/placeholders/golge-odasi.svg",
  "sf-evi-genc-odasi": "/images/placeholders/yumusak-ufuk.svg",
  "cd-evi-mutfak": "/images/placeholders/katmanli-isik.svg",
  "gy-evi-salon": "/images/placeholders/sessiz-esik.svg",
  "ag-evi-banyo": "/images/placeholders/mineral-sessizlik.svg",
  "rozzis-chocolate-cafe": "/images/placeholders/yumusak-ufuk.svg",
};

export function ProjectVisual({
  visual,
  projectSlug,
  className,
  eager = false,
  decorative = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1440px) 80vw, 1200px",
  showArchiveLabel = true,
}: {
  visual: ProjectVisualType;
  projectSlug?: string;
  className?: string;
  eager?: boolean;
  decorative?: boolean;
  sizes?: string;
  showArchiveLabel?: boolean;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const pointRef = useRef({ x: 0, y: 0 });
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
    if (!finePointer || reducedMotion) return;

    const rect = event.currentTarget.getBoundingClientRect();
    pointRef.current = {
      x: (event.clientX - rect.left) / rect.width - 0.5,
      y: (event.clientY - rect.top) / rect.height - 0.5,
    };

    if (frameRef.current !== null) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      rootRef.current?.style.setProperty("--parallax-x", `${pointRef.current.x * 10}px`);
      rootRef.current?.style.setProperty("--parallax-y", `${pointRef.current.y * 10}px`);
    });
  };

  const reset = () => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    pointRef.current = { x: 0, y: 0 };
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
      aria-hidden={decorative || undefined}
    >
      <div className="project-visual-parallax">
        <div className="project-visual-scale">
          <Image
            src={imageSrc}
            alt={decorative ? "" : visual.alt}
            fill
            preload={eager}
            unoptimized
            sizes={sizes}
            className="project-visual-image object-cover opacity-80 mix-blend-luminosity"
          />
        </div>
      </div>
      <div className="project-visual-wash" />
      {showArchiveLabel ? (
        <span className="project-visual-status">Arşiv görseli hazırlanıyor</span>
      ) : null}
    </div>
  );
}
