import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { FadeIn } from "@/components/animation/fade-in";
import { SectionMarker } from "@/components/animation/section-divider";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site";
import { fallbackServices } from "@/content/fallback-services";

export function ServicesPreview() {
  const copy = siteConfig.copy.services;

  return (
    <section
      id="services-preview"
      aria-labelledby="services-preview-title"
      className="section-space section-tone-dark bg-[var(--color-night-soft)] text-[var(--color-paper)]"
      data-cursor-theme="dark"
      data-layered-section
    >
      <div className="site-shell section-frame">
        <SectionMarker index="02" label="Çalışma Alanları" meta="05 disiplin" />
        <SectionHeading
          headingId="services-preview-title"
          className="mt-14 md:mt-20"
          eyebrow={copy.eyebrow}
          title={copy.title}
          description={copy.description}
        />
        <div className="mt-24 border-t border-[var(--color-border)]">
          {fallbackServices.slice(0, 5).map((service, index) => (
            <FadeIn key={service.slug} className="border-b border-[var(--color-border)]">
              <Link
                href={`/services#${service.slug}`}
                className="group grid min-h-24 gap-5 py-7 md:grid-cols-[5rem_1fr_1fr_auto] md:items-center"
              >
                <span className="text-[0.62rem] font-semibold tracking-[0.16em] text-[var(--color-muted)] uppercase">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-serif text-[clamp(1.55rem,2.5vw,2.7rem)] leading-none tracking-[-0.035em]">
                  {service.title}
                </h3>
                <p className="max-w-md text-sm text-[var(--color-ink-soft)]">{service.summary}</p>
                <ArrowUpRight
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                  aria-hidden="true"
                  size={20}
                />
              </Link>
            </FadeIn>
          ))}
        </div>
        <div className="mt-10 flex justify-end">
          <Link href="/services" className="text-link">
            {copy.actionLabel} <ArrowUpRight aria-hidden="true" size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
