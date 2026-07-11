export interface PackageRevisionPolicy {
  rounds: number;
  label: string;
  isIndicative: true;
  note: string;
}

export interface PackageDeliveryTime {
  label: string;
  isIndicative: true;
  note: string;
}

export interface PackageStartingPrice {
  amount: null;
  currency: "TRY";
  label: string;
  isPlaceholder: true;
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
  isDemo: true;
  demoNotice: string;
}
