import type { StructureResolver } from "sanity/structure";

const SINGLETON_TYPES = new Set(["siteSettings"]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("İçerik")
    .items([
      S.listItem()
        .id("siteSettings")
        .title("Site Ayarları")
        .schemaType("siteSettings")
        .child(
          S.document()
            .id("siteSettings")
            .title("Site Ayarları")
            .schemaType("siteSettings")
            .documentId("siteSettings"),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => !SINGLETON_TYPES.has(listItem.getId() ?? ""),
      ),
    ]);
