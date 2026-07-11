import type { DesignPackage } from "@/types";

export const fallbackPackages = [
  {
    slug: "space-design-2d",
    title: "Mekân Tasarımı — 2D",
    scopeLabel: "Tek mekân",
    summary:
      "Tek bir mekânın detaylı analizi ve bu mekân için geliştirilen tasarımın 2D sunumlarla aktarılması.",
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
