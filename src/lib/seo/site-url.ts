import { siteConfig } from "@/config/site";

const FALLBACK_SITE_URL = "http://localhost:3000";
const HTTP_PROTOCOLS = new Set(["http:", "https:"]);
const RESERVED_HOST_SUFFIXES = [".example", ".invalid", ".local", ".localhost", ".test"];
const RESERVED_HOSTNAMES = new Set(["example.com", "example.net", "example.org", "localhost"]);

function fallbackSiteUrl(): URL {
  return new URL(FALLBACK_SITE_URL);
}

function stripIpv6Brackets(hostname: string): string {
  return hostname.replace(/^\[|\]$/g, "");
}

function isPrivateIpv4Address(hostname: string): boolean {
  const octets = hostname.split(".").map(Number);

  if (
    octets.length !== 4 ||
    octets.some((octet) => !Number.isInteger(octet) || octet < 0 || octet > 255)
  ) {
    return false;
  }

  const [first, second] = octets;

  return (
    first === 0 ||
    first === 10 ||
    first === 127 ||
    (first === 169 && second === 254) ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 168)
  );
}

function isPrivateIpv6Address(hostname: string): boolean {
  const normalizedHostname = stripIpv6Brackets(hostname).toLowerCase();

  return (
    normalizedHostname === "::" ||
    normalizedHostname === "::1" ||
    normalizedHostname.startsWith("fc") ||
    normalizedHostname.startsWith("fd") ||
    normalizedHostname.startsWith("fe8") ||
    normalizedHostname.startsWith("fe9") ||
    normalizedHostname.startsWith("fea") ||
    normalizedHostname.startsWith("feb")
  );
}

/**
 * Normalizes the configured domain to a clean HTTP(S) origin. Invalid, credentialed,
 * or non-web URLs deliberately fall back to the documented local development origin.
 */
export function normalizeSiteUrl(value: string | URL | null | undefined): URL {
  try {
    const url = value instanceof URL ? new URL(value) : new URL(value?.trim() || FALLBACK_SITE_URL);

    if (!HTTP_PROTOCOLS.has(url.protocol) || !url.hostname || url.username || url.password) {
      return fallbackSiteUrl();
    }

    url.hash = "";
    url.pathname = "/";
    url.search = "";

    return url;
  } catch {
    return fallbackSiteUrl();
  }
}

export const siteUrl = normalizeSiteUrl(siteConfig.siteUrl);

/** Resolves an application path without allowing it to escape the configured site origin. */
export function getSiteUrl(pathname = "/"): URL {
  const cleanedPathname = pathname.trim() || "/";
  const relativePathname = cleanedPathname.startsWith("/")
    ? cleanedPathname
    : `/${cleanedPathname}`;

  try {
    const url = new URL(relativePathname, siteUrl);

    return url.origin === siteUrl.origin ? url : new URL("/", siteUrl);
  } catch {
    return new URL("/", siteUrl);
  }
}

/** Accepts a relative or absolute canonical URL, but only when it is a credential-free HTTP(S) URL. */
export function getCanonicalUrl(value: string | URL | null | undefined, fallbackPath = "/"): URL {
  const fallbackUrl = getSiteUrl(fallbackPath);

  if (!value) {
    return fallbackUrl;
  }

  try {
    const url = value instanceof URL ? new URL(value) : new URL(value.trim(), siteUrl);

    if (!HTTP_PROTOCOLS.has(url.protocol) || !url.hostname || url.username || url.password) {
      return fallbackUrl;
    }

    url.hash = "";

    return url;
  } catch {
    return fallbackUrl;
  }
}

/** Returns a safe external HTTP(S) URL or null for unsupported/credentialed values. */
export function getHttpUrl(value: string | URL | null | undefined): URL | null {
  if (!value) {
    return null;
  }

  try {
    const url = value instanceof URL ? new URL(value) : new URL(value.trim());

    return HTTP_PROTOCOLS.has(url.protocol) && url.hostname && !url.username && !url.password
      ? url
      : null;
  } catch {
    return null;
  }
}

/** Identifies whether the configured origin is suitable for public indexing. */
export function isPublicSiteUrl(value: URL = siteUrl): boolean {
  const hostname = value.hostname.toLowerCase();
  const normalizedHostname = stripIpv6Brackets(hostname);

  if (
    !HTTP_PROTOCOLS.has(value.protocol) ||
    RESERVED_HOSTNAMES.has(normalizedHostname) ||
    RESERVED_HOST_SUFFIXES.some((suffix) => normalizedHostname.endsWith(suffix)) ||
    isPrivateIpv4Address(normalizedHostname) ||
    (normalizedHostname.includes(":") && isPrivateIpv6Address(normalizedHostname))
  ) {
    return false;
  }

  return true;
}

/** Keeps development and Vercel preview deployments out of search indexes. */
export function isSiteIndexable(value: URL = siteUrl): boolean {
  const vercelEnvironment = process.env.VERCEL_ENV?.trim();

  return (
    process.env.NODE_ENV === "production" &&
    (!vercelEnvironment || vercelEnvironment === "production") &&
    isPublicSiteUrl(value)
  );
}

export function getProjectPath(slug: string): string {
  const routeSegment = encodeURIComponent(slug.trim().normalize("NFC"));

  return routeSegment ? `/projects/${routeSegment}` : "/projects";
}
