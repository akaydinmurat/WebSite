import { defineArrayMember, defineField, defineType } from "sanity";

export const blockContent = defineType({
  name: "blockContent",
  title: "Zengin Metin",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Başlık 2", value: "h2" },
        { title: "Başlık 3", value: "h3" },
        { title: "Alıntı", value: "blockquote" },
      ],
      lists: [
        { title: "Madde İşaretli", value: "bullet" },
        { title: "Numaralı", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Kalın", value: "strong" },
          { title: "İtalik", value: "em" },
        ],
        annotations: [
          defineField({
            name: "link",
            title: "Bağlantı",
            type: "object",
            fields: [
              defineField({
                name: "href",
                title: "Adres",
                type: "url",
                validation: (rule) =>
                  rule
                    .required()
                    .uri({ allowRelative: true, scheme: ["http", "https", "mailto", "tel"] }),
              }),
              defineField({
                name: "openInNewTab",
                title: "Yeni Sekmede Aç",
                type: "boolean",
                initialValue: false,
              }),
            ],
          }),
        ],
      },
    }),
    defineArrayMember({
      type: "imageWithAlt",
    }),
  ],
});
