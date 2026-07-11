"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useRef } from "react";

import { useFinePointer } from "@/hooks/use-pointer-capability";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { siteConfig } from "@/config/site";

const WebGLHero = dynamic(
  () => import("@/components/webgl/webgl-hero").then((module) => module.WebGLHero),
  {
    ssr: false,
    loading: () => null,
  },
);

const webglEnabled = process.env.NEXT_PUBLIC_ENABLE_WEBGL_HERO === "true";

export function Hero() {
  const visualRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const finePointer = useFinePointer();
  const reducedMotion = useReducedMotion();
  const copy = siteConfig.copy.hero;

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!finePointer || reducedMotion || frameRef.current !== null) return;
    const { clientX, clientY, currentTarget } = event;

    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      const rect = currentTarget.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;
      visualRef.current?.style.setProperty("--reveal-x", `${x}%`);
      visualRef.current?.style.setProperty("--reveal-y", `${y}%`);
    });
  };

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[var(--color-night)] text-[var(--color-paper)]">
      <div className="absolute inset-0" onPointerMove={handlePointerMove}>
        <Image
          src="/images/placeholders/hero-architecture.svg"
          alt={copy.visualAlt}
          fill
          preload
          unoptimized
          sizes="100vw"
          className="hero-muted-layer object-cover"
        />
        <div ref={visualRef} className="hero-reveal-layer absolute inset-0">
          <Image
            src="/images/placeholders/hero-architecture.svg"
            alt=""
            fill
            loading="eager"
            unoptimized
            sizes="100vw"
            className="object-cover"
          />
        </div>
        {webglEnabled ? <WebGLHero /> : null}
        <div className="fine-noise absolute inset-0 bg-[linear-gradient(90deg,rgba(14,15,14,.72)_0%,rgba(14,15,14,.18)_58%,rgba(14,15,14,.38)_100%)]" />
      </div>

      <div className="site-shell relative z-10 flex min-h-[100svh] flex-col justify-end pt-32 pb-7">
        <div className="editorial-grid items-end gap-y-10">
          <div className="col-span-12 md:col-span-9 xl:col-span-8">
            <p className="mb-7 text-[0.66rem] font-semibold tracking-[0.18em] text-white/70 uppercase">
              {copy.eyebrow}
            </p>
            <h1 className="display-title max-w-[12ch]">Yaşanacak atmosferler tasarlıyoruz.</h1>
          </div>
          <div className="col-span-12 md:col-span-4 md:col-start-9 xl:col-span-3 xl:col-start-10">
            <p className="mb-7 text-base leading-relaxed text-white/78">{copy.description}</p>
            <div className="flex flex-wrap gap-5">
              <Link href="/projects" className="text-link">
                {copy.primaryActionLabel} <ArrowUpRight aria-hidden="true" size={15} />
              </Link>
              <Link href="/contact" className="text-link text-white/70">
                {copy.secondaryActionLabel}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14 flex items-end justify-between border-t border-white/25 pt-4 text-[0.62rem] font-semibold tracking-[0.15em] text-white/68 uppercase">
          <span>41.0082° N · 28.9784° E</span>
          <a href="#featured-projects" className="flex min-h-11 items-center gap-3">
            {copy.scrollLabel} <ArrowDown aria-hidden="true" size={14} />
          </a>
          <span className="hidden sm:inline">Seçki / 2026</span>
        </div>
      </div>
    </section>
  );
}
