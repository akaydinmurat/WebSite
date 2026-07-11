import type { DesignPackage, PackageDeliveryTime, PackageStartingPrice } from "@/types";

const demoNotice =
  "Bu paket geçici demo içeriğidir; bağlayıcı bir hizmet teklifi değildir. Kapsam, revizyon, teslim takvimi ve ücret ön görüşme sonrasında kesinleştirilir.";

const placeholderStartingPrice = {
  amount: null,
  currency: "TRY",
  label: "Başlangıç fiyatı henüz belirlenmedi",
  isPlaceholder: true,
  note: "Bu alan fiyat yapısını göstermek için kullanılan bir yer tutucudur; gerçek fiyat değildir.",
} as const satisfies PackageStartingPrice;

const pendingDeliveryTime = {
  label: "Ön görüşme sonrası planlanır",
  isIndicative: true,
  note: "Teslim süresi; ölçü, kapsam, geri bildirim akışı ve proje yoğunluğu görüldükten sonra paylaşılır.",
} as const satisfies PackageDeliveryTime;

export const fallbackPackages = [
  {
    slug: "single-room-design",
    title: "Tek Oda Tasarım Paketi",
    shortTitle: "Tek Oda",
    summary:
      "Belirli bir odayı yerleşimden malzeme diline kadar tutarlı bir bütün olarak ele almak için odaklı başlangıç kapsamı.",
    idealFor:
      "Yatak odası, çalışma odası, çocuk odası veya benzeri tek bir hacmi yeniden kurgulamak isteyenler için.",
    includedServices: [
      "İhtiyaç ve mevcut durum değerlendirmesi",
      "Mobilya yerleşimi ve dolaşım önerisi",
      "Renk, malzeme ve atmosfer panosu",
      "Mobilya ve aydınlatma seçim yönü",
      "Seçili açılardan 3D görsel anlatım",
      "Dijital tasarım sunumu",
    ],
    revisionPolicy: {
      rounds: 2,
      label: "2 geri bildirim turu · örnek kapsam",
      isIndicative: true,
      note: "Revizyon sayısı demo amaçlıdır ve teklif öncesinde doğrulanır.",
    },
    deliveryTime: pendingDeliveryTime,
    startingPrice: placeholderStartingPrice,
    inquiry: {
      label: "Tek oda paketini sor",
      href: "/contact?package=single-room-design",
    },
    featured: false,
    order: 1,
    isDemo: true,
    demoNotice,
  },
  {
    slug: "living-room-design",
    title: "Salon Tasarım Paketi",
    shortTitle: "Salon",
    summary:
      "Salonun farklı kullanım anlarını; oturma düzeni, depolama, aydınlatma ve malzeme kararlarıyla birlikte şekillendiren kapsam.",
    idealFor:
      "Salonunu sıfırdan kurmak veya mevcut parçaları daha bütünlüklü bir düzende değerlendirmek isteyenler için.",
    includedServices: [
      "Yaşam alışkanlıkları ve ihtiyaç analizi",
      "Alternatif oturma ve dolaşım yerleşimi",
      "TV, depolama ve odak yüzeyi yaklaşımı",
      "Renk, malzeme ve tekstil paleti",
      "Mobilya ve aydınlatma seçim yönü",
      "Seçili açılardan 3D görsel anlatım",
      "Dijital tasarım sunumu",
    ],
    revisionPolicy: {
      rounds: 2,
      label: "2 geri bildirim turu · örnek kapsam",
      isIndicative: true,
      note: "Revizyon sayısı demo amaçlıdır ve teklif öncesinde doğrulanır.",
    },
    deliveryTime: pendingDeliveryTime,
    startingPrice: placeholderStartingPrice,
    inquiry: {
      label: "Salon paketini sor",
      href: "/contact?package=living-room-design",
    },
    featured: true,
    order: 2,
    isDemo: true,
    demoNotice,
  },
  {
    slug: "kitchen-design",
    title: "Mutfak Tasarım Paketi",
    shortTitle: "Mutfak",
    summary:
      "Mutfaktaki hareket, depolama ve hazırlık akışını; sabit mobilya, yüzey ve aydınlatma kararlarıyla birlikte ele alan kapsam.",
    idealFor:
      "Yeni mutfak planlayan veya mevcut mutfağının işlevsel düzenini yeniden kurmak isteyenler için.",
    includedServices: [
      "Kullanım ve depolama ihtiyaç analizi",
      "Yerleşim ve ergonomi önerisi",
      "Dolap modülü ve kapak dili yaklaşımı",
      "Tezgâh, armatür ve yüzey paleti",
      "Genel ve görev aydınlatması yönü",
      "Seçili açılardan 3D görsel anlatım",
      "Dijital tasarım sunumu",
    ],
    revisionPolicy: {
      rounds: 2,
      label: "2 geri bildirim turu · örnek kapsam",
      isIndicative: true,
      note: "Revizyon sayısı demo amaçlıdır ve teklif öncesinde doğrulanır.",
    },
    deliveryTime: pendingDeliveryTime,
    startingPrice: placeholderStartingPrice,
    inquiry: {
      label: "Mutfak paketini sor",
      href: "/contact?package=kitchen-design",
    },
    featured: false,
    order: 3,
    isDemo: true,
    demoNotice,
  },
  {
    slug: "complete-home-design",
    title: "Komple Ev Tasarım Paketi",
    shortTitle: "Komple Ev",
    summary:
      "Konutun farklı bölümlerini ortak bir mekânsal dil ve aşamalı karar süreci içinde ele alan genişletilmiş tasarım kapsamı.",
    idealFor:
      "Yeni konutunu bütüncül biçimde tasarlamak veya mevcut evinin birden fazla bölümünü birlikte yenilemek isteyenler için.",
    includedServices: [
      "Konut geneli ihtiyaç programı",
      "Yerleşim, dolaşım ve depolama yaklaşımı",
      "Ortak konsept ve malzeme dili",
      "Oda bazında renk, mobilya ve aydınlatma yönü",
      "Sabit mobilya tasarım yaklaşımı",
      "Öncelikli hacimler için 3D görsel anlatım",
      "Aşamalı dijital tasarım sunumları",
    ],
    revisionPolicy: {
      rounds: 3,
      label: "3 geri bildirim turu · örnek kapsam",
      isIndicative: true,
      note: "Revizyon yapısı proje fazlarına göre değişebilir ve teklif öncesinde doğrulanır.",
    },
    deliveryTime: pendingDeliveryTime,
    startingPrice: placeholderStartingPrice,
    inquiry: {
      label: "Komple ev paketini sor",
      href: "/contact?package=complete-home-design",
    },
    featured: true,
    order: 4,
    isDemo: true,
    demoNotice,
  },
  {
    slug: "3d-visualization",
    title: "3D Görselleştirme Paketi",
    shortTitle: "3D Görselleştirme",
    summary:
      "Mevcut bir tasarım fikrini malzeme, ışık ve kamera kurgusuyla güçlü ve tutarlı bir görsel seriye dönüştüren kapsam.",
    idealFor:
      "Tasarımı hazır olan ve onu sunum, değerlendirme veya iletişim için atmosferik görsellerle anlatmak isteyenler için.",
    includedServices: [
      "Brief, model ve kaynak dosya değerlendirmesi",
      "Görsel yön ve referans çerçevesi",
      "Malzeme ve ışık kurgusu",
      "Kamera açısı ve kompozisyon önerileri",
      "Kapsama göre yüksek çözünürlüklü sabit görseller",
      "Temel renk ve ton düzenleme",
    ],
    revisionPolicy: {
      rounds: 2,
      label: "2 geri bildirim turu · örnek kapsam",
      isIndicative: true,
      note: "Revizyon sayısı sahne ve görsel adedine göre teklif öncesinde doğrulanır.",
    },
    deliveryTime: pendingDeliveryTime,
    startingPrice: placeholderStartingPrice,
    inquiry: {
      label: "Görselleştirme paketini sor",
      href: "/contact?package=3d-visualization",
    },
    featured: false,
    order: 5,
    isDemo: true,
    demoNotice,
  },
] as const satisfies readonly DesignPackage[];

export const getFallbackPackageBySlug = (slug: string): DesignPackage | undefined =>
  fallbackPackages.find((designPackage) => designPackage.slug === slug);
