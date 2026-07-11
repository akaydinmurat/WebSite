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
        title="İhtiyacınıza uyan kapsamla başlayın."
        description="Paketler mevcut hizmet kapsamlarını 2D, 3D ve danışmanlık ihtiyaçlarına göre ayrıştırır. Teslim takvimi, revizyon ve ücret proje görüşmesinde netleştirilir."
        aside={
          <p className="max-w-xs border border-[var(--color-border)] p-4 text-sm text-[var(--color-muted)]">
            Mevcut sitede doğrulanmış fiyat, süre veya revizyon sayısı bulunmadığı için bu bilgiler
            üretilmemiştir.
          </p>
        }
      />
      <section className="section-space-sm bg-[var(--color-sand)] pt-20">
        <div className="site-shell grid gap-x-6 gap-y-16 md:grid-cols-2 xl:grid-cols-3">
          {fallbackPackages.map((designPackage, index) => (
            <PackageCard key={designPackage.slug} designPackage={designPackage} index={index} />
          ))}
        </div>
        <div className="site-shell mt-16 border-t border-[var(--color-border)] pt-6 text-sm text-[var(--color-muted)]">
          Nihai kapsam, teslim takvimi, revizyon akışı ve teklif proje görüşmesinin ardından
          hazırlanır.
        </div>
      </section>
    </>
  );
}
