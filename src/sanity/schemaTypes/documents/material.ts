import { defineField, defineType } from "sanity";

export const material = defineType({
  name: "material",
  title: "Malzeme",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Ad",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Kategori",
      type: "string",
      options: {
        list: [
          { title: "Ahşap", value: "wood" },
          { title: "Taş", value: "stone" },
          { title: "Metal", value: "metal" },
          { title: "Tekstil", value: "textile" },
          { title: "Cam", value: "glass" },
          { title: "Diğer", value: "other" },
        ],
        layout: "dropdown",
      },
    }),
    defineField({
      name: "description",
      title: "Açıklama",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "hexColor",
      title: "Renk Kodu",
      type: "string",
      description: "Örnek: #C9B8A6",
      validation: (rule) =>
        rule.regex(/^#[0-9a-fA-F]{6}$/, {
          name: "hex color",
          invert: false,
        }),
    }),
    defineField({
      name: "image",
      title: "Doku Görseli",
      type: "imageWithAlt",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "image",
    },
  },
});
