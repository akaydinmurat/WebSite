import type { Service } from "@/types";

export const fallbackServices = [
  {
    slug: "architecture-interior-design",
    title: "Mimarlık ve İç Mekân Tasarımı",
    eyebrow: "01 · Bütüncül projelendirme",
    summary:
      "Mekânın ihtiyaçlarını, estetik kararlarını ve işlevsel gereksinimlerini ortak bir tasarım fikrinde buluşturan proje desteği.",
    description:
      "Mevcut veya yeni bir mekânı; kullanıcı alışkanlıkları, dolaşım, yerleşim ve görsel bütünlük üzerinden ele alıyorum. Kapsam, projenin ölçeği ve ihtiyaçları doğrultusunda birlikte belirlenir.",
    deliverables: [
      "İhtiyaç ve mevcut durum değerlendirmesi",
      "Mekânsal kurgu ve yerleşim yaklaşımı",
      "Renk, malzeme ve tasarım dili",
      "Kapsama göre 2D ve 3D sunumlar",
    ],
    suitableFor:
      "Yeni bir mekân tasarlamak veya mevcut mekânını daha işlevsel ve özgün bir düzende yenilemek isteyenler için.",
    visualVariant: "plan",
    order: 1,
    inquiryLabel: "Projenizi paylaşın",
  },
  {
    slug: "residential-design",
    title: "Konut Tasarımı",
    eyebrow: "02 · Yaşam alanları",
    summary:
      "Tek bir odadan konutun bütününe uzanan, kişisel yaşam alışkanlıklarını merkeze alan iç mekân tasarımı.",
    description:
      "Konut projelerinde estetik kararları gündelik kullanım, depolama ve dolaşım ihtiyaçlarıyla birlikte değerlendiriyorum. Amaç, yalnızca iyi görünen değil, içinde yaşamaktan mutluluk duyulan mekânlar üretmek.",
    deliverables: [
      "Kullanıcı ihtiyaçlarının analizi",
      "Mobilya ve dolaşım yerleşimi",
      "Renk, malzeme ve aydınlatma yaklaşımı",
      "Kapsama göre 2D ve 3D sunumlar",
    ],
    suitableFor:
      "Oda, mutfak, banyo veya bütün bir konut için profesyonel tasarım desteği arayanlar için.",
    visualVariant: "room",
    order: 2,
    inquiryLabel: "Konut projesini konuşalım",
  },
  {
    slug: "commercial-design",
    title: "Ofis ve Ticari Mekân Tasarımı",
    eyebrow: "03 · Marka ve kullanım",
    summary:
      "Ofis, mağaza ve ticari mekânlarda kullanıcı deneyimi ile marka karakterini bir araya getiren tasarım yaklaşımı.",
    description:
      "Ticari mekânın işleyişini, hedef kitlesini ve temsil ettiği kimliği birlikte değerlendiriyorum. Kapsam ve sunum içeriği mekânın metrekaresine ve operasyonel ihtiyaçlarına göre şekillenir.",
    deliverables: [
      "İşlev ve kullanıcı akışı değerlendirmesi",
      "Konsept ve mekânsal kimlik yaklaşımı",
      "Yerleşim, malzeme ve aydınlatma kararları",
      "Kapsama göre 2D ve 3D sunumlar",
    ],
    suitableFor:
      "Ofis, mağaza, kafe veya benzeri ticari alanını özgün ve işlevsel bir kimlikle tasarlamak isteyenler için.",
    visualVariant: "perspective",
    order: 3,
    inquiryLabel: "Ticari proje kapsamını paylaşın",
  },
  {
    slug: "online-interior-consulting",
    title: "Online İç Mimari Danışmanlık",
    eyebrow: "04 · Uzaktan tasarım desteği",
    summary:
      "Mekânla ilgili renk, ürün, aksesuar ve tasarım kararlarını çevrim içi görüşmelerle netleştiren odaklı destek.",
    description:
      "Online danışmanlık; esinlenme panosu, renk danışmanlığı, ürün ve aksesuar seçimleri gibi belirli kararların profesyonel bir çerçevede ele alınmasını sağlar.",
    deliverables: [
      "Görüşme öncesi ihtiyaç değerlendirmesi",
      "Çevrim içi tasarım görüşmesi",
      "Esinlenme ve renk yönü",
      "Ürün ve aksesuar seçim önerileri",
    ],
    suitableFor:
      "Tam proje hizmeti yerine belirli tasarım kararlarında profesyonel yönlendirme isteyenler için.",
    visualVariant: "remote",
    order: 4,
    inquiryLabel: "Danışmanlık talebi oluşturun",
  },
  {
    slug: "interior-content-production",
    title: "İç Mimari İçerik Üretimi",
    eyebrow: "05 · Dijital anlatı",
    summary:
      "İç mimari odağındaki ürün, proje ve fikirleri sosyal medya platformlarına uygun bir anlatıya dönüştüren içerik desteği.",
    description:
      "Mimarlık deneyimini dijital içerik üretimiyle bir araya getiriyor; iş birliği yapılacak konu, ürün veya proje için platforma ve hedef kitleye uygun bir kapsam oluşturuyorum.",
    deliverables: [
      "İçerik veya iş birliği brief'i",
      "İç mimari odaklı anlatı yönü",
      "Platforma uygun içerik kapsamı",
      "Yayın öncesi içerik değerlendirmesi",
    ],
    suitableFor:
      "Ürününü veya projesini iç mimari perspektifiyle anlatmak isteyen marka ve yaratıcı ekipler için.",
    visualVariant: "content",
    order: 5,
    inquiryLabel: "İş birliği kapsamını paylaşın",
  },
] as const satisfies readonly Service[];

export const getFallbackServiceBySlug = (slug: string): Service | undefined =>
  fallbackServices.find((service) => service.slug === slug);
