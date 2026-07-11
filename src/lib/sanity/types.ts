export interface SanitySlug {
  current: string;
}

export interface SanityImageDimensions {
  aspectRatio: number;
  height: number;
  width: number;
}

export interface SanityImageAsset {
  _id: string;
  url: string;
  metadata?: {
    dimensions?: SanityImageDimensions;
    lqip?: string;
  };
}

export interface SanityImageCrop {
  bottom: number;
  left: number;
  right: number;
  top: number;
}

export interface SanityImageHotspot {
  height: number;
  width: number;
  x: number;
  y: number;
}

export interface ImageWithAlt {
  _key?: string;
  _type?: "imageWithAlt";
  alt: string;
  asset: SanityImageAsset;
  caption?: string;
  crop?: SanityImageCrop;
  hotspot?: SanityImageHotspot;
}

export interface PortableTextNode {
  _key: string;
  _type: string;
  [key: string]: unknown;
}

export type PortableTextContent = readonly PortableTextNode[];

export interface Seo {
  canonicalUrl?: string;
  metaDescription?: string;
  metaTitle?: string;
  noIndex?: boolean;
  openGraphImage?: ImageWithAlt;
}

export interface ProjectCategory {
  _id: string;
  description?: string;
  order: number;
  slug: string;
  title: string;
}

export interface Material {
  _id: string;
  category?: "wood" | "stone" | "metal" | "textile" | "glass" | "other";
  description?: string;
  hexColor?: string;
  image?: ImageWithAlt;
  title: string;
}

export interface ProjectSummary {
  _id: string;
  area?: number;
  category: ProjectCategory | null;
  coverImage: ImageWithAlt;
  excerpt: string;
  featured: boolean;
  location?: string;
  mobileCoverImage?: ImageWithAlt;
  order: number;
  slug: string;
  title: string;
  year?: number;
}

export interface Project extends ProjectSummary {
  beforeAfter?: {
    after: ImageWithAlt;
    before: ImageWithAlt;
    caption?: string;
  };
  description: PortableTextContent;
  floorPlans: readonly ImageWithAlt[];
  gallery: readonly ImageWithAlt[];
  materials: readonly Material[];
  seo?: Seo;
}

export interface Service {
  _id: string;
  deliverables: readonly string[];
  description?: PortableTextContent;
  excerpt: string;
  featured: boolean;
  image?: ImageWithAlt;
  order: number;
  seo?: Seo;
  slug: string;
  title: string;
}

export interface DesignPackage {
  _id: string;
  deliveryTime: string;
  description?: PortableTextContent;
  featured: boolean;
  image?: ImageWithAlt;
  includedServices: readonly string[];
  order: number;
  priceDisclaimer?: string;
  revisionCount: number;
  seo?: Seo;
  slug: string;
  startingPrice: string;
  summary: string;
  title: string;
}

export interface SocialLink {
  _key: string;
  label: string;
  url: string;
}

export interface SiteSettings {
  _id: string;
  address?: string;
  brandName: string;
  contactEmail?: string;
  contactPhone?: string;
  defaultSeo: Seo;
  positioningStatement: string;
  siteDescription: string;
  socialLinks: readonly SocialLink[];
}
