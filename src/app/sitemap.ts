import type { MetadataRoute } from "next";

import { fallbackProjects } from "@/content/fallback-projects";
import { getProjectSlugs } from "@/lib/sanity";
import { getProjectPath, getSiteUrl } from "@/lib/seo";
import { isSanityConfigured } from "@/sanity/env";

const STATIC_PATHS = ["/", "/projects", "/services", "/packages", "/about", "/contact"] as const;
const SAFE_SLUG_PATTERN = /^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u;

function isSafeProjectSlug(slug: string): boolean {
  return slug.length <= 200 && SAFE_SLUG_PATTERN.test(slug);
}

async function getPublicProjectSlugs(): Promise<readonly string[]> {
  if (isSanityConfigured()) {
    return getProjectSlugs([]);
  }

  return fallbackProjects.flatMap((project) =>
    project.isDemo || project.seo.noIndex === true ? [] : [project.slug],
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projectSlugs = await getPublicProjectSlugs();
  const paths = new Set<string>([
    ...STATIC_PATHS,
    ...projectSlugs.filter(isSafeProjectSlug).map(getProjectPath),
  ]);

  return [...paths].map((path) => ({
    url: getSiteUrl(path).toString(),
  }));
}
