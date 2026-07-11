import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { getGoogleReviews, GOOGLE_PLACES_FIELD_MASK } from "@/lib/google-places/fetch-reviews";

const configuredEnv = {
  GOOGLE_REVIEWS_ENABLED: "true",
  GOOGLE_PLACES_API_KEY: "test-server-key",
  GOOGLE_PLACE_ID: "test-place-id",
  GOOGLE_MAPS_PLACE_URL: "https://www.google.com/maps/place/test-business",
} satisfies Record<string, string>;

const validPlaceResponse = {
  id: "test-place-id",
  displayName: { text: "TEST İşletmesi", languageCode: "tr" },
  rating: 4.8,
  userRatingCount: 12,
  googleMapsUri: "https://www.google.com/maps/place/test-business",
  reviews: [
    {
      name: "places/test-place-id/reviews/test-review-id",
      relativePublishTimeDescription: "2 ay önce",
      text: { text: "TEST YORUM İÇERİĞİ", languageCode: "tr" },
      originalText: { text: "TEST REVIEW CONTENT", languageCode: "en" },
      rating: 5,
      authorAttribution: {
        displayName: "TEST Kullanıcısı",
        uri: "https://www.google.com/maps/contrib/test-user",
        photoUri: "https://lh3.googleusercontent.com/test-avatar",
      },
      publishTime: "2026-01-01T00:00:00Z",
      flagContentUri: "https://www.google.com/local/review/rap/report?test=1",
      googleMapsUri: "https://www.google.com/maps/reviews/test-review-id",
    },
  ],
  attributions: [],
};

describe("Google Places reviews", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("does not call Google while the feature is disabled", async () => {
    const fetchImpl = vi.fn<typeof fetch>();

    const result = await getGoogleReviews({
      env: { ...configuredEnv, GOOGLE_REVIEWS_ENABLED: "false" },
      fetchImpl,
    });

    expect(result).toEqual({ status: "disabled" });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("returns an unconfigured state without exposing a partial integration", async () => {
    const fetchImpl = vi.fn<typeof fetch>();

    const result = await getGoogleReviews({
      env: { GOOGLE_REVIEWS_ENABLED: "true" },
      fetchImpl,
    });

    expect(result).toEqual({ status: "unconfigured" });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("uses a server-only field mask and no-store request, then normalizes API data", async () => {
    const fetchImpl = vi.fn<typeof fetch>(async () =>
      Promise.resolve(
        new Response(JSON.stringify(validPlaceResponse), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );

    const result = await getGoogleReviews({ env: configuredEnv, fetchImpl });

    expect(fetchImpl).toHaveBeenCalledOnce();
    const [requestUrl, requestInit] = fetchImpl.mock.calls[0];
    const headers = new Headers(requestInit?.headers);

    expect(String(requestUrl)).toBe(
      "https://places.googleapis.com/v1/places/test-place-id?languageCode=tr&regionCode=TR",
    );
    expect(String(requestUrl)).not.toContain(configuredEnv.GOOGLE_PLACES_API_KEY);
    expect(requestInit?.cache).toBe("no-store");
    expect(headers.get("X-Goog-Api-Key")).toBe(configuredEnv.GOOGLE_PLACES_API_KEY);
    expect(headers.get("X-Goog-FieldMask")).toBe(GOOGLE_PLACES_FIELD_MASK);
    expect(result).toMatchObject({
      status: "ready",
      ordering: "relevance",
      place: {
        id: "test-place-id",
        displayName: "TEST İşletmesi",
        rating: 4.8,
        reviewCount: 12,
      },
      reviews: [
        {
          text: "TEST YORUM İÇERİĞİ",
          originalText: "TEST REVIEW CONTENT",
          isTranslated: true,
          author: { displayName: "TEST Kullanıcısı" },
        },
      ],
    });
  });

  it("drops malformed review entries instead of inventing missing attribution", async () => {
    const fetchImpl = vi.fn<typeof fetch>(async () =>
      Promise.resolve(
        new Response(
          JSON.stringify({
            ...validPlaceResponse,
            reviews: [{ ...validPlaceResponse.reviews[0], flagContentUri: undefined }],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
      ),
    );

    const result = await getGoogleReviews({ env: configuredEnv, fetchImpl });

    expect(result).toMatchObject({
      status: "empty",
      place: { rating: 4.8, reviewCount: 12 },
    });
  });

  it("returns only an owner-verified Maps link when Google is unavailable", async () => {
    const fetchImpl = vi.fn<typeof fetch>(async () =>
      Promise.resolve(new Response("Service unavailable", { status: 503 })),
    );

    const result = await getGoogleReviews({ env: configuredEnv, fetchImpl });

    expect(result).toEqual({
      status: "unavailable",
      fallbackUrl: "https://www.google.com/maps/place/test-business",
    });
  });

  it("rejects arbitrary fallback hosts and malformed Places responses", async () => {
    const fetchImpl = vi.fn<typeof fetch>(async () =>
      Promise.resolve(
        new Response(JSON.stringify({ reviews: [] }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );

    const result = await getGoogleReviews({
      env: { ...configuredEnv, GOOGLE_MAPS_PLACE_URL: "https://example.com/fake-review" },
      fetchImpl,
    });

    expect(result).toEqual({ status: "unavailable" });
  });
});
