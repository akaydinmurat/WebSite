import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Ayarları",
  type: "document",
  fields: [
    defineField({
      name: "brandName",
      title: "Marka Adı",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "positioningStatement",
      title: "Konumlandırma Cümlesi",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required().max(220),
    }),
    defineField({
      name: "siteDescription",
      title: "Site Açıklaması",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(160),
    }),
    defineField({
      name: "contactEmail",
      title: "İletişim E-postası",
      type: "string",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "contactPhone",
      title: "İletişim Telefonu",
      type: "string",
    }),
    defineField({
      name: "address",
      title: "Adres",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "socialLinks",
      title: "Sosyal Bağlantılar",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "socialLink",
          fields: [
            defineField({
              name: "label",
              title: "Platform",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              title: "Adres",
              type: "url",
              validation: (rule) => rule.required().uri({ scheme: ["http", "https"] }),
            }),
          ],
          preview: {
            select: {
              title: "label",
              subtitle: "url",
            },
          },
        }),
      ],
    }),
    defineField({
      name: "defaultSeo",
      title: "Varsayılan SEO",
      type: "seo",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Site Ayarları",
      };
    },
  },
});
