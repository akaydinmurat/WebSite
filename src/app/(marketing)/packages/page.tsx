import type { Metadata } from "next";

import { PackageCard } from "@/components/packages/package-card";
import { PageHero } from "@/components/ui/page-hero";
import { fallbackPackages } from "@/content/fallback-packages";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Dijital Tasarım Ürünleri",
  description:
    "Online danışmanlık, ürün ve mekân tasarımı için fiyatı ve kapsamı açık 11 dijital tasarım ürünü.",
  path: "/packages",
});

export default function PackagesPage() {
  return (
    <>
      <PageHero
        eyebrow="Dijital Tasarım Ürünleri"
        title="İhtiyacınıza göre tanımlanmış 11 tasarım ürünü."
        description="Üç soruluk hızlı destekten bütüncül konut tasarımına uzanan ürünleri; gerçek Shopier fiyatı, kapsamı ve sunum biçimi üzerinden karşılaştırın."
        tone="sun"
        aside={
          <p className="max-w-xs text-sm text-[var(--color-muted)]">
            Fiyatlar ve ürün kapsamları Shopier mağazasındaki güncel ilanlardan alınmıştır.
          </p>
        }
      />
      <section className="luminous-packages-page section-space-sm border-t border-[var(--color-border-strong)] pt-20">
        <div className="site-shell luminous-package-grid package-page-grid grid gap-5 md:grid-cols-2">
          {fallbackPackages.map((designPackage, index) => (
            <PackageCard key={designPackage.slug} designPackage={designPackage} index={index} />
          ))}
        </div>
      </section>
    </>
  );
}
