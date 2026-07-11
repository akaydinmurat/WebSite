export type ProjectCategoryId =
  | "residential"
  | "living-room"
  | "kitchen"
  | "bathroom"
  | "bedroom"
  | "commercial"
  | "visualization";

export interface ProjectCategory {
  id: ProjectCategoryId;
  label: string;
  description: string;
}

export type ProjectVisualLayout =
  "cover" | "landscape" | "portrait" | "panorama" | "square" | "diptych-left" | "diptych-right";

export type ProjectVisualVariant =
  "soft-portal" | "layered-plane" | "arched-shadow" | "material-study" | "light-well";

export interface ProjectVisual {
  id: string;
  kind: "css-placeholder";
  layout: ProjectVisualLayout;
  variant: ProjectVisualVariant;
  aspectRatio: `${number}/${number}`;
  background: string;
  alt: string;
  caption: string;
}

export interface ProjectFact {
  id: "type" | "location" | "year" | "area" | "status";
  label: string;
  value: string;
  isPlaceholder: boolean;
}

export interface ProjectMaterial {
  name: string;
  description: string;
  swatch: `#${string}`;
  isConceptual: boolean;
}

export interface Project {
  slug: string;
  title: string;
  category: ProjectCategoryId;
  excerpt: string;
  description: string;
  concept: {
    eyebrow: string;
    title: string;
    paragraphs: readonly string[];
  };
  facts: readonly ProjectFact[];
  cover: ProjectVisual;
  gallery: readonly ProjectVisual[];
  materials: readonly ProjectMaterial[];
  relatedProjectSlug: string;
  featured: boolean;
  order: number;
  isDemo: boolean;
  demoNotice: string;
  inquiryPrompt: string;
  seo: {
    title: string;
    description: string;
    noIndex?: boolean;
  };
}
