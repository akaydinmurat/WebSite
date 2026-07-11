import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { FadeIn } from "@/components/animation/fade-in";
import { ImageReveal } from "@/components/animation/image-reveal";
import { siteConfig } from "@/config/site";

export function StudioStory() {
  const copy = siteConfig.copy.about;

  return (
    <section
      className="section-space bg-[var(--color-night-soft)] text-[var(--color-paper)]"
      data-cursor-theme="dark"
    >
      <div className="site-shell editorial-grid items-center gap-y-12">
        <ImageReveal
          className="architectural-visual fine-noise col-span-12 aspect-[4/5] md:col-span-5 md:aspect-[5/6]"
          style={{ position: "relative" }}
        >
          <Image
            src="/images/placeholders/placeholder-plan.svg"
            alt="Gerçek bir proje planı olmayan, stüdyo yaklaşımını temsil eden soyut demo plan çizimi"
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, 42vw"
            className="object-cover opacity-85"
          />
        </ImageReveal>
        <FadeIn className="col-span-12 md:col-span-6 md:col-start-7">
          <p className="eyebrow mb-8 text-white/60">{copy.eyebrow}</p>
          <h2 className="section-title mb-9 max-w-[12ch]">{copy.title}</h2>
          <p className="body-large mb-10 max-w-[34rem] text-white/72">{copy.description}</p>
          <Link href="/about" className="text-link">
            {copy.actionLabel} <ArrowUpRight aria-hidden="true" size={15} />
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
