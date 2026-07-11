import type { QueryParams } from "next-sanity";

import { getSanityClient } from "./client";
import {
  FEATURED_PROJECTS_QUERY,
  PACKAGES_QUERY,
  PROJECT_BY_SLUG_QUERY,
  PROJECT_CATEGORIES_QUERY,
  PROJECT_SLUGS_QUERY,
  PROJECTS_QUERY,
  SERVICES_QUERY,
  SITE_SETTINGS_QUERY,
} from "./queries";
import type {
  DesignPackage,
  Project,
  ProjectCategory,
  ProjectSummary,
  Service,
  SiteSettings,
} from "./types";

async function fetchWithFallback<T>(
  query: string,
  fallback: T,
  params: QueryParams = {},
): Promise<T> {
  const client = getSanityClient();

  if (!client) {
    return fallback;
  }

  try {
    return await client.fetch<T>(query, params);
  } catch {
    if (process.env.NODE_ENV === "development") {
      console.warn("Sanity query failed; local fallback content is being used.");
    }

    return fallback;
  }
}

export function getProjects(
  fallback: readonly ProjectSummary[] = [],
): Promise<readonly ProjectSummary[]> {
  return fetchWithFallback(PROJECTS_QUERY, fallback);
}

export function getFeaturedProjects(
  fallback: readonly ProjectSummary[] = [],
): Promise<readonly ProjectSummary[]> {
  return fetchWithFallback(FEATURED_PROJECTS_QUERY, fallback);
}

export function getProjectBySlug(
  slug: string,
  fallback: Project | null = null,
): Promise<Project | null> {
  return fetchWithFallback(PROJECT_BY_SLUG_QUERY, fallback, { slug });
}

export function getProjectCategories(
  fallback: readonly ProjectCategory[] = [],
): Promise<readonly ProjectCategory[]> {
  return fetchWithFallback(PROJECT_CATEGORIES_QUERY, fallback);
}

export function getProjectSlugs(fallback: readonly string[] = []): Promise<readonly string[]> {
  return fetchWithFallback(PROJECT_SLUGS_QUERY, fallback);
}

export function getServices(fallback: readonly Service[] = []): Promise<readonly Service[]> {
  return fetchWithFallback(SERVICES_QUERY, fallback);
}

export function getPackages(
  fallback: readonly DesignPackage[] = [],
): Promise<readonly DesignPackage[]> {
  return fetchWithFallback(PACKAGES_QUERY, fallback);
}

export function getSiteSettings(
  fallback: SiteSettings | null = null,
): Promise<SiteSettings | null> {
  return fetchWithFallback(SITE_SETTINGS_QUERY, fallback);
}
