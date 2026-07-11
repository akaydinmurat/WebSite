import type { DesignPackage, PackageDeliveryTime, PackageStartingPrice } from "@/types";

const scopeNotice =
  "Paket kapsamı mevcut hizmet tanımını yansıtır. Teslim takvimi, revizyon ve ücret; mekânın ölçüsü ile proje ihtiyacı görüldükten sonra teklif aşamasında netleştirilir.";

const startingPrice = {
  amount: null,
  currency: "TRY",
  label: "Teklif ile belirlenir",
  isPlaceholder: true,
  note: "Canlı portföyde doğrulanmış bir başlangıç fiyatı bulunmadığı için fiyat üretilmemiştir.",
} as const satisfies PackageStartingPrice;

const deliveryTime = {
  label: "Kapsama göre planlanır",
  isIndicative: true,
  note: "Teslim süresi; ölçü, sunum içeriği ve proje yoğunluğu değerlendirildikten sonra paylaşılır.",
} as const satisfies PackageDeliveryTime;

const revisionPolicy = {
  rounds: null,
  label: "Teklifte netleşir",
  isIndicative: true,
  note: "Mevcut hizmet sayfasında revizyon sayısı belirtilmediği için sayı üretilmemiştir.",
} as const;

export const fallbackPackages = [
  {
    slug: "space-design-one",
    title: "Mekân Tasarımı — 1",
    shortTitle: "Mekân 1",
    summary:
      "Tek bir mekânın detaylı analizi ve geliştirilen tasarımın 2D sunumlarla aktarılması için oluşturulan kapsam.",
    idealFor:
      "Oda, salon, mutfak, çocuk odası veya yatak odası gibi tek bir mekân için 2D tasarım desteği isteyenler için.",
    includedServices: [
      "Tek mekânın detaylı analizi",
      "Mekâna özel tasarım yaklaşımı",
      "2D tasarım sunumları",
      "3D görsel bu kapsama dahil değildir",
    ],
    revisionPolicy,
    deliveryTime,
    startingPrice,
    inquiry: { label: "Mekân Tasarımı 1'i sorun", href: "/contact?package=space-design-one" },
    featured: false,
    order: 1,
    isDemo: false,
    demoNotice: scopeNotice,
  },
  {
    slug: "product-design",
    title: "Ürün Tasarımı",
    shortTitle: "Ürün",
    summary:
      "Mekân içindeki tek bir bölümün veya özel imalat elemanının odaklı biçimde tasarlanması.",
    idealFor:
      "TV ünitesi, kitaplık, vestiyer veya benzeri tek bir bölüm tasarlatmak isteyenler için.",
    includedServices: [
      "Tasarım ihtiyacının değerlendirilmesi",
      "Seçilen bölüme özel tasarım",
      "Mekânla uyumlu ölçü ve malzeme yaklaşımı",
    ],
    revisionPolicy,
    deliveryTime,
    startingPrice,
    inquiry: { label: "Ürün tasarımını sorun", href: "/contact?package=product-design" },
    featured: false,
    order: 2,
    isDemo: false,
    demoNotice: scopeNotice,
  },
  {
    slug: "wall-design",
    title: "Duvar Tasarımı",
    shortTitle: "Duvar",
    summary:
      "Mekândaki tek bir duvarı işlev, kompozisyon ve görsel bütünlük açısından ele alan kompakt tasarım kapsamı.",
    idealFor: "Tek bir duvara odaklanan, kontrollü ve tanımlı bir tasarım çözümü isteyenler için.",
    includedServices: [
      "Mevcut duvarın değerlendirilmesi",
      "Tek duvara özel tasarım yaklaşımı",
      "Renk, malzeme ve eleman yerleşimi",
    ],
    revisionPolicy,
    deliveryTime,
    startingPrice,
    inquiry: { label: "Duvar tasarımını sorun", href: "/contact?package=wall-design" },
    featured: false,
    order: 3,
    isDemo: false,
    demoNotice: scopeNotice,
  },
  {
    slug: "space-design-two",
    title: "Mekân Tasarımı — 2",
    shortTitle: "Mekân 2",
    summary:
      "Tek bir mekânın detaylı analizi, 2D ve 3D sunumları ile bir özel imalat mobilya tasarımını birleştiren kapsam.",
    idealFor:
      "Tek mekân için tasarım kararlarını daha kapsamlı görsel sunumlarla değerlendirmek isteyenler için.",
    includedServices: [
      "Tek mekânın detaylı analizi",
      "2D tasarım sunumları",
      "3D görsel sunumlar",
      "1 özel imalat mobilya tasarımı",
    ],
    revisionPolicy,
    deliveryTime,
    startingPrice,
    inquiry: { label: "Mekân Tasarımı 2'yi sorun", href: "/contact?package=space-design-two" },
    featured: true,
    order: 4,
    isDemo: false,
    demoNotice: scopeNotice,
  },
  {
    slug: "commercial-spaces",
    title: "Ticari Mekân Paketi",
    shortTitle: "Ticari",
    summary:
      "Mağaza, dükkân ve ofis gibi ticari mekânlar için metrekareye göre şekillenen 2D ve 3D tasarım kapsamı.",
    idealFor:
      "Ticari alanının işlevini ve marka kimliğini birlikte ele almak isteyen işletmeler için.",
    includedServices: [
      "Ticari mekân ihtiyaç analizi",
      "Metrekareye göre belirlenen kapsam",
      "2D tasarım sunumları",
      "3D görsel sunumlar",
    ],
    revisionPolicy,
    deliveryTime,
    startingPrice,
    inquiry: { label: "Ticari paketi sorun", href: "/contact?package=commercial-spaces" },
    featured: true,
    order: 5,
    isDemo: false,
    demoNotice: scopeNotice,
  },
  {
    slug: "residential-spaces",
    title: "Konut Paketi",
    shortTitle: "Konut",
    summary:
      "Konutlar için metrekareye ve ihtiyaç programına göre şekillenen, 2D ve 3D sunumlar içeren tasarım kapsamı.",
    idealFor:
      "Birden fazla yaşam alanını veya konutun bütününü birlikte tasarlatmak isteyenler için.",
    includedServices: [
      "Konut ihtiyaç programı",
      "Metrekareye göre belirlenen kapsam",
      "2D tasarım sunumları",
      "3D görsel sunumlar",
    ],
    revisionPolicy,
    deliveryTime,
    startingPrice,
    inquiry: { label: "Konut paketini sorun", href: "/contact?package=residential-spaces" },
    featured: true,
    order: 6,
    isDemo: false,
    demoNotice: scopeNotice,
  },
  {
    slug: "online-consulting",
    title: "Online Danışmanlık Paketi",
    shortTitle: "Online",
    summary:
      "Esinlenme panosu, renk danışmanlığı, ürün ve aksesuar seçimlerini çevrim içi görüşmelerle netleştiren kapsam.",
    idealFor:
      "Mekânındaki belirli tasarım kararlarında uzaktan profesyonel yönlendirme almak isteyenler için.",
    includedServices: [
      "Esinlenme panosu",
      "Renk danışmanlığı",
      "Ürün seçimleri",
      "Aksesuar seçimleri",
    ],
    revisionPolicy,
    deliveryTime,
    startingPrice,
    inquiry: { label: "Online danışmanlığı sorun", href: "/contact?package=online-consulting" },
    featured: false,
    order: 7,
    isDemo: false,
    demoNotice: scopeNotice,
  },
] as const satisfies readonly DesignPackage[];

export const getFallbackPackageBySlug = (slug: string): DesignPackage | undefined =>
  fallbackPackages.find((designPackage) => designPackage.slug === slug);
