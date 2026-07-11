"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";

import { siteConfig } from "@/config/site";
import { useFinePointer } from "@/hooks/use-pointer-capability";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const WebGLHero = dynamic(
  () => import("@/components/webgl/webgl-hero").then((module) => module.WebGLHero),
  {
    ssr: false,
    loading: () => null,
  },
);

const webglEnabled = process.env.NEXT_PUBLIC_ENABLE_WEBGL_HERO === "true";
const defaultPointer = { x: 68, y: 38, nx: 0.18, ny: -0.12 } as const;

export function Hero() {
  const visualRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const finePointer = useFinePointer();
  const reducedMotion = useReducedMotion();
  const copy = siteConfig.copy.hero;

  useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    },
    [],
  );

  function setPointerVariables(x: number, y: number, nx: number, ny: number) {
    visualRef.current?.style.setProperty("--pointer-x", `${x}%`);
    visualRef.current?.style.setProperty("--pointer-y", `${y}%`);
    visualRef.current?.style.setProperty("--pointer-nx", `${nx}`);
    visualRef.current?.style.setProperty("--pointer-ny", `${ny}`);
  }

  function handlePointerMove(event: React.MouseEvent<HTMLElement>) {
    if (!finePointer || reducedMotion || frameRef.current !== null) return;
    const { clientX, clientY, currentTarget } = event;

    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      const rect = currentTarget.getBoundingClientRect();
      const x = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
      const y = Math.min(100, Math.max(0, ((clientY - rect.top) / rect.height) * 100));
      setPointerVariables(x, y, x / 100 - 0.5, y / 100 - 0.5);
    });
  }

  function handlePointerLeave() {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    setPointerVariables(defaultPointer.x, defaultPointer.y, defaultPointer.nx, defaultPointer.ny);
  }

  return (
    <section
      className="relative min-h-[max(100svh,46rem)] overflow-hidden bg-[var(--color-night)] text-[var(--color-paper)]"
      data-cursor-theme="dark"
      onMouseLeave={handlePointerLeave}
      onMouseMove={handlePointerMove}
    >
      <div ref={visualRef} className="hero-stage absolute inset-0">
        <Image
          src="/images/placeholders/hero-architecture.svg"
          alt={copy.visualAlt}
          fill
          preload
          unoptimized
          sizes="100vw"
          className="hero-muted-layer object-cover"
        />

        <div className="hero-reveal-layer absolute inset-[-2%]">
          <Image
            src="/images/placeholders/hero-architecture.svg"
            alt=""
            fill
            loading="eager"
            unoptimized
            sizes="100vw"
            className="object-cover contrast-[1.06] saturate-[1.22]"
          />
        </div>

        <div className="hero-drawing-grid pointer-events-none absolute inset-0" />
        <div className="hero-light-field pointer-events-none absolute inset-[-4%]" />
        <span className="hero-slab hero-slab-a pointer-events-none" />
        <span className="hero-slab hero-slab-b pointer-events-none" />
        <span className="hero-lens-ring" />
        {webglEnabled ? <WebGLHero /> : null}
        <div className="fine-noise pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(9,9,8,.82)_0%,rgba(12,10,8,.12)_58%,rgba(16,11,9,.44)_100%)]" />
      </div>

      <span className="hero-side-note absolute top-1/2 right-4 z-10 hidden -translate-y-1/2 text-[0.54rem] tracking-[0.22em] text-white/42 uppercase lg:block">
        Işık · Doku · İşlev · Yaşam
      </span>

      <div className="site-shell relative z-10 flex min-h-[max(100svh,46rem)] flex-col justify-end pt-36 pb-7">
        <div className="editorial-grid items-end gap-y-10">
          <div className="col-span-12 md:col-span-9 xl:col-span-8">
            <p className="mb-7 flex items-center gap-4 text-[0.63rem] font-semibold tracking-[0.2em] text-white/72 uppercase">
              <span className="h-px w-10 bg-[var(--color-accent-warm)]" />
              {copy.eyebrow}
            </p>
            <h1 className="display-title max-w-[11ch]">{copy.title}</h1>
          </div>

          <div className="col-span-12 md:col-span-4 md:col-start-9 xl:col-span-3 xl:col-start-10">
            <p className="mb-7 text-base leading-relaxed text-white/80">{copy.description}</p>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              <Link href="/projects" className="text-link">
                {copy.primaryActionLabel} <ArrowUpRight aria-hidden="true" size={15} />
              </Link>
              <Link href="/contact" className="text-link text-white/72">
                {copy.secondaryActionLabel}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-[1fr_auto] items-end gap-6 border-t border-white/28 pt-4 text-[0.59rem] font-semibold tracking-[0.17em] text-white/62 uppercase sm:grid-cols-3">
          <span>39.9334° N · 32.8597° E</span>
          <a
            href="#featured-projects"
            className="flex min-h-11 items-center gap-3 sm:justify-self-center"
          >
            {copy.scrollLabel} <ArrowDown aria-hidden="true" size={14} />
          </a>
          <span className="hidden justify-self-end sm:inline">Portföy / 2023—2024</span>
        </div>
      </div>
    </section>
  );
}
