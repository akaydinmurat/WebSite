import type { MetadataRoute } from "next";

import { fallbackProjects } from "@/content/fallback-projects";
import { getProjectPath, getSiteUrl, isSiteIndexable } from "@/lib/seo";
import { isSanityConfigured } from "@/sanity/env";

export default function robots(): MetadataRoute.Robots {
  const homeUrl = getSiteUrl("/");

  if (!isSiteIndexable(homeUrl)) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  const privateProjectPaths = isSanityConfigured()
    ? []
    : fallbackProjects
        .filter((project) => project.isDemo || project.seo.noIndex === true)
        .map(({ slug }) => getProjectPath(slug));

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/studio", ...privateProjectPaths],
    },
    host: homeUrl.origin,
    sitemap: getSiteUrl("/sitemap.xml").toString(),
  };
}
