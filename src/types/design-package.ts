export type PresentationFormat = "2D" | "3D";

export interface PackagePriceOption {
  label: string;
  price: string;
  href: string;
}

export interface DesignPackage {
  slug: string;
  title: string;
  scopeLabel: string;
  deliveryMode: "Dijital ürün";
  summary: string;
  benefit: string;
  pricingLabel: string;
  pricingNote: string;
  priceOptions?: readonly PackagePriceOption[];
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
  shopierUrl: string;
  showOnHomepage: boolean;
  order: number;
}
