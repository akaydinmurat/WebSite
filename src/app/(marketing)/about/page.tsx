import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { PageHero } from "@/components/ui/page-hero";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Hakkımda",
  description:
    "Yüksek Mimar Göknur Uygur Akaydın'ın mimarlık deneyimi, tasarım yaklaşımı, eğitimi ve çalışma alanları.",
  path: "/about",
});

const processSteps = [
  ["Dinleme", "Mekânı, ihtiyaçları, alışkanlıkları ve hedeflenen hissi anlamak."],
  ["Kurgu", "İşlev, dolaşım ve yerleşim kararlarını açık bir tasarım fikrinde toplamak."],
  ["Tasarım", "Renk, malzeme, mobilya ve aydınlatma dilini birlikte geliştirmek."],
  ["Anlatım", "Kararları kapsama göre 2D ve 3D sunumlarla anlaşılır hâle getirmek."],
] as const;

const career = [
  ["2014–2020", "Atılım Üniversitesi", "Lisans"],
  ["2021–2023", "TOBB ETÜ", "Yüksek Lisans"],
  ["2021–2023", "Özel Sektör", "Mimar"],
  ["2021–Günümüz", "Bağımsız Çalışma", "Freelance Mimar"],
] as const;

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Yüksek Mimar"
        title="Kullanıcıyı merkeze alan, özgün ve yaşanabilir mekânlar."
        description="Göknur Uygur Akaydın; konut, ofis ve mağaza tasarımından online iç mimari danışmanlığa uzanan çalışmalarını bağımsız olarak sürdürüyor."
      />

      <section className="section-space-sm pt-0">
        <div className="site-shell editorial-grid items-end gap-y-10">
          <div className="architectural-visual fine-noise relative col-span-12 aspect-[16/10] md:col-span-8">
            <Image
              src="/images/placeholders/yumusak-ufuk.svg"
              alt="Göknur Uygur Akaydın'ın tasarım yaklaşımını temsil eden soyut mimari yer tutucu kompozisyon"
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 70vw"
              className="object-cover"
            />
          </div>
          <div className="col-span-12 border-t border-[var(--color-border-strong)] pt-6 md:col-span-4">
            <p className="eyebrow mb-7">Tasarım Yaklaşımı</p>
            <p className="body-large">
              Kullanıcı istekleriyle kendi tasarım anlayışımı harmanlayarak estetik, işlevsel ve
              içinde yaşamaktan mutluluk duyulan mekânlar oluşturmayı amaçlıyorum.
            </p>
          </div>
        </div>
      </section>

      <section
        className="section-space bg-[var(--color-night-soft)] text-[var(--color-paper)]"
        data-cursor-theme="dark"
      >
        <div className="site-shell">
          <div className="editorial-grid gap-y-10">
            <p className="eyebrow col-span-12 text-white/60 md:col-span-3">Çalışma Biçimi</p>
            <h2 className="section-title col-span-12 max-w-[13ch] md:col-span-8 md:col-start-5">
              Tasarım sürecini açık, odaklı ve birlikte ilerleyen adımlara dönüştürmek.
            </h2>
          </div>
          <ol className="mt-20 grid gap-px bg-white/20 md:grid-cols-2 xl:grid-cols-4">
            {processSteps.map(([title, description], index) => (
              <li key={title} className="min-h-72 bg-[var(--color-night-soft)] p-7">
                <span className="mb-16 block text-[0.63rem] font-semibold tracking-[0.15em] text-white/50 uppercase">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mb-5 font-serif text-3xl tracking-[-0.035em]">{title}</h3>
                <p className="text-white/68">{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-space bg-[var(--color-paper)]">
        <div className="site-shell editorial-grid gap-y-14">
          <div className="col-span-12 md:col-span-5">
            <p className="eyebrow mb-7">Göknur Uygur Akaydın</p>
            <h2 className="section-title max-w-[11ch]">Mimarlık, iç mekân ve dijital anlatı.</h2>
          </div>
          <div className="col-span-12 md:col-span-6 md:col-start-7">
            <p className="body-large mb-7">
              Mezuniyetinin ardından özel sektörde mimarlık ve iç mekân tasarımı alanında çalışan
              Göknur Uygur Akaydın; konut, ofis ve mağaza projelerinin yanı sıra online iç mimari
              danışmanlık hizmeti sunuyor.
            </p>
            <p className="mb-12 text-[var(--color-ink-soft)]">
              Mimarlık pratiğini sosyal medya için iç mimari içerik üretimi ve marka iş
              birlikleriyle de bir araya getiriyor.
            </p>

            <dl className="mb-12 border-t border-[var(--color-border-strong)]">
              {career.map(([period, institution, role]) => (
                <div
                  key={`${period}-${institution}`}
                  className="grid gap-2 border-b border-[var(--color-border)] py-5 sm:grid-cols-[7.5rem_1fr_auto] sm:items-baseline"
                >
                  <dt className="text-[0.64rem] font-semibold tracking-[0.13em] text-[var(--color-muted)] uppercase">
                    {period}
                  </dt>
                  <dd className="font-serif text-xl">{institution}</dd>
                  <dd className="text-sm text-[var(--color-muted)]">{role}</dd>
                </div>
              ))}
            </dl>

            <Link href="/contact" className="text-link">
              Projenizi konuşalım <ArrowUpRight aria-hidden="true" size={15} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
