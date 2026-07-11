import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { PageHero } from "@/components/ui/page-hero";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Stüdyo",
  description:
    "Murat Akaydın Studio’nun iç mimari yaklaşımı, tasarım süreci ve çalışma yetkinlikleri.",
  path: "/about",
});

const processSteps = [
  ["Dinleme", "Mekânı, ihtiyaçları, alışkanlıkları ve hedeflenen atmosferi anlamak."],
  ["Kurgu", "Plan, dolaşım, oran ve işlev kararlarını ortak bir mekânsal fikirde toplamak."],
  ["Atmosfer", "Işık, malzeme, renk ve mobilya dilini ölçülü bir bütünlük içinde geliştirmek."],
  ["Anlatım", "Kararları plan, seçki ve 3D görselleştirmelerle açık ve tutarlı biçimde sunmak."],
] as const;

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Stüdyo"
        title="Sakin, düşünülmüş ve kişiye ait mekânlar için."
        description="Murat Akaydın Studio; iç mimari kararları, güçlü görsel anlatım ve ölçülü bir tasarım diliyle bir araya getiren bağımsız bir çalışma pratiğidir."
      />
      <section className="section-space-sm pt-0">
        <div className="site-shell editorial-grid items-end gap-y-10">
          <div className="architectural-visual fine-noise relative col-span-12 aspect-[16/10] md:col-span-8">
            <Image
              src="/images/placeholders/yumusak-ufuk.svg"
              alt="Stüdyo felsefesini temsil eden, gerçek proje olmayan soyut mimari demo kompozisyonu"
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 70vw"
              className="object-cover"
            />
          </div>
          <div className="col-span-12 border-t border-[var(--color-border)] pt-6 md:col-span-4">
            <p className="eyebrow mb-7">Felsefe</p>
            <p className="body-large">
              İyi bir iç mekânın yalnızca bakılan değil, gün içinde defalarca deneyimlenen bir denge
              olduğuna inanıyoruz.
            </p>
          </div>
        </div>
      </section>
      <section className="section-space bg-[var(--color-night)] text-[var(--color-paper)]">
        <div className="site-shell">
          <div className="editorial-grid gap-y-10">
            <p className="eyebrow col-span-12 text-white/55 md:col-span-3">Süreç</p>
            <h2 className="section-title col-span-12 max-w-[13ch] md:col-span-8 md:col-start-5">
              Belirsizliği adım adım, açık tasarım kararlarına dönüştürmek.
            </h2>
          </div>
          <ol className="mt-20 grid gap-px bg-white/20 md:grid-cols-2 xl:grid-cols-4">
            {processSteps.map(([title, description], index) => (
              <li key={title} className="min-h-72 bg-[var(--color-night)] p-7">
                <span className="mb-16 block text-[0.63rem] font-semibold tracking-[0.15em] text-white/50 uppercase">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mb-5 font-serif text-3xl tracking-[-0.035em]">{title}</h3>
                <p className="text-white/66">{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="section-space">
        <div className="site-shell editorial-grid gap-y-12">
          <div className="col-span-12 md:col-span-5">
            <p className="eyebrow mb-7">Kişisel Tanışma</p>
            <h2 className="section-title max-w-[11ch]">Stüdyonun arkasındaki bakış.</h2>
          </div>
          <div className="col-span-12 md:col-span-6 md:col-start-7">
            <p className="body-large mb-7">
              Bu alan, profesyonel biyografi ve portre sağlandığında Murat Akaydın’ın yaklaşımını
              kişisel bir dille anlatmak için ayrılmıştır.
            </p>
            <p className="mb-10 text-[var(--color-muted)]">
              Şimdilik gerçek eğitim, deneyim veya başarı bilgisi verilmediği için herhangi bir
              iddia eklenmemiştir.
            </p>
            <Link href="/contact" className="text-link">
              Tanışma görüşmesi planla <ArrowUpRight aria-hidden="true" size={15} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
