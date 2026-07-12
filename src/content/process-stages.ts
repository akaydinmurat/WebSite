export const processStages = [
  {
    label: "Konsept",
    title: "Atmosferi tanımlayan ilk fikir",
    description: "İhtiyaçlar, referanslar ve mekânın karakteri ortak bir tasarım yönünde buluşur.",
    visualSrc: "/images/process/01-concept-sketch.webp",
    visualAlt: "Eskiz kâğıdı, pergel, cetvel ve kalemle başlayan iç mimari konsept çalışması.",
  },
  {
    label: "Planlama",
    title: "Dolaşım ve işlev aynı çizgide",
    description: "Yerleşim, ölçü ve kullanım senaryoları mekânsal akış içinde netleşir.",
    visualSrc: "/images/process/02-spatial-planning.webp",
    visualAlt: "Ölçülü planlar, kesitler ve dolaşım çizgileriyle netleşen mekânsal planlama.",
  },
  {
    label: "Malzeme",
    title: "Işıkla değişen yüzey dili",
    description: "Renk, doku ve yüzey ilişkileri tasarımın duyusal katmanını kurar.",
    visualSrc: "/images/process/03-material-language.webp",
    visualAlt: "Taş, ahşap, tekstil, cam ve metal numunelerinden oluşan malzeme seçkisi.",
  },
  {
    label: "Görselleştirme",
    title: "Kararları görünür kılan sahneler",
    description: "Mekânın oranı, ışığı ve malzeme dengesi proje görsellerinde sınanır.",
    visualSrc: "/images/process/04-visualization.webp",
    visualAlt: "Teknik çizgiden fotogerçekçi iç mekân görselleştirmesine dönüşen tasarım sahnesi.",
  },
  {
    label: "Teslim",
    title: "Uygulanabilir ve okunaklı bir bütün",
    description: "Netleşen kararlar, seçilen proje kapsamına uygun bir sunumda bir araya gelir.",
    visualSrc: "/images/process/05-final-delivery.webp",
    visualAlt: "Tüm kararları uygulanmış, ışığı ve malzemeleri tamamlanmış iç mekân sonucu.",
  },
] as const;

export type ProcessStage = (typeof processStages)[number];
