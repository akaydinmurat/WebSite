import type { Service } from "@/types";

export const fallbackServices = [
  {
    slug: "interior-architecture",
    title: "İç Mimari",
    eyebrow: "01 · Mekânın bütünü",
    summary:
      "İhtiyaç programından yerleşime, malzeme kararlarından uygulama diline uzanan bütüncül tasarım yaklaşımı.",
    description:
      "Mekânın nasıl görüneceğinden önce nasıl kullanılacağını anlamaya odaklanırız. Dolaşım, oran, depolama, ışık ve malzeme kararlarını tek bir tasarım fikri çevresinde geliştiririz.",
    deliverables: [
      "İhtiyaç ve kullanım senaryosu analizi",
      "Konsept ve mekânsal yön önerisi",
      "Yerleşim ve dolaşım kararları",
      "Malzeme, renk ve aydınlatma yaklaşımı",
      "Kapsama göre teknik çizim ve görsel sunum",
    ],
    suitableFor:
      "Yeni bir mekânı bütüncül biçimde ele almak veya mevcut mekânını yeniden kurgulamak isteyenler için.",
    visualVariant: "plan",
    order: 1,
    inquiryLabel: "İç mimari projesini konuşalım",
  },
  {
    slug: "3d-visualization",
    title: "3D Görselleştirme",
    eyebrow: "02 · Fikrin atmosferi",
    summary:
      "Henüz uygulanmamış tasarım kararlarını ışık, malzeme ve kamera diliyle okunabilir bir görsel anlatıya dönüştürme.",
    description:
      "Mimari fikrin yalnızca biçimini değil, mekândaki hissini de görünür kılan sahneler üretiriz. Görsel dil; tasarımın amacı, hedef kitlesi ve sunum bağlamına göre şekillenir.",
    deliverables: [
      "Görsel brief ve referans yönü",
      "Model veya sahne değerlendirmesi",
      "Malzeme ve ışık kurgusu",
      "Kamera açıları ve kompozisyon",
      "Kapsama göre yüksek çözünürlüklü görseller",
    ],
    suitableFor:
      "Tasarımını uygulama, sunum veya iletişim öncesinde güçlü bir atmosferle anlatmak isteyenler için.",
    visualVariant: "perspective",
    order: 2,
    inquiryLabel: "Görselleştirme kapsamını paylaş",
  },
  {
    slug: "room-design",
    title: "Oda Tasarımı",
    eyebrow: "03 · Tek hacim, net odak",
    summary:
      "Salon, yatak odası, çalışma odası veya benzeri tek bir hacmi kullanım alışkanlıkları çevresinde yeniden düşünme.",
    description:
      "Sınırlı bir alanda doğru öncelikleri belirleyerek yerleşim, depolama, mobilya, renk ve aydınlatma kararlarını birlikte ele alırız. Amaç, tek bir odada tamamlanmış ve kişiye ait bir bütünlük kurmaktır.",
    deliverables: [
      "Oda ihtiyaç analizi",
      "Mobilya ve dolaşım yerleşimi",
      "Renk, doku ve malzeme yönü",
      "Aydınlatma ve ürün yaklaşımı",
      "Kapsama göre 3D görsel sunum",
    ],
    suitableFor:
      "Belirli bir odayı kontrollü bir kapsamla yenilemek veya sıfırdan kurmak isteyenler için.",
    visualVariant: "room",
    order: 3,
    inquiryLabel: "Oda tasarımına başla",
  },
  {
    slug: "kitchen-design",
    title: "Mutfak Tasarımı",
    eyebrow: "04 · İşlevin ritmi",
    summary:
      "Hazırlık, pişirme, depolama ve paylaşım hareketlerini ergonomik ve sakin bir mekânsal düzende buluşturma.",
    description:
      "Mutfağı sabit dolapların toplamı olarak değil, gün içindeki hareketleri taşıyan bir sistem olarak ele alırız. Yerleşim, saklama, yüzey, aydınlatma ve cihaz ilişkilerini aynı kurgu içinde değerlendiririz.",
    deliverables: [
      "Kullanım ve depolama ihtiyaç analizi",
      "Yerleşim ve çalışma üçgeni önerisi",
      "Dolap modülü ve yüzey yaklaşımı",
      "Tezgâh, armatür ve aydınlatma yönü",
      "Kapsama göre çizim ve 3D görseller",
    ],
    suitableFor:
      "Yeni mutfak planlayan veya mevcut mutfağının işlevini ve görünümünü birlikte yenilemek isteyenler için.",
    visualVariant: "kitchen",
    order: 4,
    inquiryLabel: "Mutfak projesini konuşalım",
  },
  {
    slug: "online-design-consulting",
    title: "Online Tasarım Danışmanlığı",
    eyebrow: "05 · Uzaktan, odaklı destek",
    summary:
      "Belirli tasarım kararlarını netleştirmek için çevrim içi görüşme ve ihtiyaca göre hazırlanan yönlendirme desteği.",
    description:
      "Mekânla ilgili soruları önceden toplar, görüşmeyi karar alınması gereken başlıklara odaklarız. Danışmanlık; tam proje hizmetinin yerine geçmez, tanımlı bir konuda bağımsız bir yön sunar.",
    deliverables: [
      "Görüşme öncesi brief değerlendirmesi",
      "Çevrim içi tasarım görüşmesi",
      "Yerleşim, renk veya ürün kararlarına yön",
      "Görüşme sonrası kısa karar özeti",
      "Gerekirse sonraki kapsam için öneri",
    ],
    suitableFor:
      "Uygulama öncesinde belirli kararlarını doğrulamak veya tasarım yönünü netleştirmek isteyenler için.",
    visualVariant: "remote",
    order: 5,
    inquiryLabel: "Danışmanlık konusu paylaş",
  },
  {
    slug: "material-furniture-selection",
    title: "Malzeme ve Mobilya Seçimi",
    eyebrow: "06 · Dokunsal bütünlük",
    summary:
      "Yüzey, renk, sabit eleman, mobilya ve aydınlatma seçimlerini tutarlı bir mekân dili içinde bir araya getirme.",
    description:
      "Tekil ürünlerden oluşan bir liste yerine, parçaların ölçek, ton, doku ve kullanım açısından birbirleriyle nasıl ilişki kurduğuna bakarız. Seçimler bütçe ve erişilebilirlik bilgisi netleştikçe uyarlanır.",
    deliverables: [
      "Malzeme ve renk paleti yönü",
      "Mobilya ölçeği ve stil çerçevesi",
      "Aydınlatma ve aksesuar yaklaşımı",
      "Kapsama göre ürün seçki listesi",
      "Alternatif seçim ilkeleri",
    ],
    suitableFor:
      "Mekânındaki parçaları değiştirmeden önce tutarlı bir seçim çerçevesi oluşturmak isteyenler için.",
    visualVariant: "materials",
    order: 6,
    inquiryLabel: "Seçim desteğini konuşalım",
  },
] as const satisfies readonly Service[];

export const getFallbackServiceBySlug = (slug: string): Service | undefined =>
  fallbackServices.find((service) => service.slug === slug);
