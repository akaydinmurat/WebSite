import { defineArrayMember, defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Proje",
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
      name: "excerpt",
      title: "Kısa Özet",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(240),
    }),
    defineField({
      name: "description",
      title: "Proje Anlatısı",
      type: "blockContent",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Kategori",
      type: "reference",
      to: [{ type: "projectCategory" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "location",
      title: "Konum",
      type: "string",
    }),
    defineField({
      name: "year",
      title: "Yıl",
      type: "number",
      validation: (rule) => rule.integer().min(1900).max(2100),
    }),
    defineField({
      name: "area",
      title: "Alan (m²)",
      type: "number",
      validation: (rule) => rule.positive(),
    }),
    defineField({
      name: "coverImage",
      title: "Kapak Görseli",
      type: "imageWithAlt",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "mobileCoverImage",
      title: "Mobil Kapak Görseli",
      type: "imageWithAlt",
      description: "Dikey ekranlar için ayrı bir kırpım gerektiğinde kullanın.",
    }),
    defineField({
      name: "gallery",
      title: "Galeri",
      type: "array",
      of: [defineArrayMember({ type: "imageWithAlt" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "floorPlans",
      title: "Planlar",
      type: "array",
      of: [defineArrayMember({ type: "imageWithAlt" })],
    }),
    defineField({
      name: "materials",
      title: "Malzemeler",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "material" }],
        }),
      ],
    }),
    defineField({
      name: "beforeAfter",
      title: "Öncesi / Sonrası",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "before",
          title: "Önce",
          type: "imageWithAlt",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "after",
          title: "Sonra",
          type: "imageWithAlt",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "caption",
          title: "Açıklama",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "featured",
      title: "Öne Çıkan Proje",
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
    {
      title: "En Yeni Yıl",
      name: "yearDescending",
      by: [{ field: "year", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      location: "location",
      year: "year",
      media: "coverImage",
    },
    prepare({ title, location, year, media }) {
      return {
        title,
        subtitle: [location, year].filter(Boolean).join(" · "),
        media,
      };
    },
  },
});
