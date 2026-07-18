export type PresentationFormat = "2D" | "3D";

export interface DesignPackage {
  slug: string;
  title: string;
  scopeLabel: string;
  summary: string;
  benefit: string;
  pricingLabel: string;
  pricingNote: string;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  scopeItems: readonly string[];
  examples?: readonly string[];
  presentationFormats?: readonly PresentationFormat[];
  scopeBasis?: string;
  exclusions?: readonly string[];
  inquiry: {
    label: string;
    href: `/contact?package=${string}`;
  };
  showOnHomepage: boolean;
  order: number;
}
