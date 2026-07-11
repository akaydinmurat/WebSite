import type { Metadata } from "next";

import { ContactForm } from "@/components/forms/contact-form";
import { PageHero } from "@/components/ui/page-hero";
import { siteConfig } from "@/config/site";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "İletişim",
  description:
    "İç mimari, tasarım veya 3D görselleştirme projeniz için Murat Akaydın Studio ile iletişime geçin.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="İletişim"
        title="Projenizin ilk sorusuyla başlayın."
        description="Mekânı, ihtiyaçlarınızı ve hedeflediğiniz hissi kısaca paylaşın; uygun kapsamı birlikte şekillendirelim."
      />
      <section className="section-space-sm pt-0">
        <div className="site-shell editorial-grid gap-y-12">
          <aside className="col-span-12 md:col-span-4">
            <div className="sticky top-32 border-t border-[var(--color-border)] pt-5">
              <p className="mb-10 text-[var(--color-ink-soft)]">
                {siteConfig.contact.availabilityText}
              </p>
              <dl className="space-y-6 text-sm">
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
                  <dd>İletişim sağlayıcısı etkinleştirilene kadar geliştirme modu</dd>
                </div>
              </dl>
            </div>
          </aside>
          <div className="col-span-12 bg-[var(--color-paper)] p-5 sm:p-8 md:col-span-7 md:col-start-6 lg:p-12">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
