import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { FadeIn } from "@/components/animation/fade-in";
import { PackageCard } from "@/components/packages/package-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site";
import { fallbackPackages } from "@/content/fallback-packages";

export function PackagesPreview() {
  const copy = siteConfig.copy.packages;

  return (
    <section className="section-space bg-[var(--color-paper)]">
      <div className="site-shell">
        <SectionHeading
          eyebrow={copy.eyebrow}
          title={copy.title}
          description={copy.description}
          action={
            <Link href="/packages" className="text-link">
              {copy.actionLabel} <ArrowUpRight aria-hidden="true" size={15} />
            </Link>
          }
        />
        <div className="mt-20 grid gap-x-6 gap-y-12 md:grid-cols-3">
          {fallbackPackages.slice(0, 3).map((designPackage, index) => (
            <FadeIn key={designPackage.slug} delay={index * 0.08}>
              <PackageCard designPackage={designPackage} index={index} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
