import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    id: "/",
    start_url: "/",
    scope: "/",
    display: "browser",
    background_color: "#f4f0e8",
    theme_color: "#201f1c",
    lang: siteConfig.language,
    dir: "ltr",
  };
}
