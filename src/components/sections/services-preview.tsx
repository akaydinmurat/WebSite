import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { SectionMarker } from "@/components/animation/section-divider";
import { siteConfig } from "@/config/site";
import { fallbackServices } from "@/content/fallback-services";

const serviceVisualLabels = [
  "Plan / Kesit",
  "Konut / Yaşam",
  "Marka / Akış",
  "Uzaktan / Odak",
  "İçerik / Anlatı",
] as const;

export function ServicesPreview() {
  const copy = siteConfig.copy.services;

  return (
    <section
      id="services-preview"
      aria-labelledby="services-preview-title"
      className="services-cinema section-tone-dark"
      data-cursor-theme="dark"
      data-home-scene="services"
    >
      <div className="site-shell services-cinema-intro">
        <SectionMarker index="02" label="Çalışma Alanları" meta="05 disiplin" />
        <div className="editorial-grid mt-12 gap-y-8 md:mt-16">
          <p className="eyebrow col-span-12 md:col-span-3">{copy.eyebrow}</p>
          <div className="col-span-12 md:col-span-8 md:col-start-5">
            <h2 id="services-preview-title" className="section-title max-w-[13ch]">
              {copy.title}
            </h2>
            <p className="body-large mt-7 max-w-[40rem]">{copy.description}</p>
          </div>
        </div>
      </div>

      <div className="site-shell services-cinema-grid">
        <div className="service-stage-column" aria-hidden="true">
          <div className="service-stage-sticky">
            <div className="service-stage-viewport">
              <span className="service-stage-axis service-stage-axis-x" />
              <span className="service-stage-axis service-stage-axis-y" />
              <span className="service-stage-room" />
              {fallbackServices.map((service, index) => (
                <div
                  key={service.slug}
                  className="service-stage-card"
                  data-service-stage-card
                  data-service-index={index}
                  data-state={index === 0 ? "active" : "after"}
                >
                  <span className="service-stage-number">{String(index + 1).padStart(2, "0")}</span>
                  <span className="service-stage-label">{serviceVisualLabels[index]}</span>
                  <strong>{service.title}</strong>
                  <span className="service-stage-line" />
                </div>
              ))}
              <p className="service-stage-caption">
                <span>Yaşayan Kesit</span>
                <span>Kaydırdıkça dönüşen çalışma alanı</span>
              </p>
            </div>
          </div>
        </div>

        <ol className="service-records">
          {fallbackServices.map((service, index) => (
            <li key={service.slug}>
              <article
                id={service.slug}
                className="service-record"
                data-home-scene={`service-${service.slug}`}
                data-service-index={index}
              >
                <div className="service-record-head">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>{service.eyebrow.split("·").at(-1)?.trim()}</span>
                </div>
                <h3>{service.title}</h3>
                <p className="service-record-summary">{service.summary}</p>
                <ul aria-label={`${service.title} kapsamında öne çıkanlar`}>
                  {service.deliverables.slice(0, 3).map((deliverable) => (
                    <li key={deliverable}>{deliverable}</li>
                  ))}
                </ul>
                <Link
                  href={`/services#${service.slug}`}
                  className="service-record-action"
                  data-cursor-kind="action"
                >
                  Kapsamı incele <ArrowUpRight aria-hidden="true" size={17} />
                </Link>
              </article>
            </li>
          ))}
        </ol>
      </div>

      <div className="site-shell services-cinema-outro">
        <Link href="/services" className="text-link">
          {copy.actionLabel} <ArrowUpRight aria-hidden="true" size={15} />
        </Link>
      </div>
    </section>
  );
}
