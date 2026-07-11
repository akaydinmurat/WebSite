import { siteConfig } from "@/config/site";

import { getHttpUrl, getProjectPath, getSiteUrl } from "./site-url";

const SCHEMA_CONTEXT = "https://schema.org" as const;

interface SchemaReference {
  "@id": string;
}

export interface ProfessionalServiceJsonLd {
  "@id": string;
  "@type": readonly ["Organization", "ProfessionalService"];
  description: string;
  email?: string;
  name: string;
  sameAs?: readonly string[];
  telephone?: string;
  url: string;
}

export interface WebSiteJsonLd {
  "@id": string;
  "@type": "WebSite";
  description: string;
  inLanguage: "tr-TR";
  name: string;
  publisher: SchemaReference;
  url: string;
}

export interface SiteJsonLd {
  "@context": typeof SCHEMA_CONTEXT;
  "@graph": readonly [ProfessionalServiceJsonLd, WebSiteJsonLd];
}

export interface BreadcrumbListItemJsonLd {
  "@type": "ListItem";
  item: string;
  name: string;
  position: number;
}

export interface BreadcrumbListJsonLd {
  "@context": typeof SCHEMA_CONTEXT;
  "@id": string;
  "@type": "BreadcrumbList";
  itemListElement: readonly BreadcrumbListItemJsonLd[];
}

export interface ProjectBreadcrumbInput {
  slug: string;
  title: string;
}

export type JsonLdData = SiteJsonLd | BreadcrumbListJsonLd;

function cleanOptionalText(value: string | null | undefined): string | undefined {
  const cleanedValue = value?.replace(/\s+/g, " ").trim();

  return cleanedValue || undefined;
}

function getSocialUrls(): readonly string[] {
  return siteConfig.socialLinks.flatMap(({ href }) => {
    const url = getHttpUrl(href);

    return url ? [url.toString()] : [];
  });
}

export function createSiteJsonLd(): SiteJsonLd {
  const homeUrl = getSiteUrl("/").toString();
  const organizationId = getSiteUrl("/#organization").toString();
  const websiteId = getSiteUrl("/#website").toString();
  const email = cleanOptionalText(siteConfig.contact.email);
  const telephone = cleanOptionalText(siteConfig.contact.phone);
  const sameAs = getSocialUrls();

  const organization: ProfessionalServiceJsonLd = {
    "@id": organizationId,
    "@type": ["Organization", "ProfessionalService"],
    name: siteConfig.name,
    description: siteConfig.description,
    url: homeUrl,
    ...(email ? { email } : {}),
    ...(telephone ? { telephone } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };

  const website: WebSiteJsonLd = {
    "@id": websiteId,
    "@type": "WebSite",
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: "tr-TR",
    url: homeUrl,
    publisher: { "@id": organizationId },
  };

  return {
    "@context": SCHEMA_CONTEXT,
    "@graph": [organization, website],
  };
}

export function createProjectBreadcrumbJsonLd(
  project: ProjectBreadcrumbInput,
): BreadcrumbListJsonLd {
  const projectName = cleanOptionalText(project.title) || "Proje";
  const projectUrl = getSiteUrl(getProjectPath(project.slug)).toString();

  return {
    "@context": SCHEMA_CONTEXT,
    "@id": `${projectUrl}#breadcrumb`,
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Ana Sayfa",
        item: getSiteUrl("/").toString(),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Projeler",
        item: getSiteUrl("/projects").toString(),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: projectName,
        item: projectUrl,
      },
    ],
  };
}

/** Serializes JSON-LD as inert script text and neutralizes HTML/script-closing characters. */
export function serializeJsonLd(data: JsonLdData): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
