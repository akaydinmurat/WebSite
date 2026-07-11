import type { Metadata } from "next";

import { PackageCard } from "@/components/packages/package-card";
import { PageHero } from "@/components/ui/page-hero";
import { fallbackPackages } from "@/content/fallback-packages";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Tasarım Paketleri",
  description:
    "Tek oda, salon, mutfak, komple ev ve 3D görselleştirme için geçici örnek tasarım paketleri.",
  path: "/packages",
});

export default function PackagesPage() {
  return (
    <main>
      <PageHero
        eyebrow="Tasarım Paketleri"
        title="Süreci anlaşılır bir kapsamla başlatın."
        description="Aşağıdaki paketler ön görüşmeyi kolaylaştıran geçici örneklerdir. İçerik, teslim takvimi, revizyon ve ücret her proje için yeniden netleştirilir."
        aside={
          <p className="max-w-xs border border-[var(--color-border)] p-4 text-sm text-[var(--color-muted)]">
            Fiyatlar henüz sağlanmadı; gösterilen tüm fiyat alanları açıkça yer tutucudur.
          </p>
        }
      />
      <section className="section-space-sm pt-0">
        <div className="site-shell grid gap-x-6 gap-y-16 md:grid-cols-2 xl:grid-cols-3">
          {fallbackPackages.map((designPackage, index) => (
            <PackageCard key={designPackage.slug} designPackage={designPackage} index={index} />
          ))}
        </div>
        <div className="site-shell mt-16 border-t border-[var(--color-border)] pt-6 text-sm text-[var(--color-muted)]">
          Paket bilgileri demo niteliğindedir. Nihai kapsam ve teklif, proje görüşmesinin ardından
          hazırlanır.
        </div>
      </section>
    </main>
  );
}
