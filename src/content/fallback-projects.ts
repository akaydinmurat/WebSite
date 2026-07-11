import type {
  Project,
  ProjectCategory,
  ProjectCategoryId,
  ProjectFact,
  ProjectVisual,
} from "@/types";

const demoNotice =
  "Bu çalışma, site deneyimini göstermek için üretilmiş kavramsal bir demo projedir. Gerçek bir müşteri, konum veya uygulamayı temsil etmez.";

const createDemoFacts = (type: string): readonly ProjectFact[] => [
  {
    id: "type",
    label: "Çalışma türü",
    value: `${type} · Kavramsal demo`,
    isPlaceholder: true,
  },
  {
    id: "location",
    label: "Konum",
    value: "Gerçek proje konumu yok",
    isPlaceholder: true,
  },
  {
    id: "year",
    label: "Yıl",
    value: "Demo içerik",
    isPlaceholder: true,
  },
  {
    id: "area",
    label: "Alan",
    value: "Belirtilmedi",
    isPlaceholder: true,
  },
  {
    id: "status",
    label: "Durum",
    value: "Uygulanmamış konsept",
    isPlaceholder: true,
  },
];

const createVisual = (visual: Omit<ProjectVisual, "kind">): ProjectVisual => ({
  kind: "css-placeholder",
  ...visual,
});

export const projectCategories = [
  {
    id: "residential",
    label: "Konut",
    description: "Bütüncül konut atmosferleri için kavramsal çalışmalar.",
  },
  {
    id: "living-room",
    label: "Yaşam Alanı",
    description: "Bir arada olma ve dinlenme ritüellerine odaklanan mekânlar.",
  },
  {
    id: "kitchen",
    label: "Mutfak",
    description: "İşlev, ışık ve malzeme dengesini araştıran mutfak önerileri.",
  },
  {
    id: "bedroom",
    label: "Yatak Odası",
    description: "Sakinlik, mahremiyet ve dinlenme çevresinde şekillenen odalar.",
  },
  {
    id: "visualization",
    label: "3D Görselleştirme",
    description: "Henüz uygulanmamış fikirleri atmosfer üzerinden anlatan sahneler.",
  },
] as const satisfies readonly ProjectCategory[];

export const fallbackProjects = [
  {
    slug: "sessiz-esik",
    title: "Sessiz Eşik — Demo",
    category: "living-room",
    excerpt:
      "Günün farklı saatlerinde değişen ışığı, yumuşak geçişler ve düşük kontrastlı yüzeylerle karşılayan kavramsal bir yaşam alanı.",
    description:
      "Salon ile geçiş alanı arasındaki sınırı incelten bu demo çalışma, dolaşımı kesmeden farklı kullanım anları tarif ediyor.",
    concept: {
      eyebrow: "Kavramsal yaklaşım",
      title: "Sınır çizmek yerine geçiş hissi kurmak.",
      paragraphs: [
        "Kurgunun merkezinde, oturma alanını tek bir bakışta tüketmek yerine katmanlar hâlinde görünür kılan yumuşak bir eşik bulunuyor. Mobilya yerleşimi sohbet, dinlenme ve yalnız kalma anları arasında doğal bir akış öneriyor.",
        "Açık mineral tonları gün ışığını içeri taşırken koyu ahşap yüzeyler kompozisyona ağırlık kazandırıyor. Bu malzeme paleti bir uygulama beyanı değil, demo anlatının kavramsal parçasıdır.",
      ],
    },
    facts: createDemoFacts("Yaşam alanı tasarımı"),
    cover: createVisual({
      id: "sessiz-esik-cover",
      layout: "cover",
      variant: "soft-portal",
      aspectRatio: "16/10",
      background:
        "radial-gradient(circle at 68% 32%, rgba(244,231,208,.94) 0 12%, transparent 38%), linear-gradient(118deg, #262421 0 24%, #918678 24% 42%, #d7c8b5 42% 72%, #6e6256 72% 100%)",
      alt: "Gerçek bir projeyi temsil etmeyen, sıcak ışık ve katmanlı duvar yüzeylerinden oluşan soyut salon demo kompozisyonu",
      caption: "CSS ile oluşturulmuş kavramsal kapak kompozisyonu.",
    }),
    gallery: [
      createVisual({
        id: "sessiz-esik-light",
        layout: "panorama",
        variant: "light-well",
        aspectRatio: "21/9",
        background:
          "linear-gradient(102deg, #282521 0 18%, #b0a28e 18% 44%, #eee3d1 44% 62%, #85786a 62% 82%, #38332d 82%)",
        alt: "Soyut ışık boşluğu ve yatay yüzey katmanlarını gösteren demo görsel",
        caption: "Işığın yatay kompozisyon içindeki ritmi.",
      }),
      createVisual({
        id: "sessiz-esik-seat",
        layout: "diptych-left",
        variant: "layered-plane",
        aspectRatio: "4/5",
        background:
          "radial-gradient(ellipse at 48% 72%, #8f7d6c 0 22%, transparent 23%), linear-gradient(154deg, #d8cabb 0 50%, #554c43 50% 100%)",
        alt: "Oturma elemanı ve iki tonlu yüzey ilişkisini soyutlayan demo kompozisyon",
        caption: "Oturma odağı için oran çalışması.",
      }),
      createVisual({
        id: "sessiz-esik-detail",
        layout: "diptych-right",
        variant: "material-study",
        aspectRatio: "4/5",
        background:
          "repeating-linear-gradient(90deg, rgba(255,255,255,.04) 0 1px, transparent 1px 18px), linear-gradient(135deg, #332f2a, #a7937d 48%, #d6c6b2 48%)",
        alt: "Ahşap ve mineral tonları çağrıştıran soyut demo malzeme çalışması",
        caption: "Kavramsal doku ve birleşim detayı.",
      }),
    ],
    materials: [
      {
        name: "Kireç taşı tonu",
        description: "Işığı yumuşatan açık mineral yüzey önerisi.",
        swatch: "#D8CDBD",
        isConceptual: true,
      },
      {
        name: "Koyu meşe tonu",
        description: "Açık yüzeylere ritim veren sıcak ahşap önerisi.",
        swatch: "#4B4138",
        isConceptual: true,
      },
      {
        name: "Dokulu keten",
        description: "Oturma elemanlarında sakin ve mat bir doku önerisi.",
        swatch: "#B9A995",
        isConceptual: true,
      },
      {
        name: "Eskitilmiş metal tonu",
        description: "İnce detaylarda düşük parlaklıklı vurgu önerisi.",
        swatch: "#82715E",
        isConceptual: true,
      },
    ],
    relatedProjectSlug: "katmanli-isik",
    featured: true,
    order: 1,
    isDemo: true,
    demoNotice,
    inquiryPrompt: "Benzer bir atmosferi kendi yaşam alanınız için değerlendirmek ister misiniz?",
    seo: {
      title: "Sessiz Eşik — Kavramsal Demo Proje",
      description:
        "Murat Akaydın Studio web deneyimi için hazırlanmış, gerçek bir uygulamayı temsil etmeyen kavramsal yaşam alanı demosu.",
    },
  },
  {
    slug: "katmanli-isik",
    title: "Katmanlı Işık — Demo",
    category: "kitchen",
    excerpt:
      "Hazırlık, paylaşım ve depolama işlevlerini tek bir sakin hacim içinde birleştiren kavramsal mutfak senaryosu.",
    description:
      "Bu demo kurgu, mutfağı yalnızca üretim alanı olarak değil günün ritmini taşıyan sosyal bir merkez olarak ele alıyor.",
    concept: {
      eyebrow: "Kavramsal yaklaşım",
      title: "İşlevi saklamadan görsel sakinlik yaratmak.",
      paragraphs: [
        "Yüksek depolama yüzeyi hacmin sınırını belirlerken bağımsız hazırlık adası hareketi merkezde topluyor. Çalışma ışığı ile atmosfer ışığı ayrı katmanlar hâlinde düşünülerek gün içindeki farklı kullanımlara uyum sağlayan bir senaryo kuruluyor.",
        "Taş, açık ahşap ve fırçalı metal tonları arasındaki geçişler keskin kontrastlar yerine yakın dokularla tarif ediliyor. Tüm detaylar yalnızca kavramsal demo kapsamındadır.",
      ],
    },
    facts: createDemoFacts("Mutfak tasarımı"),
    cover: createVisual({
      id: "katmanli-isik-cover",
      layout: "cover",
      variant: "layered-plane",
      aspectRatio: "16/10",
      background:
        "linear-gradient(90deg, rgba(35,31,27,.96) 0 16%, transparent 16% 18%, rgba(217,198,173,.92) 18% 56%, rgba(106,91,74,.95) 56% 72%, #2a2723 72%), linear-gradient(#d8c8b2, #736555)",
      alt: "Gerçek bir mutfağı temsil etmeyen, ada ve yüksek dolap oranlarını soyutlayan demo kompozisyon",
      caption: "CSS ile oluşturulmuş kavramsal mutfak kapak görseli.",
    }),
    gallery: [
      createVisual({
        id: "katmanli-isik-island",
        layout: "landscape",
        variant: "material-study",
        aspectRatio: "3/2",
        background:
          "linear-gradient(170deg, transparent 0 46%, rgba(50,44,38,.86) 46% 70%, transparent 70%), radial-gradient(circle at 64% 22%, #f4dfbd, #a99378 32%, #38332d 72%)",
        alt: "Hazırlık adasını ve üstten gelen sıcak ışığı soyutlayan demo görsel",
        caption: "Merkez ada ve ışık ilişkisi.",
      }),
      createVisual({
        id: "katmanli-isik-storage",
        layout: "portrait",
        variant: "layered-plane",
        aspectRatio: "4/5",
        background:
          "repeating-linear-gradient(90deg, #574b3f 0 23%, #6d5e4e 23% 24%, #574b3f 24% 48%), linear-gradient(#c7b39a, #3c352e)",
        alt: "Düşey dolap modüllerini ritmik yüzeylerle anlatan kavramsal demo görsel",
        caption: "Düşey depolama ritmi.",
      }),
      createVisual({
        id: "katmanli-isik-surface",
        layout: "square",
        variant: "material-study",
        aspectRatio: "1/1",
        background:
          "radial-gradient(circle at 30% 32%, rgba(246,230,203,.7), transparent 18%), linear-gradient(125deg, #b7a890 0 38%, #d9cfbf 38% 67%, #625447 67%)",
        alt: "Taş, ahşap ve metal tonlarının kesişimini gösteren soyut demo yüzey çalışması",
        caption: "Kavramsal yüzey birleşimi.",
      }),
    ],
    materials: [
      {
        name: "Açık traverten tonu",
        description: "Tezgâh ve sıçrama yüzeyi için mineral öneri.",
        swatch: "#CFC1AA",
        isConceptual: true,
      },
      {
        name: "Füme meşe tonu",
        description: "Yüksek depolama kütlesi için koyu ahşap önerisi.",
        swatch: "#574A3D",
        isConceptual: true,
      },
      {
        name: "Fırçalı nikel tonu",
        description: "Armatür ve ince detaylar için mat metal önerisi.",
        swatch: "#918D84",
        isConceptual: true,
      },
      {
        name: "Kum rengi sıva",
        description: "Yansımayı azaltan sıcak duvar yüzeyi önerisi.",
        swatch: "#B9A78F",
        isConceptual: true,
      },
    ],
    relatedProjectSlug: "yumusak-ufuk",
    featured: true,
    order: 2,
    isDemo: true,
    demoNotice,
    inquiryPrompt: "Mutfağınız için işlev ve atmosferi birlikte ele alalım mı?",
    seo: {
      title: "Katmanlı Işık — Kavramsal Demo Proje",
      description:
        "Murat Akaydın Studio web deneyimi için hazırlanmış, gerçek bir uygulamayı temsil etmeyen kavramsal mutfak demosu.",
    },
  },
  {
    slug: "yumusak-ufuk",
    title: "Yumuşak Ufuk — Demo",
    category: "residential",
    excerpt:
      "Konutun farklı bölümlerini ortak bir malzeme ritmiyle bağlayan, kesintisiz ve sıcak bir demo iç mekân anlatısı.",
    description:
      "Kavramsal konut çalışması, odalar arasında aynı dili tekrar etmek yerine ışık ve oran üzerinden bir akrabalık kuruyor.",
    concept: {
      eyebrow: "Kavramsal yaklaşım",
      title: "Bütünlüğü benzerlikten değil ritimden üretmek.",
      paragraphs: [
        "Girişten yaşam alanına uzanan görüş hattı, alçak ve yüksek hacimlerin kontrollü sıralanışıyla kuruluyor. Ortak malzeme ailesi her bölümde farklı yoğunlukta kullanılarak evin tekdüze görünmeden birlikte okunması hedefleniyor.",
        "Doğal tonlar ve gölgeli nişler, sergileme ile saklama ihtiyacını aynı yüzeyde buluşturuyor. Senaryo, herhangi bir gerçek konuta ait olmayan bir demo çalışmadır.",
      ],
    },
    facts: createDemoFacts("Bütüncül konut tasarımı"),
    cover: createVisual({
      id: "yumusak-ufuk-cover",
      layout: "cover",
      variant: "arched-shadow",
      aspectRatio: "16/10",
      background:
        "radial-gradient(ellipse at 72% 8%, rgba(248,225,191,.88) 0 13%, transparent 42%), radial-gradient(ellipse at 32% 102%, #80705f 0 29%, transparent 30%), linear-gradient(115deg, #252321, #a69784 48%, #d8c9b7 72%, #5a5047)",
      alt: "Gerçek bir konutu temsil etmeyen, kemerli gölge ve yatay hacimlerden oluşan soyut demo kompozisyon",
      caption: "CSS ile oluşturulmuş bütüncül konut demo görseli.",
    }),
    gallery: [
      createVisual({
        id: "yumusak-ufuk-axis",
        layout: "panorama",
        variant: "soft-portal",
        aspectRatio: "21/9",
        background:
          "radial-gradient(ellipse at 52% 50%, rgba(231,216,195,.92) 0 19%, transparent 20%), linear-gradient(90deg, #312d28 0 28%, #8e806e 28% 71%, #403a33 71%)",
        alt: "Odalar arası görüş hattını soyut bir açıklıkla gösteren demo görsel",
        caption: "Konut boyunca devam eden görüş aksı.",
      }),
      createVisual({
        id: "yumusak-ufuk-niche",
        layout: "diptych-left",
        variant: "arched-shadow",
        aspectRatio: "4/5",
        background:
          "radial-gradient(ellipse at 50% 76%, #b6a58f 0 27%, transparent 28%), linear-gradient(128deg, #d8cbb8, #5c5147 72%)",
        alt: "Gölgeli bir nişi ve sergileme yüzeyini soyutlayan kavramsal demo kompozisyon",
        caption: "Saklama ve sergileme için niş önerisi.",
      }),
      createVisual({
        id: "yumusak-ufuk-threshold",
        layout: "diptych-right",
        variant: "light-well",
        aspectRatio: "4/5",
        background:
          "linear-gradient(105deg, #4b443b 0 33%, #c7b49b 33% 35%, #e5d7c3 35% 66%, #716456 66%)",
        alt: "Işıkla tanımlanan iki mekân eşiğini gösteren soyut demo görsel",
        caption: "Işıkla belirginleşen geçiş yüzeyi.",
      }),
    ],
    materials: [
      {
        name: "Kum beji mineral yüzey",
        description: "Farklı odaları bağlayan ana ton önerisi.",
        swatch: "#C6B49D",
        isConceptual: true,
      },
      {
        name: "Ceviz tonu",
        description: "Sabit mobilyalarda sıcak odaklar kuran ahşap önerisi.",
        swatch: "#665445",
        isConceptual: true,
      },
      {
        name: "Kırık beyaz tekstil",
        description: "Gün ışığını dağıtan hafif tekstil önerisi.",
        swatch: "#E3DACD",
        isConceptual: true,
      },
      {
        name: "Koyu bronz tonu",
        description: "Kapı ve aydınlatma detayları için vurgu önerisi.",
        swatch: "#65584B",
        isConceptual: true,
      },
    ],
    relatedProjectSlug: "golge-odasi",
    featured: true,
    order: 3,
    isDemo: true,
    demoNotice,
    inquiryPrompt: "Evinizin tamamı için tutarlı bir tasarım dili oluşturalım mı?",
    seo: {
      title: "Yumuşak Ufuk — Kavramsal Demo Proje",
      description:
        "Murat Akaydın Studio web deneyimi için hazırlanmış, gerçek bir uygulamayı temsil etmeyen kavramsal konut demosu.",
    },
  },
  {
    slug: "golge-odasi",
    title: "Gölge Odası — Demo",
    category: "bedroom",
    excerpt:
      "Dinlenme ritüelini düşük ışık, dokulu yüzeyler ve ölçülü kontrastlarla çevreleyen kavramsal yatak odası.",
    description:
      "Bu demo çalışma, yatak odasında görsel sessizliği boşlukla değil, farklı koyulukların dengesiyle kurmayı araştırıyor.",
    concept: {
      eyebrow: "Kavramsal yaklaşım",
      title: "Karanlığı eksiklik değil, dinlenme yüzeyi olarak görmek.",
      paragraphs: [
        "Yatak başı duvarı, sabit mobilya ile aydınlatmayı tek bir yatay çizgide topluyor. Dolaylı ışık yüzeyleri doğrudan aydınlatmak yerine derinliği görünür kılıyor ve akşam kullanımına sakin bir tempo öneriyor.",
        "Koyu taş, yün ve mat ahşap tonları arasındaki yakınlık dokunsal bir bütünlük kuruyor. Malzemeler yalnızca kavramsal palet önerileridir.",
      ],
    },
    facts: createDemoFacts("Yatak odası tasarımı"),
    cover: createVisual({
      id: "golge-odasi-cover",
      layout: "cover",
      variant: "light-well",
      aspectRatio: "16/10",
      background:
        "radial-gradient(ellipse at 70% 28%, rgba(207,177,136,.62), transparent 26%), linear-gradient(112deg, #171817 0 28%, #46423d 28% 58%, #9b8872 58% 72%, #282725 72%)",
      alt: "Gerçek bir yatak odasını temsil etmeyen, koyu yüzeyler ve dolaylı ışık içeren soyut demo kompozisyon",
      caption: "CSS ile oluşturulmuş kavramsal yatak odası sahnesi.",
    }),
    gallery: [
      createVisual({
        id: "golge-odasi-headboard",
        layout: "landscape",
        variant: "layered-plane",
        aspectRatio: "3/2",
        background:
          "linear-gradient(0deg, #242422 0 34%, transparent 34%), linear-gradient(90deg, #3e3b37, #a28c73 46%, #373532 47%)",
        alt: "Yatay yatak başı çizgisini ve yumuşak ışığı soyutlayan demo görsel",
        caption: "Yatak başı ve dolaylı ışık katmanı.",
      }),
      createVisual({
        id: "golge-odasi-textile",
        layout: "portrait",
        variant: "material-study",
        aspectRatio: "4/5",
        background:
          "repeating-linear-gradient(28deg, rgba(255,255,255,.035) 0 2px, transparent 2px 8px), linear-gradient(140deg, #a3927d, #47423d 52%, #262624)",
        alt: "Yünlü tekstil ve mat yüzey hissini aktaran soyut demo doku çalışması",
        caption: "Kavramsal tekstil ve yüzey katmanı.",
      }),
      createVisual({
        id: "golge-odasi-night",
        layout: "square",
        variant: "light-well",
        aspectRatio: "1/1",
        background:
          "radial-gradient(circle at 38% 32%, rgba(224,183,126,.66) 0 8%, transparent 34%), linear-gradient(132deg, #161716, #4b443d 72%, #292724)",
        alt: "Akşam aydınlatmasının koyu yüzey üzerindeki etkisini soyutlayan demo görsel",
        caption: "Akşam kullanımına yönelik ışık senaryosu.",
      }),
    ],
    materials: [
      {
        name: "Kömür rengi taş",
        description: "Yatak başı yüzeyinde derinlik veren mineral öneri.",
        swatch: "#393937",
        isConceptual: true,
      },
      {
        name: "Mat füme ahşap",
        description: "Sabit mobilyalarda düşük kontrastlı ahşap önerisi.",
        swatch: "#504A44",
        isConceptual: true,
      },
      {
        name: "Vizon yün dokusu",
        description: "Yumuşak yüzeylerde dokunsal sıcaklık önerisi.",
        swatch: "#9B8C7B",
        isConceptual: true,
      },
      {
        name: "Sıcak amber ışık",
        description: "Dolaylı aydınlatmada kullanılacak renk sıcaklığı fikri.",
        swatch: "#C49A68",
        isConceptual: true,
      },
    ],
    relatedProjectSlug: "mineral-sessizlik",
    featured: false,
    order: 4,
    isDemo: true,
    demoNotice,
    inquiryPrompt: "Dinlenme alanınız için daha sakin bir atmosfer kurgulayalım mı?",
    seo: {
      title: "Gölge Odası — Kavramsal Demo Proje",
      description:
        "Murat Akaydın Studio web deneyimi için hazırlanmış, gerçek bir uygulamayı temsil etmeyen kavramsal yatak odası demosu.",
    },
  },
  {
    slug: "mineral-sessizlik",
    title: "Mineral Sessizlik — Demo",
    category: "visualization",
    excerpt:
      "Malzeme, ışık ve kamera ritmini sınayan; uygulanmış bir mekânı değil görsel atmosfer ihtimalini anlatan 3D demo sahne.",
    description:
      "Görselleştirme odaklı bu kavramsal seri, az sayıdaki mimari öğeyle mekânsal derinliğin nasıl aktarılabileceğini araştırıyor.",
    concept: {
      eyebrow: "Görsel anlatı",
      title: "Bir mekânı göstermeden önce hissini görünür kılmak.",
      paragraphs: [
        "Kamera, hacmi bütünüyle açıklamak yerine yüzeyler arasındaki mesafeyi ve ışığın yönünü öne çıkarıyor. Her kare, aynı tasarım fikrinin farklı yoğunluklarını taşıyan bir seri olarak kurgulanıyor.",
        "Sahne bir uygulama kaydı veya müşteri projesi değildir. Site içerisindeki 3D görselleştirme sunum biçimini göstermek için hazırlanmış demo içeriktir.",
      ],
    },
    facts: createDemoFacts("3D görselleştirme"),
    cover: createVisual({
      id: "mineral-sessizlik-cover",
      layout: "cover",
      variant: "material-study",
      aspectRatio: "16/10",
      background:
        "linear-gradient(150deg, transparent 0 44%, rgba(39,37,34,.88) 44% 59%, transparent 59%), radial-gradient(circle at 72% 24%, #f0d8b5, #b5a088 24%, #686057 52%, #252421 78%)",
      alt: "Gerçek bir mekânı temsil etmeyen, taş yüzey ve kontrollü ışık etkisinden oluşan 3D görselleştirme demo kompozisyonu",
      caption: "CSS ile oluşturulmuş kavramsal görselleştirme kapağı.",
    }),
    gallery: [
      createVisual({
        id: "mineral-sessizlik-frame",
        layout: "panorama",
        variant: "soft-portal",
        aspectRatio: "21/9",
        background:
          "linear-gradient(95deg, #242320 0 27%, #c6b49c 27% 29%, #807368 29% 68%, #d8c7ae 68% 70%, #2f2d29 70%)",
        alt: "Kamera kadrajı içindeki düşey yüzey aralıklarını soyutlayan demo görsel",
        caption: "Kamera ritmi ve yüzey aralıkları.",
      }),
      createVisual({
        id: "mineral-sessizlik-volume",
        layout: "diptych-left",
        variant: "layered-plane",
        aspectRatio: "4/5",
        background:
          "linear-gradient(165deg, rgba(231,215,190,.8) 0 30%, transparent 30%), linear-gradient(45deg, #322f2b 0 48%, #9a8b77 48%)",
        alt: "Mimari kütle ve gölge ilişkisini gösteren soyut demo kompozisyon",
        caption: "Kütle, kesit ve gölge denemesi.",
      }),
      createVisual({
        id: "mineral-sessizlik-grain",
        layout: "diptych-right",
        variant: "material-study",
        aspectRatio: "4/5",
        background:
          "repeating-radial-gradient(circle at 70% 20%, rgba(255,255,255,.025) 0 1px, transparent 1px 7px), linear-gradient(135deg, #b4a58f, #5b544c 58%, #262522)",
        alt: "Mineral yüzeyin ışık altındaki tane hissini soyutlayan demo doku görseli",
        caption: "Mineral doku ve yumuşak ışık testi.",
      }),
    ],
    materials: [
      {
        name: "Ham taş tonu",
        description: "Görselde ışık kırılımını sınayan mineral yüzey önerisi.",
        swatch: "#A99B87",
        isConceptual: true,
      },
      {
        name: "Grafit yüzey",
        description: "Kadraj içinde derinlik oluşturan koyu zemin önerisi.",
        swatch: "#363532",
        isConceptual: true,
      },
      {
        name: "Kumlu sıva",
        description: "Yakın planlarda tane hissi veren mat yüzey önerisi.",
        swatch: "#C6B9A4",
        isConceptual: true,
      },
      {
        name: "Soluk bronz tonu",
        description: "Küçük odaklarda kullanılan düşük doygunluklu vurgu.",
        swatch: "#8B7862",
        isConceptual: true,
      },
    ],
    relatedProjectSlug: "sessiz-esik",
    featured: true,
    order: 5,
    isDemo: true,
    demoNotice,
    inquiryPrompt: "Tasarım fikrinizi güçlü bir görsel anlatıya dönüştürelim mi?",
    seo: {
      title: "Mineral Sessizlik — Kavramsal Demo Görselleştirme",
      description:
        "Murat Akaydın Studio web deneyimi için hazırlanmış, gerçek bir uygulamayı temsil etmeyen kavramsal 3D görselleştirme demosu.",
    },
  },
] as const satisfies readonly Project[];

export const getFallbackProjectBySlug = (slug: string): Project | undefined =>
  fallbackProjects.find((project) => project.slug === slug);

export const getProjectCategoryById = (id: ProjectCategoryId): ProjectCategory | undefined =>
  projectCategories.find((category) => category.id === id);
