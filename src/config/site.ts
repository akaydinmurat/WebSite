import type { SiteConfig } from "@/types";

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const siteConfig = {
  name: "Göknur Uygur Akaydın",
  shortName: "Göknur Uygur",
  positioningStatement: "Estetik ve işlevi, size ait yaşanabilir mekânlarda buluşturuyorum.",
  description:
    "Yüksek Mimar Göknur Uygur Akaydın'ın konut, ticari mekân ve online iç mimari danışmanlık pratiği.",
  language: "tr",
  locale: "tr_TR",
  siteUrl: configuredSiteUrl || "http://localhost:3000",
  contact: {
    email: "goknuruygur0@gmail.com",
    phone: null,
    location: "Ankara · Türkiye",
    availabilityText:
      "Konut, ticari mekân ve online danışmanlık talepleri için iletişime geçebilirsiniz.",
  },
  socialLinks: [
    {
      label: "Instagram",
      href: "https://www.instagram.com/mimargoknuruygur/",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/g%C3%B6knur-sena-uygur-4289451b2/",
    },
  ],
  copy: {
    hero: {
      eyebrow: "Yüksek Mimar · İç Mekân Tasarımı · Ankara",
      title: "Mekânı, yaşamla birlikte tasarlıyorum.",
      description:
        "Konut ve ticari mekânlarda estetik, işlev ve kullanıcı alışkanlıklarını özgün bir tasarım dili içinde buluşturuyorum.",
      primaryActionLabel: "Projeleri keşfet",
      secondaryActionLabel: "Projenizi anlatın",
      scrollLabel: "Aşağı kaydır",
      visualAlt:
        "Gerçek bir proje renderı olmayan, ışık ve mimari yüzeylerden oluşan etkileşimli soyut kompozisyon",
    },
    featuredProjects: {
      eyebrow: "Seçili Projeler",
      title: "Farklı yaşamlar için düşünülmüş mekânlar.",
      description:
        "Mevcut portföyden seçilen gerçek proje kayıtlarıdır. Yeni siteye ait yüksek çözünürlüklü görsel arşivin aktarımı sürmektedir.",
      actionLabel: "Tüm projeleri gör",
    },
    philosophy: {
      eyebrow: "Yaklaşım",
      title: "Her proje, kullanıcıyla kurulan açık bir diyalogla başlar.",
      description:
        "Kullanıcı isteklerini kendi tasarım yaklaşımımla bir araya getiriyor; estetik ve işlevi yaşanabilir bir bütünlük içinde ele alıyorum.",
      actionLabel: "Tasarım yaklaşımı",
    },
    services: {
      eyebrow: "Hizmetler",
      title: "İhtiyaca göre şekillenen mimari ve iç mekân desteği.",
      description:
        "Konut, ofis ve mağaza tasarımından online danışmanlığa; proje ölçeğine uygun, açık ve odaklı kapsamlar sunuyorum.",
      actionLabel: "Hizmetleri incele",
    },
    packages: {
      eyebrow: "Hizmet Dosyaları",
      title: "İhtiyaca göre tanımlanmış profesyonel kapsamlar.",
      description:
        "Tek bir duvardan konut ve ticari mekânlara uzanan hizmetler; ölçek, kapsam ve doğrulanmış sunum biçimleriyle ayrışır.",
      actionLabel: "Tüm kapsamları incele",
    },
    about: {
      eyebrow: "Göknur Uygur Akaydın",
      title: "Özgün, işlevsel ve yaşanabilir mekânlar için.",
      description:
        "Mimarlık ve iç mekân tasarımı deneyimini, kullanıcı ihtiyaçlarıyla kişisel tasarım yaklaşımını buluşturan bağımsız bir pratik içinde sürdürüyorum.",
      actionLabel: "Göknur'u tanıyın",
    },
    contact: {
      eyebrow: "Yeni bir mekân üzerine konuşalım",
      title: "Projenizin ilk sorusuyla başlayın.",
      description:
        "Mekânı, ihtiyaçlarınızı ve hedeflediğiniz hissi kısaca paylaşın; uygun kapsamı birlikte şekillendirelim.",
      actionLabel: "Proje formunu aç",
      responseNote:
        "İletişim altyapısı etkinleştirilene kadar form gönderimleri yalnızca geliştirme ortamında doğrulanır.",
    },
    footer: {
      statement:
        "Konut, ticari mekân ve online iç mimari danışmanlık için bağımsız mimarlık pratiği.",
      contentNotice:
        "Proje başlıkları mevcut portföyden aktarılmıştır; yer tutucu görseller gerçek proje renderları değildir.",
    },
  },
} satisfies SiteConfig;
