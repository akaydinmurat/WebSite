import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { FadeIn } from "@/components/animation/fade-in";
import { SectionMarker } from "@/components/animation/section-divider";
import { PackageCard } from "@/components/packages/package-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site";
import { fallbackPackages } from "@/content/fallback-packages";

export function PackagesPreview() {
  const copy = siteConfig.copy.packages;
  const featuredPackages = fallbackPackages.filter((designPackage) => designPackage.showOnHomepage);

  return (
    <section
      id="packages-preview"
      aria-labelledby="packages-preview-title"
      className="section-space bg-[var(--color-paper)]"
      data-cursor-theme="light"
      data-home-scene="packages"
    >
      <div className="site-shell section-frame">
        <SectionMarker index="03" label="Dijital Tasarım Ürünleri" meta="11 ürün" />
        <SectionHeading
          headingId="packages-preview-title"
          className="mt-14 md:mt-20"
          eyebrow={copy.eyebrow}
          title={copy.title}
          description={copy.description}
          action={
            <Link href="/packages" className="text-link">
              {copy.actionLabel} <ArrowUpRight aria-hidden="true" size={15} />
            </Link>
          }
        />
        <div className="package-preview-grid mt-20 grid gap-5 lg:grid-cols-3">
          {featuredPackages.slice(0, 3).map((designPackage, index) => (
            <FadeIn key={designPackage.slug} delay={index * 0.08}>
              <PackageCard designPackage={designPackage} index={index} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
