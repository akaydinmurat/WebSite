import "server-only";

import type { GoogleReview, GoogleReviewPlace, GoogleReviewsResult } from "@/types/google-reviews";

import {
  googlePlacesResponseSchema,
  googlePlacesReviewSchema,
  type GooglePlacesResponse,
} from "./schema";

const GOOGLE_PLACES_ENDPOINT = "https://places.googleapis.com/v1/places";
const DEFAULT_TIMEOUT_MS = 4_000;

export const GOOGLE_PLACES_FIELD_MASK =
  "id,displayName,rating,userRatingCount,googleMapsUri,reviews,attributions";

interface GoogleReviewsFetchOptions {
  env?: Readonly<Record<string, string | undefined>>;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
}

export async function getGoogleReviews({
  env = process.env,
  fetchImpl = fetch,
  timeoutMs = DEFAULT_TIMEOUT_MS,
}: GoogleReviewsFetchOptions = {}): Promise<GoogleReviewsResult> {
  const fallbackUrl = normalizeGoogleMapsUrl(env.GOOGLE_MAPS_PLACE_URL);

  if (env.GOOGLE_REVIEWS_ENABLED?.trim() !== "true") {
    return { status: "disabled" };
  }

  const apiKey = env.GOOGLE_PLACES_API_KEY?.trim();
  const placeId = env.GOOGLE_PLACE_ID?.trim();

  if (!apiKey || !placeId) {
    return { status: "unconfigured" };
  }

  const requestUrl = new URL(GOOGLE_PLACES_ENDPOINT + "/" + encodeURIComponent(placeId));
  requestUrl.searchParams.set("languageCode", "tr");
  requestUrl.searchParams.set("regionCode", "TR");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), Math.max(1, timeoutMs));

  try {
    const response = await fetchImpl(requestUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": GOOGLE_PLACES_FIELD_MASK,
      },
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      return unavailableResult(fallbackUrl);
    }

    const payload: unknown = await response.json();
    const parsedPlace = googlePlacesResponseSchema.safeParse(payload);

    if (!parsedPlace.success) {
      return unavailableResult(fallbackUrl);
    }

    return normalizeGoogleReviews(parsedPlace.data, fallbackUrl);
  } catch {
    return unavailableResult(fallbackUrl);
  } finally {
    clearTimeout(timeout);
  }
}

function normalizeGoogleReviews(
  response: GooglePlacesResponse,
  fallbackUrl?: string,
): GoogleReviewsResult {
  const place: GoogleReviewPlace = {
    id: response.id,
    displayName: response.displayName.text,
    ...(response.rating === undefined ? {} : { rating: response.rating }),
    ...(response.userRatingCount === undefined ? {} : { reviewCount: response.userRatingCount }),
    ...(response.googleMapsUri || fallbackUrl
      ? { googleMapsUrl: response.googleMapsUri ?? fallbackUrl }
      : {}),
  };

  const reviews = response.reviews.flatMap<GoogleReview>((candidate) => {
    const parsedReview = googlePlacesReviewSchema.safeParse(candidate);

    if (!parsedReview.success) return [];

    const review = parsedReview.data;
    const isTranslated = Boolean(
      review.originalText &&
      (review.originalText.languageCode !== review.text.languageCode ||
        review.originalText.text !== review.text.text),
    );

    return [
      {
        resourceName: review.name,
        rating: review.rating,
        text: review.text.text,
        textLanguageCode: review.text.languageCode,
        ...(review.originalText
          ? {
              originalText: review.originalText.text,
              originalLanguageCode: review.originalText.languageCode,
            }
          : {}),
        isTranslated,
        relativePublishTime: review.relativePublishTimeDescription,
        publishTime: review.publishTime,
        author: {
          displayName: review.authorAttribution.displayName,
          profileUrl: review.authorAttribution.uri,
          ...(review.authorAttribution.photoUri
            ? { photoUrl: review.authorAttribution.photoUri }
            : {}),
        },
        googleMapsUrl: review.googleMapsUri,
        reportUrl: review.flagContentUri,
        ...(review.visitDate
          ? {
              visitDate: {
                month: review.visitDate.month,
                year: review.visitDate.year,
              },
            }
          : {}),
      },
    ];
  });

  const providerAttributions = response.attributions.map((attribution) => ({
    provider: attribution.provider,
    providerUrl: attribution.providerUri,
  }));

  if (reviews.length === 0) {
    return {
      status: "empty",
      source: "Google Maps",
      place,
      providerAttributions,
    };
  }

  return {
    status: "ready",
    source: "Google Maps",
    ordering: "relevance",
    place,
    reviews,
    providerAttributions,
  };
}

function unavailableResult(fallbackUrl?: string): GoogleReviewsResult {
  return {
    status: "unavailable",
    ...(fallbackUrl ? { fallbackUrl } : {}),
  };
}

function normalizeGoogleMapsUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;

  try {
    const url = new URL(value.trim());
    const hostname = url.hostname.toLowerCase();
    const allowedHostname =
      hostname === "google.com" ||
      hostname.endsWith(".google.com") ||
      hostname === "maps.app.goo.gl" ||
      hostname === "goo.gl" ||
      hostname === "g.page";

    return url.protocol === "https:" && allowedHostname ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}
