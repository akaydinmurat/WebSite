export interface PackageRevisionPolicy {
  rounds: number | null;
  label: string;
  isIndicative: boolean;
  note: string;
}

export interface PackageDeliveryTime {
  label: string;
  isIndicative: boolean;
  note: string;
}

export interface PackageStartingPrice {
  amount: null;
  currency: "TRY";
  label: string;
  isPlaceholder: boolean;
  note: string;
}

export interface DesignPackage {
  slug: string;
  title: string;
  shortTitle: string;
  summary: string;
  idealFor: string;
  includedServices: readonly string[];
  revisionPolicy: PackageRevisionPolicy;
  deliveryTime: PackageDeliveryTime;
  startingPrice: PackageStartingPrice;
  inquiry: {
    label: string;
    href: `/contact?package=${string}`;
  };
  featured: boolean;
  order: number;
  isDemo: boolean;
  demoNotice: string;
}
