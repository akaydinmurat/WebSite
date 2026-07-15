import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { SocialIconLinks } from "@/components/ui/social-icon-links";
import { siteConfig } from "@/config/site";
import { aboutStory } from "@/content/about-story";
import { createMetadata } from "@/lib/seo";

import styles from "./about-page.module.css";

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

export default function AboutPage() {
  return (
    <>
      <section className={styles.cover} data-about-page aria-labelledby="about-page-title">
        <div className={styles.coverPlanes} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className={`site-shell ${styles.coverInner}`}>
          <SocialIconLinks
            className={`about-social-links ${styles.socialCorner}`}
            label="Göknur Uygur sosyal medya hesapları"
          />
          <p className={styles.coverKicker}>Monografi · 01</p>
          <h1 id="about-page-title" className={styles.coverTitle}>
            <span>Göknur</span>
            <span>Uygur</span>
          </h1>

          <div className={styles.coverFolio} data-about-cover-folio>
            <p className={styles.folioLabel}>Yüksek Mimar · Bağımsız Pratik</p>
            <p className={styles.folioStatement}>Mekânı, onu yaşayacak kişinin ritminden okurum.</p>
            <ArrowDownRight className={styles.folioArrow} aria-hidden="true" size={28} />
          </div>

          <dl className={styles.coverCredits}>
            <div>
              <dt>Konum</dt>
              <dd>{siteConfig.contact.location}</dd>
            </div>
            <div>
              <dt>Çalışma Alanı</dt>
              <dd>Konut · Ofis · Mağaza</dd>
            </div>
            <div>
              <dt>Pratik</dt>
              <dd>Mimarlık · İç Mekân · Danışmanlık</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className={styles.manifesto} aria-labelledby="about-manifesto-title">
        <div className={`site-shell ${styles.manifestoGrid}`}>
          <p className={styles.sectionIndex}>01 / Yaklaşım</p>
          <h2 id="about-manifesto-title" className={styles.manifestoTitle}>
            Kullanıcıyı merkeze alan, özgün ve yaşanabilir mekânlar.
          </h2>
          <div className={styles.manifestoCopy}>
            <p>
              Kullanıcı istekleriyle kendi tasarım anlayışımı harmanlayarak estetik, işlevsel ve
              içinde yaşamaktan mutluluk duyulan mekânlar oluşturmayı amaçlıyorum.
            </p>
            <p>
              Konut, ofis ve mağaza tasarımından online iç mimari danışmanlığa uzanan çalışmalarımı
              bağımsız olarak sürdürüyorum. Mimarlık pratiğimi sosyal medya için iç mimari içerik
              üretimi ve marka iş birlikleriyle de bir araya getiriyorum.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.journey} aria-labelledby="about-journey-title">
        <div className={`site-shell ${styles.journeyGrid}`}>
          <header className={styles.journeyHeader}>
            <p className={styles.sectionIndex}>02 / Yolculuk</p>
            <h2 id="about-journey-title">Bir çizginin bağımsız bir pratiğe dönüşmesi.</h2>
          </header>

          <ol className={styles.journeyList}>
            {aboutStory.map((chapter, index) => (
              <li key={`${chapter.period}-${chapter.institution}`} data-about-chapter>
                <p className={styles.chapterNumber}>{String(index + 1).padStart(2, "0")}</p>
                <div className={styles.chapterHeading}>
                  <p>{chapter.period}</p>
                  <h3>{chapter.institution}</h3>
                  <p>{chapter.role}</p>
                </div>
                <div className={styles.chapterStory}>
                  <p>{chapter.chapter}</p>
                  <p>{chapter.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.method} aria-labelledby="about-method-title">
        <div className="site-shell">
          <header className={styles.methodHeader}>
            <p className={styles.sectionIndex}>03 / Çalışma Biçimi</p>
            <h2 id="about-method-title">Açık, odaklı ve birlikte ilerleyen bir tasarım süreci.</h2>
          </header>

          <ol className={styles.methodList}>
            {processSteps.map(([title, description], index) => (
              <li key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.contact} aria-labelledby="about-contact-title">
        <div className={`site-shell ${styles.contactInner}`}>
          <p>04 / Birlikte Çalışalım</p>
          <h2 id="about-contact-title">Sıradaki mekânın hikâyesini birlikte kuralım.</h2>
          <Link href="/contact" className={styles.contactLink}>
            Projenizi konuşalım <ArrowUpRight aria-hidden="true" size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
