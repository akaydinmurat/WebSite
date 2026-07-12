import type {
  Project,
  ProjectCategory,
  ProjectCategoryId,
  ProjectFact,
  ProjectVisual,
  ProjectVisualVariant,
} from "@/types";

interface PortfolioRecord {
  slug: string;
  title: string;
  type: string;
  category: ProjectCategoryId;
  year: string;
  location: string;
  imageSrc: `/images/${string}`;
  featured?: boolean;
}

const portfolioNotice =
  "Bu kayıt ve kapak görseli mevcut portföyden aktarılmıştır. Ayrıntılı proje hikâyesi ile ek uygulama görsellerinin arşiv aktarımı sürmektedir.";

export const projectCategories = [
  {
    id: "kitchen",
    label: "Mutfak",
    description: "Mutfak projeleri",
  },
  {
    id: "bathroom",
    label: "Banyo",
    description: "Banyo projeleri",
  },
  {
    id: "bedroom",
    label: "Odalar",
    description: "Yatak ve genç odası projeleri",
  },
  {
    id: "living-room",
    label: "Salon",
    description: "Yaşam alanı projeleri",
  },
  {
    id: "commercial",
    label: "Ticari",
    description: "Kafe, mağaza ve ticari mekân projeleri",
  },
] as const satisfies readonly ProjectCategory[];

const portfolioRecords = [
  {
    slug: "bm-evi-mutfak",
    title: "B.M. Evi Mutfak Projesi",
    type: "Mutfak tasarımı",
    category: "kitchen",
    year: "2024",
    location: "Ümitköy, Ankara",
    imageSrc: "/images/projects/archive/bm-evi-mutfak.jpg",
    featured: true,
  },
  {
    slug: "es-evi-banyo",
    title: "E.S. Evi Banyo Projesi",
    type: "Banyo tasarımı",
    category: "bathroom",
    year: "2024",
    location: "İncek, Ankara",
    imageSrc: "/images/projects/archive/es-evi-banyo.jpg",
  },
  {
    slug: "aa-evi-yatak-odasi",
    title: "A.A. Evi Yatak Odası Projesi",
    type: "Yatak odası tasarımı",
    category: "bedroom",
    year: "2024",
    location: "Beytepe, Ankara",
    imageSrc: "/images/projects/archive/aa-evi-yatak-odasi.jpg",
    featured: true,
  },
  {
    slug: "sf-evi-genc-odasi",
    title: "S.F. Evi Genç Odası Projesi",
    type: "Genç odası tasarımı",
    category: "bedroom",
    year: "2024",
    location: "Ankara",
    imageSrc: "/images/projects/archive/sf-evi-genc-odasi.jpg",
  },
  {
    slug: "cd-evi-mutfak",
    title: "C.D. Evi Mutfak Projesi",
    type: "Mutfak tasarımı",
    category: "kitchen",
    year: "2024",
    location: "Ankara",
    imageSrc: "/images/projects/archive/cd-evi-mutfak.jpg",
  },
  {
    slug: "gy-evi-salon",
    title: "G.Y. Evi Salon Projesi",
    type: "Salon tasarımı",
    category: "living-room",
    year: "2023",
    location: "Ankara",
    imageSrc: "/images/projects/archive/gy-evi-salon.jpg",
  },
  {
    slug: "ag-evi-banyo",
    title: "A.G. Evi Banyo Projesi",
    type: "Banyo tasarımı",
    category: "bathroom",
    year: "2023",
    location: "Sivas",
    imageSrc: "/images/projects/archive/ag-evi-banyo.jpg",
  },
  {
    slug: "rozzis-chocolate-cafe",
    title: "Rozzi's Chocolate & Cafe",
    type: "Ticari mekân tasarımı",
    category: "commercial",
    year: "2024",
    location: "İstanbul",
    imageSrc: "/images/projects/archive/rozzis-chocolate-cafe.jpg",
    featured: true,
  },
] as const satisfies readonly PortfolioRecord[];

const visualVariants = [
  "layered-plane",
  "material-study",
  "arched-shadow",
  "light-well",
  "soft-portal",
] as const satisfies readonly ProjectVisualVariant[];

const visualBackgrounds = [
  "linear-gradient(128deg,#121617 0 22%,#4a5557 22% 48%,#b8c0bd 48% 72%,#4b2434 72%)",
  "radial-gradient(circle at 68% 24%,#c7a2b2 0 9%,transparent 31%),linear-gradient(138deg,#171d1f,#6b3047 48%,#c9cecb 70%,#354043)",
  "linear-gradient(102deg,#0e1213 0 28%,#596467 28% 45%,#aeb7b4 45% 72%,#4d2132 72%)",
  "radial-gradient(ellipse at 36% 88%,#87536a 0 24%,transparent 25%),linear-gradient(146deg,#e7e9e6,#6f7a7c 46%,#171d1f 78%)",
  "linear-gradient(165deg,rgba(201,206,203,.76) 0 31%,transparent 31%),linear-gradient(48deg,#121617 0 48%,#596467 48% 71%,#b8c0bd 71%)",
] as const;

function createFacts(record: PortfolioRecord): readonly ProjectFact[] {
  return [
    {
      id: "type",
      label: "Proje Türü",
      value: record.type,
      isPlaceholder: false,
    },
    {
      id: "location",
      label: "Konum",
      value: record.location,
      isPlaceholder: false,
    },
    {
      id: "year",
      label: "Yıl",
      value: record.year,
      isPlaceholder: false,
    },
    {
      id: "status",
      label: "Arşiv Durumu",
      value: "Kapak görseli aktarıldı",
      isPlaceholder: false,
    },
  ];
}

function createVisual(record: PortfolioRecord, index: number, suffix: string): ProjectVisual {
  return {
    id: `${record.slug}-${suffix}`,
    kind: "image",
    src: record.imageSrc,
    layout: suffix === "cover" ? "cover" : "landscape",
    variant: visualVariants[index % visualVariants.length],
    aspectRatio: suffix === "cover" ? "16/10" : "3/2",
    background: visualBackgrounds[index % visualBackgrounds.length],
    alt: `${record.title} için hazırlanmış iç mekân tasarım görseli`,
    caption: "Mevcut proje arşivinden aktarılan tasarım görseli.",
  };
}

function createProject(record: PortfolioRecord, index: number): Project {
  const nextRecord = portfolioRecords[(index + 1) % portfolioRecords.length];

  return {
    slug: record.slug,
    title: record.title,
    category: record.category,
    excerpt: `${record.year} · ${record.location}. Mevcut portföyden ${record.type.toLocaleLowerCase("tr-TR")} kaydı.`,
    description:
      "Bu proje kaydı mevcut portföyden yeni siteye taşınmıştır. Ayrıntılı tasarım hikâyesi, gerçek proje görsellerinin aktarılmasıyla birlikte yayımlanacaktır.",
    concept: {
      eyebrow: "Portföy Notu",
      title: "Proje anlatısı, görsel arşivle birlikte tamamlanacak.",
      paragraphs: [
        `${record.title}, mevcut portföyde ${record.year} yılı ve ${record.location} bilgileriyle yayımlanan bir ${record.type.toLocaleLowerCase("tr-TR")} çalışmasıdır.`,
        "Tasarım kararları, uygulama kapsamı ve malzeme bilgileri kaynak içerikte yer almadığı için bu aşamada herhangi bir ayrıntı üretilmemiştir.",
      ],
    },
    facts: createFacts(record),
    cover: createVisual(record, index, "cover"),
    gallery: [createVisual(record, index + 1, "archive")],
    materials: [],
    relatedProjectSlug: nextRecord?.slug ?? portfolioRecords[0].slug,
    featured: record.featured === true,
    order: index + 1,
    isDemo: false,
    demoNotice: portfolioNotice,
    inquiryPrompt: `${record.title} benzeri bir proje için tasarım ihtiyacınızı paylaşmak ister misiniz?`,
    seo: {
      title: record.title,
      description: `${record.title}; ${record.year}, ${record.location}. Göknur Uygur Akaydın proje arşivi.`,
      noIndex: true,
    },
  };
}

export const fallbackProjects = portfolioRecords.map(createProject) satisfies readonly Project[];

export const getFallbackProjectBySlug = (slug: string): Project | undefined =>
  fallbackProjects.find((project) => project.slug === slug);

export const getProjectCategoryById = (id: ProjectCategoryId): ProjectCategory | undefined =>
  projectCategories.find((category) => category.id === id);
