export interface Service {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  description: string;
  deliverables: readonly string[];
  suitableFor: string;
  visualVariant: "plan" | "perspective" | "room" | "kitchen" | "remote" | "materials";
  order: number;
  inquiryLabel: string;
}
