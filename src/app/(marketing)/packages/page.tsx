import type { Metadata } from "next";

import { PackageCard } from "@/components/packages/package-card";
import { PageHero } from "@/components/ui/page-hero";
import { fallbackPackages } from "@/content/fallback-packages";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Tasarım Paketleri",
  description:
    "Mekân, ürün, duvar, konut, ticari mekân ve online danışmanlık için tasarım paketleri.",
  path: "/packages",
});

export default function PackagesPage() {
  return (
    <>
      <PageHero
        eyebrow="Tasarım Paketleri"
        title="İhtiyaca göre tanımlanmış yedi tasarım kapsamı."
        description="Tek bir duvardan konut ve ticari mekânlara uzanan hizmetleri; tasarım ölçeği, kapsam ve doğrulanmış sunum biçimleri üzerinden karşılaştırın."
        aside={
          <p className="max-w-xs text-sm text-[var(--color-muted)]">
            Her dosya, hizmetin doğrulanmış içeriğini ve varsa sunum biçimini açıkça gösterir.
          </p>
        }
      />
      <section className="section-space-sm border-t border-[var(--color-border-strong)] bg-[var(--color-paper)] pt-20">
        <div className="site-shell package-page-grid grid gap-5 md:grid-cols-2">
          {fallbackPackages.map((designPackage, index) => (
            <PackageCard key={designPackage.slug} designPackage={designPackage} index={index} />
          ))}
        </div>
      </section>
    </>
  );
}
