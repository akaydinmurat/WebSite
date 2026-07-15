export const aboutStory = [
  {
    period: "2014–2020",
    institution: "Atılım Üniversitesi",
    role: "Lisans",
    chapter: "Temel",
    description:
      "Mekânı plan, kesit ve ölçü üzerinden okumayı kuran; ilk çizgiyi tasarım düşüncesine dönüştüren dönem.",
  },
  {
    period: "2021–2023",
    institution: "TOBB ETÜ",
    role: "Yüksek Lisans",
    chapter: "Derinlik",
    description:
      "Araştırma, bağlam ve kullanıcı deneyimiyle çizginin hacme; hacmin tutarlı bir mekânsal kurguya dönüştüğü dönem.",
  },
  {
    period: "2021–2023",
    institution: "Özel Sektör",
    role: "Mimar",
    chapter: "Uygulama",
    description:
      "Tasarım kararlarının proje ritmi, koordinasyon ve uygulanabilirlik içinde gerçek mekânla buluştuğu dönem.",
  },
  {
    period: "2021–Günümüz",
    institution: "Bağımsız Çalışma",
    role: "Freelance Mimar",
    chapter: "Bağımsız Pratik",
    description:
      "İç mimari, görselleştirme ve danışmanlığın kişisel bir tasarım dili çevresinde birleştiği açık uçlu çalışma biçimi.",
  },
] as const;

export type AboutStoryChapter = (typeof aboutStory)[number];
