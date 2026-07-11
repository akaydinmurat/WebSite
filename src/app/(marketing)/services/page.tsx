import type { Metadata } from "next";
import { ArrowUpRight, Check } from "lucide-react";
import Link from "next/link";

import { PageHero } from "@/components/ui/page-hero";
import { fallbackServices } from "@/content/fallback-services";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Hizmetler",
  description:
    "İç mimari, 3D görselleştirme, oda ve mutfak tasarımı ile online tasarım danışmanlığı hizmetleri.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Hizmetler"
        title="Tasarım kararlarını, bütünlüklü bir mekân anlatısına dönüştürmek."
        description="Kapsamı projenizin ölçeğine göre kuruyor; planlama, atmosfer, malzeme ve görsel iletişimi aynı düşünce çizgisinde ele alıyoruz."
      />
      <section className="section-space-sm pt-0">
        <div className="site-shell border-t border-[var(--color-border)]">
          {fallbackServices.map((service, index) => (
            <article
              key={service.slug}
              id={service.slug}
              className="editorial-grid scroll-mt-28 gap-y-9 border-b border-[var(--color-border)] py-12 md:py-20"
            >
              <div className="col-span-12 md:col-span-4">
                <div className="mb-8 text-[0.63rem] font-semibold tracking-[0.15em] text-[var(--color-muted)] uppercase">
                  {String(index + 1).padStart(2, "0")} · {service.eyebrow}
                </div>
                <h2 className="card-title max-w-[12ch]">{service.title}</h2>
              </div>
              <div className="col-span-12 md:col-span-4 md:col-start-6">
                <p className="body-large mb-6">{service.description}</p>
                <p className="text-sm text-[var(--color-muted)]">
                  <strong className="text-[var(--color-ink)]">Kimler için:</strong>{" "}
                  {service.suitableFor}
                </p>
              </div>
              <div className="col-span-12 md:col-span-3 md:col-start-10">
                <h3 className="mb-5 text-[0.63rem] font-semibold tracking-[0.14em] text-[var(--color-muted)] uppercase">
                  Kapsam Örnekleri
                </h3>
                <ul className="mb-8 space-y-3 text-sm">
                  {service.deliverables.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 border-t border-[var(--color-border)] pt-3"
                    >
                      <Check aria-hidden="true" size={15} className="mt-0.5 shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
                <Link href={`/contact?service=${service.slug}`} className="text-link">
                  {service.inquiryLabel} <ArrowUpRight aria-hidden="true" size={15} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
