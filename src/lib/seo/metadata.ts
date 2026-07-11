import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

import {
  getCanonicalUrl,
  getHttpUrl,
  getProjectPath,
  getSiteUrl,
  isSiteIndexable,
  siteUrl,
} from "./site-url";

export interface OpenGraphImageInput {
  alt?: string;
  height?: number;
  url: string | URL;
  width?: number;
}

export interface MetadataOptions {
  canonicalUrl?: string | URL | null;
  description?: string | null;
  image?: OpenGraphImageInput | null;
  noIndex?: boolean;
  path?: string;
  title?: string | null;
}

export interface ProjectSeoInput {
  canonicalUrl?: string;
  description?: string;
  metaDescription?: string;
  metaTitle?: string;
  noIndex?: boolean;
  openGraphImage?: {
    alt?: string;
    asset?: {
      metadata?: {
        dimensions?: {
          height?: number;
          width?: number;
        };
      };
      url?: string;
    };
  };
  title?: string;
}

export interface ProjectMetadataInput {
  excerpt?: string;
  isDemo?: boolean;
  seo?: ProjectSeoInput;
  slug: string;
  title: string;
}

function cleanText(value: string | null | undefined): string | undefined {
  const cleanedValue = value?.replace(/\s+/g, " ").trim();

  return cleanedValue || undefined;
}

function getDocumentTitle(title: string | undefined): string {
  if (!title || title === siteConfig.name || title.includes(siteConfig.name)) {
    return title || siteConfig.name;
  }

  return `${title} | ${siteConfig.name}`;
}

function getImageUrl(value: string | URL): URL | null {
  if (value instanceof URL) {
    return getHttpUrl(value);
  }

  const cleanedValue = value.trim();

  if (!cleanedValue || cleanedValue.startsWith("//")) {
    return null;
  }

  if (/^[a-z][a-z\d+.-]*:/i.test(cleanedValue)) {
    return getHttpUrl(cleanedValue);
  }

  return getSiteUrl(cleanedValue);
}

function getOpenGraphImage(image: OpenGraphImageInput | null | undefined) {
  const url = image ? getImageUrl(image.url) : null;

  if (!image || !url) {
    return undefined;
  }

  const width = image.width && image.width > 0 ? image.width : undefined;
  const height = image.height && image.height > 0 ? image.height : undefined;

  return {
    url,
    ...(cleanText(image.alt) ? { alt: cleanText(image.alt) } : {}),
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
  };
}

/** Creates consistent root or page metadata with Turkish Open Graph and Twitter values. */
export function createMetadata(options: MetadataOptions = {}): Metadata {
  const title = cleanText(options.title);
  const description = cleanText(options.description) || siteConfig.description;
  const canonicalUrl = getCanonicalUrl(options.canonicalUrl, options.path || "/");
  const documentTitle = getDocumentTitle(title);
  const openGraphImage = getOpenGraphImage(options.image);
  const shouldNoIndex = options.noIndex === true || !isSiteIndexable();

  return {
    metadataBase: siteUrl,
    applicationName: siteConfig.name,
    title: title
      ? title
      : {
          default: siteConfig.name,
          template: `%s | ${siteConfig.name}`,
        },
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "tr-TR": canonicalUrl,
      },
    },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      siteName: siteConfig.name,
      title: documentTitle,
      description,
      url: canonicalUrl,
      ...(openGraphImage ? { images: [openGraphImage] } : {}),
    },
    twitter: {
      card: openGraphImage ? "summary_large_image" : "summary",
      title: documentTitle,
      description,
      ...(openGraphImage ? { images: [openGraphImage.url] } : {}),
    },
    ...(shouldNoIndex
      ? {
          robots: {
            index: false,
            follow: false,
            nocache: true,
            googleBot: {
              index: false,
              follow: false,
              noimageindex: true,
              "max-image-preview": "none",
              "max-snippet": -1,
              "max-video-preview": -1,
            },
          },
        }
      : {}),
  };
}

/** Maps both local fallback and Sanity project SEO shapes to Next.js metadata. */
export function createProjectMetadata(project: ProjectMetadataInput): Metadata {
  const seo = project.seo;
  const imageAsset = seo?.openGraphImage?.asset;
  const dimensions = imageAsset?.metadata?.dimensions;
  const imageUrl = imageAsset?.url;

  return createMetadata({
    title: seo?.metaTitle || seo?.title || project.title,
    description: seo?.metaDescription || seo?.description || project.excerpt,
    canonicalUrl: seo?.canonicalUrl,
    path: getProjectPath(project.slug),
    noIndex: project.isDemo === true || seo?.noIndex === true,
    image: imageUrl
      ? {
          url: imageUrl,
          alt: seo?.openGraphImage?.alt || project.title,
          height: dimensions?.height,
          width: dimensions?.width,
        }
      : undefined,
  });
}

export const siteMetadata = createMetadata();
