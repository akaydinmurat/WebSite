import type { DesignPackage } from "@/types";

export const fallbackPackages = [
  {
    slug: "space-design-2d",
    title: "Mekân Tasarımı — 2D",
    scopeLabel: "Tek mekân",
    summary:
      "Tek bir mekânın detaylı analizi ve bu mekân için geliştirilen tasarımın 2D sunumlarla aktarılması.",
    benefit:
      "Ölçek, yerleşim ve dolaşım kararlarını uygulamadan önce okunaklı bir plana dönüştürür.",
    pricingLabel: "Kapsama göre teklif",
    pricingNote: "Mekânın ölçüsü ve ihtiyaç listesiyle netleşir.",
    image: {
      src: "/images/packages/space-design-2d.webp",
      alt: "Plan çizimleri, malzeme örnekleri ve ölçekli oda maketi",
      width: 1440,
      height: 823,
    },
    scopeItems: ["Tek mekânın detaylı analizi", "İlgili mekâna yönelik tasarım"],
    examples: ["Oda", "Salon", "Mutfak", "Çocuk odası", "Yatak odası"],
    presentationFormats: ["2D"],
    exclusions: ["3D görsel hizmeti"],
    inquiry: {
      label: "2D mekân tasarımı için iletişime geçin",
      href: "/contact?package=space-design-2d",
    },
    showOnHomepage: false,
    order: 1,
  },
  {
    slug: "product-design",
    title: "Ürün Tasarımı",
    scopeLabel: "Tek bölüm",
    summary: "Mekân içinde tanımlı tek bir bölümün tasarlanmasına yönelik odaklı hizmet.",
    benefit: "Depolama, kullanım ve estetiği tek bir özel imalat çözümünde bir araya getirir.",
    pricingLabel: "Ürüne göre teklif",
    pricingNote: "Ölçü, malzeme ve imalat detayına göre hazırlanır.",
    image: {
      src: "/images/packages/product-design.webp",
      alt: "Özel tasarım depolama ünitesi, malzeme paleti ve ölçekli mobilya maketi",
      width: 1440,
      height: 720,
    },
    scopeItems: ["Seçilen tek bölümün tasarımı"],
    examples: ["TV ünitesi", "Kitaplık", "Vestiyer"],
    inquiry: {
      label: "Ürün tasarımı için iletişime geçin",
      href: "/contact?package=product-design",
    },
    showOnHomepage: false,
    order: 2,
  },
  {
    slug: "wall-design",
    title: "Duvar Tasarımı",
    scopeLabel: "Tek duvar",
    summary: "Mekândaki tek bir duvarın tasarlanmasına yönelik tanımlı hizmet kapsamı.",
    benefit:
      "Tek bir yüzeyi, mekânın kimliğini taşıyan güçlü ve işlevli bir odak noktasına dönüştürür.",
    pricingLabel: "Duvara göre teklif",
    pricingNote: "Duvar ölçüsü, işlev ve malzeme seçimiyle netleşir.",
    image: {
      src: "/images/packages/wall-design.webp",
      alt: "Katmanlı duvar tasarımı, bütünleşik aydınlatma ve depolama çözümü",
      width: 1440,
      height: 925,
    },
    scopeItems: ["Seçilen tek duvarın tasarımı"],
    inquiry: {
      label: "Duvar tasarımı için iletişime geçin",
      href: "/contact?package=wall-design",
    },
    showOnHomepage: false,
    order: 3,
  },
  {
    slug: "space-design-2d-3d",
    title: "Mekân Tasarımı — 2D + 3D",
    scopeLabel: "Tek mekân + 1 özel imalat mobilya",
    summary:
      "Tek bir mekânın detaylı analizi, 2D ve 3D sunumları ile bir özel imalat mobilya tasarımını bir araya getiren kapsam.",
    benefit:
      "Planı ve mekânsal atmosferi birlikte görmenizi, kararları uygulama öncesinde değerlendirmenizi sağlar.",
    pricingLabel: "Kapsama göre teklif",
    pricingNote: "Mekân, görselleştirme ve özel imalat kapsamıyla belirlenir.",
    image: {
      src: "/images/packages/space-design-2d-3d.webp",
      alt: "Kat planından tamamlanmış salon görselleştirmesine geçiş",
      width: 1440,
      height: 960,
    },
    scopeItems: [
      "Tek mekânın detaylı analizi",
      "İlgili mekâna yönelik tasarım",
      "1 özel imalat mobilya tasarımı",
    ],
    examples: ["Oda", "Salon", "Mutfak", "Çocuk odası", "Yatak odası"],
    presentationFormats: ["2D", "3D"],
    inquiry: {
      label: "2D + 3D mekân tasarımı için iletişime geçin",
      href: "/contact?package=space-design-2d-3d",
    },
    showOnHomepage: true,
    order: 4,
  },
  {
    slug: "commercial-space-design",
    title: "Ticari Mekân Tasarımı",
    scopeLabel: "Metrekareye göre değişen kapsam",
    summary:
      "Mağaza, dükkân ve ofis gibi ticari mekânlar için, metrekareye göre şekillenen 2D ve 3D sunumlu tasarım paketi.",
    benefit:
      "Müşteri akışını, marka hissini ve operasyonu aynı mekânsal kurgu içinde bütünleştirir.",
    pricingLabel: "m² + kapsama göre",
    pricingNote: "Alan, işlev programı ve sunum kapsamıyla tekliflendirilir.",
    image: {
      src: "/images/packages/commercial-space-design.webp",
      alt: "Akıcı müşteri rotasına ve güçlü servis tezgâhına sahip çağdaş kafe iç mekânı",
      width: 1440,
      height: 960,
    },
    scopeItems: ["Ticari mekâna yönelik tasarım"],
    examples: ["Mağaza", "Dükkân", "Ofis"],
    presentationFormats: ["2D", "3D"],
    scopeBasis: "Paket içeriği mekânın metrekaresine göre değişir.",
    inquiry: {
      label: "Ticari mekân kapsamı için iletişime geçin",
      href: "/contact?package=commercial-space-design",
    },
    showOnHomepage: true,
    order: 5,
  },
  {
    slug: "residential-design",
    title: "Konut Tasarımı",
    scopeLabel: "Metrekareye göre değişen kapsam",
    summary: "Konutlar için, metrekareye göre şekillenen 2D ve 3D sunumlu tasarım paketi.",
    benefit:
      "Evin farklı bölümlerini günlük yaşamınıza uyumlu, tutarlı ve sakin bir tasarım diliyle birleştirir.",
    pricingLabel: "m² + kapsama göre",
    pricingNote: "Konut alanı, oda sayısı ve proje kapsamıyla netleşir.",
    image: {
      src: "/images/packages/residential-design.webp",
      alt: "Salon, yemek ve giriş alanları uyumlu biçimde tasarlanmış çağdaş konut",
      width: 1440,
      height: 960,
    },
    scopeItems: ["Konuta yönelik tasarım"],
    presentationFormats: ["2D", "3D"],
    scopeBasis: "Paket içeriği konutun metrekaresine göre değişir.",
    inquiry: {
      label: "Konut tasarımı için iletişime geçin",
      href: "/contact?package=residential-design",
    },
    showOnHomepage: true,
    order: 6,
  },
  {
    slug: "online-design-consulting",
    title: "Online Tasarım Danışmanlığı",
    scopeLabel: "Online danışmanlık",
    summary:
      "Esinlenme panosu, renk danışmanlığı, ürün ve aksesuar seçimlerini kapsayan online tasarım hizmeti.",
    benefit:
      "Kararsızlığı azaltan, alışveriş ve renk seçimlerini uygulanabilir bir yol haritasına dönüştüren uzaktan destek sunar.",
    pricingLabel: "İhtiyaca göre teklif",
    pricingNote: "Görüşme konusu ve danışmanlık kapsamıyla belirlenir.",
    image: {
      src: "/images/packages/online-design-consulting.webp",
      alt: "Dizüstü bilgisayar, renk kartelaları, malzeme örnekleri ve oda maketiyle online tasarım masası",
      width: 1440,
      height: 961,
    },
    scopeItems: ["Esinlenme panosu", "Renk danışmanlığı", "Ürün seçimleri", "Aksesuar seçimleri"],
    inquiry: {
      label: "Online danışmanlık için iletişime geçin",
      href: "/contact?package=online-design-consulting",
    },
    showOnHomepage: false,
    order: 7,
  },
] as const satisfies readonly DesignPackage[];

export const getFallbackPackageBySlug = (slug: string): DesignPackage | undefined =>
  fallbackPackages.find((designPackage) => designPackage.slug === slug);
