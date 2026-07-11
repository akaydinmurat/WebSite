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
      name: "scopeLabel",
      title: "Kapsam Etiketi",
      type: "string",
      description: "Örnek: Tek mekân veya Metrekareye göre değişen kapsam",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "scopeItems",
      title: "Kapsam Maddeleri",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "examples",
      title: "Örnek Mekân veya Bölümler",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "presentationFormats",
      title: "Sunum Biçimleri",
      type: "array",
      of: [
        defineArrayMember({
          type: "string",
          options: { list: ["2D", "3D"] },
        }),
      ],
    }),
    defineField({
      name: "scopeBasis",
      title: "Kapsam Ölçütü",
      type: "string",
      description:
        "Yalnız doğrulanmışsa yazın. Örnek: Paket içeriği mekânın metrekaresine göre değişir.",
    }),
    defineField({
      name: "exclusions",
      title: "Kapsama Dahil Olmayanlar",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "image",
      title: "Görsel",
      type: "imageWithAlt",
    }),
    defineField({
      name: "showOnHomepage",
      title: "Ana Sayfada Göster",
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
      subtitle: "scopeLabel",
      media: "image",
    },
  },
});
