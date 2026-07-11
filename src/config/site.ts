import type { SiteConfig } from "@/types";

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const siteConfig = {
  name: "Murat Akaydın Studio",
  shortName: "Murat Akaydın",
  positioningStatement:
    "İç mekânları yalnızca tasarlamıyor, yaşanacak atmosferlere dönüştürüyoruz.",
  description:
    "İç mimari, mekânsal tasarım ve 3D görselleştirme odağında çalışan bağımsız tasarım stüdyosu.",
  language: "tr",
  locale: "tr_TR",
  siteUrl: configuredSiteUrl || "http://localhost:3000",
  contact: {
    email: null,
    phone: null,
    location: "Türkiye",
    availabilityText: "Yeni proje görüşmeleri için iletişime geçebilirsiniz.",
  },
  socialLinks: [],
  copy: {
    hero: {
      eyebrow: "İç mimari · Mekânsal tasarım · Görselleştirme",
      title: "İç mekânları yalnızca tasarlamıyor, yaşanacak atmosferlere dönüştürüyoruz.",
      description:
        "Işık, malzeme ve gündelik ritüeller arasında sakin ama karakterli bir bütünlük kuruyoruz.",
      primaryActionLabel: "Projeleri keşfet",
      secondaryActionLabel: "Bir proje başlat",
      scrollLabel: "Aşağı kaydır",
      visualAlt:
        "Gerçek bir projeyi temsil etmeyen, ışık ve mimari yüzeylerden oluşan soyut demo kompozisyonu",
    },
    featuredProjects: {
      eyebrow: "Seçili çalışmalar",
      title: "Mekânın hissini, planın ötesinde ele alan sahneler.",
      description:
        "Aşağıdaki çalışmalar site deneyimini göstermek için hazırlanmış kavramsal demo içeriklerdir; gerçek uygulama veya müşteri projesi değildir.",
      actionLabel: "Tüm demo projeleri gör",
    },
    philosophy: {
      eyebrow: "Yaklaşım",
      title: "Her karar, mekânın nasıl yaşanacağına cevap verir.",
      description:
        "Oran, dolaşım, ışık ve dokuyu tek bir anlatının parçaları olarak ele alıyor; gösterişten çok kalıcı bir denge arıyoruz.",
      actionLabel: "Stüdyo yaklaşımı",
    },
    services: {
      eyebrow: "Hizmetler",
      title: "Fikirden görsel anlatıma uzanan bütüncül tasarım desteği.",
      description:
        "İhtiyaca göre tek bir oda, mutfak, bütün bir konut ya da yalnızca görselleştirme kapsamıyla çalışabiliriz.",
      actionLabel: "Hizmetleri incele",
    },
    packages: {
      eyebrow: "Tasarım paketleri",
      title: "Kapsamı anlaşılır, süreci esnek başlangıç noktaları.",
      description:
        "Paketler ön görüşmeyi kolaylaştıran geçici örneklerdir. İçerik, takvim ve ücret proje gereksinimlerine göre netleştirilir.",
      actionLabel: "Paketleri karşılaştır",
    },
    about: {
      eyebrow: "Stüdyo",
      title: "Sakin, düşünülmüş ve kişiye ait mekânlar için.",
      description:
        "Murat Akaydın Studio; iç mimari kararları güçlü görsel anlatım ve ölçülü bir tasarım diliyle bir araya getiren bağımsız bir çalışma pratiğidir.",
      actionLabel: "Stüdyoyu tanı",
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
      statement: "İç mimari ve 3D görselleştirme için bağımsız tasarım stüdyosu.",
      contentNotice:
        "Sitedeki proje görselleri ve paket bilgileri, gerçek içerikler sağlanana kadar demo niteliğindedir.",
    },
  },
} satisfies SiteConfig;
