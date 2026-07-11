import { ArrowDown, ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { siteConfig } from "@/config/site";

export function Hero() {
  const copy = siteConfig.copy.hero;

  return (
    <section
      className="hero-experience"
      data-cursor-theme="dark"
      data-home-scene="hero"
      aria-labelledby="home-hero-title"
    >
      <div className="hero-experience-sticky">
        <div className="hero-scene-vignette" aria-hidden="true" />
        <span className="hero-side-note" aria-hidden="true">
          Işık · Doku · İşlev · Yaşam
        </span>

        <div className="site-shell hero-experience-shell">
          <nav className="hero-social-rail" aria-label="Sosyal medya">
            {siteConfig.socialLinks.map((socialLink) => {
              const Icon = socialLink.label === "Instagram" ? InstagramIcon : LinkedInIcon;

              return (
                <a
                  key={socialLink.href}
                  href={socialLink.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${socialLink.label}, yeni sekmede açılır`}
                  data-cursor-kind="social"
                  data-cursor-label="Takip et"
                >
                  <Icon size={17} />
                  <span>{socialLink.label}</span>
                  <ArrowUpRight aria-hidden="true" size={13} />
                </a>
              );
            })}
          </nav>

          <div className="hero-copy-frame">
            <div className="editorial-grid items-end gap-y-9">
              <div className="col-span-12 md:col-span-8 xl:col-span-7">
                <p className="hero-eyebrow">
                  <span aria-hidden="true" />
                  {copy.eyebrow}
                </p>
                <h1 id="home-hero-title" className="display-title max-w-[10ch]">
                  {copy.title}
                </h1>
              </div>

              <div className="col-span-12 md:col-span-4 xl:col-span-3 xl:col-start-10">
                <p className="hero-description">{copy.description}</p>
                <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
                  <Link href="/projects" className="text-link" data-cursor-kind="action">
                    {copy.primaryActionLabel} <ArrowUpRight aria-hidden="true" size={15} />
                  </Link>
                  <Link
                    href="/contact"
                    className="text-link text-white/72"
                    data-cursor-kind="action"
                  >
                    {copy.secondaryActionLabel}
                  </Link>
                </div>
              </div>
            </div>

            <div className="hero-datum-row">
              <span>{siteConfig.contact.location}</span>
              <a href="#featured-projects">
                {copy.scrollLabel} <ArrowDown aria-hidden="true" size={14} />
              </a>
              <span className="hidden justify-self-end sm:inline">Bağımsız Mimarlık Pratiği</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InstagramIcon({ size = 17 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedInIcon({ size = 17 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <rect x="3.2" y="9" width="3.5" height="11.5" />
      <circle cx="4.95" cy="5.2" r="2" />
      <path d="M9.2 9h3.35v1.58h.05c.47-.88 1.6-1.82 3.3-1.82 3.53 0 4.18 2.32 4.18 5.34v6.4h-3.49v-5.67c0-1.35-.03-3.09-1.88-3.09-1.88 0-2.17 1.47-2.17 2.99v5.77H9.2Z" />
    </svg>
  );
}
