import { defineField, defineType } from "sanity";

export const imageWithAlt = defineType({
  name: "imageWithAlt",
  title: "Alternatif Metinli Görsel",
  type: "image",
  options: {
    hotspot: true,
  },
  fields: [
    defineField({
      name: "alt",
      title: "Alternatif Metin",
      type: "string",
      description:
        "Görseli, görseli göremeyen bir ziyaretçiye aktaracak kadar açık biçimde tanımlayın.",
      validation: (rule) =>
        rule.required().min(3).error("Her görsel için alternatif metin zorunludur."),
    }),
    defineField({
      name: "caption",
      title: "Açıklama",
      type: "string",
      description: "Yalnızca sayfada gösterilmesi gereken bir açıklama varsa ekleyin.",
    }),
  ],
  preview: {
    select: {
      title: "alt",
      subtitle: "caption",
      media: "asset",
    },
  },
});
