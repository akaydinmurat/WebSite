export {
  createMetadata,
  createProjectMetadata,
  siteMetadata,
  type MetadataOptions,
  type OpenGraphImageInput,
  type ProjectMetadataInput,
  type ProjectSeoInput,
} from "./metadata";
export {
  getCanonicalUrl,
  getHttpUrl,
  getProjectPath,
  getSiteUrl,
  isPublicSiteUrl,
  isSiteIndexable,
  normalizeSiteUrl,
  siteUrl,
} from "./site-url";
export {
  createProjectBreadcrumbJsonLd,
  createSiteJsonLd,
  serializeJsonLd,
  type BreadcrumbListItemJsonLd,
  type BreadcrumbListJsonLd,
  type JsonLdData,
  type ProfessionalServiceJsonLd,
  type ProjectBreadcrumbInput,
  type SiteJsonLd,
  type WebSiteJsonLd,
} from "./structured-data";
