export { getSanityClient } from "./client";
export {
  getFeaturedProjects,
  getPackages,
  getProjectBySlug,
  getProjectCategories,
  getProjectSlugs,
  getProjects,
  getServices,
  getSiteSettings,
} from "./fetch";
export { urlForImage } from "./image";
export {
  FEATURED_PROJECTS_QUERY,
  PACKAGES_QUERY,
  PROJECT_BY_SLUG_QUERY,
  PROJECT_CATEGORIES_QUERY,
  PROJECT_SLUGS_QUERY,
  PROJECTS_QUERY,
  SERVICES_QUERY,
  SITE_SETTINGS_QUERY,
} from "./queries";
export type {
  DesignPackage,
  ImageWithAlt,
  Material,
  PortableTextContent,
  PortableTextNode,
  Project,
  ProjectCategory,
  ProjectSummary,
  SanityImageAsset,
  Seo,
  Service,
  SiteSettings,
  SocialLink,
} from "./types";
