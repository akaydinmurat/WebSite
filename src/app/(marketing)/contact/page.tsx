import type { Metadata } from "next";

import { ContactForm } from "@/components/forms/contact-form";
import { PageHero } from "@/components/ui/page-hero";
import { SocialIconLinks } from "@/components/ui/social-icon-links";
import { siteConfig } from "@/config/site";
import { createMetadata } from "@/lib/seo";

import styles from "./contact-page.module.css";

export const metadata: Metadata = createMetadata({
  title: "İletişim",
  description:
    "Hayalinizdeki mekânın mimari yolculuğunu başlatmak için Yüksek Mimar Göknur Uygur Akaydın ile iletişime geçin.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <div className={`contact-dream-hero ${styles.hero}`}>
        <div className={`site-shell contact-social-slot ${styles.heroSocialSlot}`}>
          <SocialIconLinks label="Göknur Uygur sosyal medya hesapları" />
        </div>
        <PageHero
          eyebrow="Yeni Proje · İlk Eskiz"
          title="Hayalinizdeki mekânı birlikte gerçeğe dönüştürelim."
          description="Hayalinizi, mekânın ihtiyaçlarını ve yaşam ritminizi paylaşın; ilk brief'ten mimari kurguya uzanan yolu birlikte şekillendirelim."
          tone="coral"
        />
      </div>
      <section className="luminous-contact-page section-space-sm pt-0">
        <div className="site-shell editorial-grid gap-y-12">
          <aside className="col-span-12 md:col-span-4">
            <div className="sticky top-32 border-t border-[var(--color-border)] pt-5">
              <p className="eyebrow mb-4">Bir hayalden mekâna</p>
              <h2 className="max-w-[11ch] font-serif text-4xl leading-[0.95] tracking-[-0.045em]">
                İlk çizgiyi birlikte atalım.
              </h2>
              <ol className="my-8 border-y border-[var(--color-border)]">
                {["Hayal ve yaşam ritmi", "Mekânsal ihtiyaçlar", "İlk tasarım yönü"].map(
                  (step, index) => (
                    <li
                      key={step}
                      className="grid grid-cols-[2.25rem_1fr] items-baseline gap-3 border-b border-[var(--color-border)] py-3 last:border-b-0"
                    >
                      <span className="text-[0.61rem] font-semibold tracking-[0.13em]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p className="text-sm">{step}</p>
                    </li>
                  ),
                )}
              </ol>
              <p className="mb-10 text-[var(--color-ink-soft)]">
                {siteConfig.contact.availabilityText}
              </p>
              <dl className="space-y-6 text-sm">
                <div>
                  <dt className="mb-1 text-[0.61rem] font-semibold tracking-[0.13em] text-[var(--color-muted)] uppercase">
                    E-posta
                  </dt>
                  <dd>
                    <a
                      className="text-link normal-case"
                      href={`mailto:${siteConfig.contact.email}`}
                    >
                      {siteConfig.contact.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="mb-1 text-[0.61rem] font-semibold tracking-[0.13em] text-[var(--color-muted)] uppercase">
                    Konum
                  </dt>
                  <dd>{siteConfig.contact.location}</dd>
                </div>
                <div>
                  <dt className="mb-1 text-[0.61rem] font-semibold tracking-[0.13em] text-[var(--color-muted)] uppercase">
                    Yanıt Süreci
                  </dt>
                  <dd>
                    Form şu anda geliştirme modunda doğrulanır; canlı iletişim sağlayıcısı yayın
                    öncesinde etkinleştirilecektir.
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
          <div className="luminous-contact-card col-span-12 bg-[var(--color-paper)] p-5 sm:p-8 md:col-span-7 md:col-start-6 lg:p-12">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
