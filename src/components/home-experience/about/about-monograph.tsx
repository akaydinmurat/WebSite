import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { siteConfig } from "@/config/site";

export function AboutMonograph() {
  return (
    <section
      id="experience-vision"
      className="experience-track experience-vision"
      data-experience-track="vision"
      aria-labelledby="experience-vision-title"
    >
      <div className="experience-about-surface" aria-hidden="true">
        <p className="experience-about-name">
          <span>GÖK</span>
          <span>NUR</span>
        </p>
        <span className="experience-about-oxide-plane" />
        <span className="experience-about-daylight" />
      </div>

      <div className="experience-sticky experience-about-sticky" data-about-journey>
        <article className="experience-about-folio">
          <p className="experience-about-folio-index">
            <span>06 / Hakkımda</span>
            <span>Monografi / 01</span>
          </p>

          <h2 id="experience-vision-title">Mekânı, onu yaşayacak kişinin ritminden okurum.</h2>

          <p className="experience-about-manifesto">
            Kullanıcı istekleriyle kendi tasarım anlayışımı harmanlayarak estetik, işlevsel ve
            içinde yaşamaktan mutluluk duyulan mekânlar oluşturmayı amaçlıyorum.
          </p>

          <dl className="experience-about-credits">
            <div>
              <dt>Pratik</dt>
              <dd>Bağımsız mimarlık</dd>
            </div>
            <div>
              <dt>Konum</dt>
              <dd>{siteConfig.contact.location}</dd>
            </div>
            <div>
              <dt>Odak</dt>
              <dd>Konut · Ofis · Mağaza</dd>
            </div>
          </dl>

          <Link className="experience-about-link" href="/about">
            Hikâyenin tamamı <ArrowUpRight aria-hidden="true" size={14} />
          </Link>
        </article>

        <p className="experience-about-edition" aria-hidden="true">
          <span>Göknur Uygur Akaydın</span>
          <span>Yüksek Mimar · 2014—Bugün</span>
        </p>
      </div>
    </section>
  );
}
