import { defineField, defineType } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  options: {
    collapsible: true,
    collapsed: true,
  },
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta Başlık",
      type: "string",
      description: "Boş bırakılırsa içerik başlığı kullanılır.",
      validation: (rule) =>
        rule.max(60).warning("Arama sonuçlarında kesilmemesi için 60 karakteri aşmayın."),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Açıklama",
      type: "text",
      rows: 3,
      validation: (rule) =>
        rule.max(160).warning("Arama sonuçlarında kesilmemesi için 160 karakteri aşmayın."),
    }),
    defineField({
      name: "openGraphImage",
      title: "Sosyal Paylaşım Görseli",
      type: "imageWithAlt",
    }),
    defineField({
      name: "canonicalUrl",
      title: "Kanonik URL",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "noIndex",
      title: "Arama Motorlarından Gizle",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
