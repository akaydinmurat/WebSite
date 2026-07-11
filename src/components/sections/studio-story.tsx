import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { SectionMarker } from "@/components/animation/section-divider";
import { siteConfig } from "@/config/site";

const studioFacts = ["Yüksek Mimar", "Ankara", "Konut · Ticari · Online"] as const;

export function StudioStory() {
  const copy = siteConfig.copy.about;

  return (
    <section
      id="studio-story"
      aria-labelledby="studio-story-title"
      className="studio-cinema section-tone-dark"
      data-cursor-theme="dark"
      data-home-scene="about"
    >
      <div className="site-shell studio-cinema-shell">
        <SectionMarker index="05" label="Stüdyo" meta="Ankara" />

        <div className="studio-cinema-grid">
          <div className="studio-portrait-stage" aria-hidden="true">
            <div className="studio-portrait-plane studio-portrait-plane-back">
              <Image
                src="/images/placeholders/hero-architecture.svg"
                alt=""
                fill
                unoptimized
                sizes="(max-width: 767px) 100vw, 55vw"
                className="object-cover"
              />
            </div>
            <div className="studio-portrait-plane studio-portrait-plane-front">
              <Image
                src="/images/placeholders/placeholder-plan.svg"
                alt=""
                fill
                unoptimized
                sizes="(max-width: 767px) 90vw, 38vw"
                className="object-cover"
              />
            </div>
            <span className="studio-orbit studio-orbit-one" />
            <span className="studio-orbit studio-orbit-two" />
            <span className="studio-portrait-caption">Mekân / İnsan / Anlatı</span>
          </div>

          <div className="studio-story-copy">
            <p className="eyebrow">{copy.eyebrow}</p>
            <h2 id="studio-story-title" className="section-title mt-7 max-w-[12ch]">
              {copy.title}
            </h2>
            <p className="body-large mt-8 max-w-[36rem]">{copy.description}</p>

            <ul className="studio-facts" aria-label="Çalışma pratiği özeti">
              {studioFacts.map((fact, index) => (
                <li key={fact}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{fact}</strong>
                </li>
              ))}
            </ul>

            <Link href="/about" className="text-link mt-9">
              {copy.actionLabel} <ArrowUpRight aria-hidden="true" size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
