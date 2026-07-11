export interface GoogleReviewAuthor {
  displayName: string;
  profileUrl: string;
  photoUrl?: string;
}

export interface GoogleReviewVisitDate {
  month: number;
  year: number;
}

export interface GoogleReview {
  resourceName: string;
  rating: number;
  text: string;
  textLanguageCode: string;
  originalText?: string;
  originalLanguageCode?: string;
  isTranslated: boolean;
  relativePublishTime: string;
  publishTime: string;
  author: GoogleReviewAuthor;
  googleMapsUrl: string;
  reportUrl: string;
  visitDate?: GoogleReviewVisitDate;
}

export interface GoogleReviewPlace {
  id: string;
  displayName: string;
  rating?: number;
  reviewCount?: number;
  googleMapsUrl?: string;
}

export interface GoogleReviewProviderAttribution {
  provider: string;
  providerUrl: string;
}

export interface GoogleReviewsReady {
  status: "ready";
  source: "Google Maps";
  ordering: "relevance";
  place: GoogleReviewPlace;
  reviews: readonly GoogleReview[];
  providerAttributions: readonly GoogleReviewProviderAttribution[];
}

export interface GoogleReviewsEmpty {
  status: "empty";
  source: "Google Maps";
  place: GoogleReviewPlace;
  providerAttributions: readonly GoogleReviewProviderAttribution[];
}

export interface GoogleReviewsDisabled {
  status: "disabled";
}

export interface GoogleReviewsUnconfigured {
  status: "unconfigured";
}

export interface GoogleReviewsUnavailable {
  status: "unavailable";
  fallbackUrl?: string;
}

export type GoogleReviewsResult =
  | GoogleReviewsReady
  | GoogleReviewsEmpty
  | GoogleReviewsDisabled
  | GoogleReviewsUnconfigured
  | GoogleReviewsUnavailable;
