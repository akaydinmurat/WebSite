import { defineArrayMember, defineField, defineType } from "sanity";

export const packageType = defineType({
  name: "package",
  title: "Tasarım Paketi",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Başlık",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Adres Kısa Adı",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Özet",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(240),
    }),
    defineField({
      name: "description",
      title: "Detaylı Açıklama",
      type: "blockContent",
    }),
    defineField({
      name: "includedServices",
      title: "Pakete Dahil Hizmetler",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "revisionCount",
      title: "Revizyon Sayısı",
      type: "number",
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: "deliveryTime",
      title: "Tahmini Teslim Süresi",
      type: "string",
      description: "Örnek: 3–4 hafta",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "startingPrice",
      title: "Başlangıç Fiyatı",
      type: "string",
      description: "Henüz kesin fiyat yoksa sayısal bir değer uydurmayın; 'Teklif üzerine' yazın.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "priceDisclaimer",
      title: "Fiyat Notu",
      type: "string",
      initialValue: "Fiyat kapsam ve proje koşullarına göre netleşir.",
    }),
    defineField({
      name: "image",
      title: "Görsel",
      type: "imageWithAlt",
    }),
    defineField({
      name: "featured",
      title: "Öne Çıkar",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Sıralama",
      type: "number",
      initialValue: 0,
      validation: (rule) => rule.integer().min(0),
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],
  orderings: [
    {
      title: "Manuel Sıralama",
      name: "manualOrder",
      by: [
        { field: "order", direction: "asc" },
        { field: "title", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "startingPrice",
      media: "image",
    },
  },
});
