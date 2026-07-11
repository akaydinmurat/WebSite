import { z } from "zod";

const httpsUrlSchema = z
  .string()
  .url()
  .refine((value) => new URL(value).protocol === "https:", {
    message: "Only HTTPS URLs are accepted.",
  });

const googleUrlSchema = httpsUrlSchema.refine((value) => {
  const hostname = new URL(value).hostname.toLowerCase();

  return hostname === "google.com" || hostname.endsWith(".google.com");
}, "Expected a Google URL.");

const googleImageUrlSchema = httpsUrlSchema.refine((value) => {
  const hostname = new URL(value).hostname.toLowerCase();

  return hostname === "googleusercontent.com" || hostname.endsWith(".googleusercontent.com");
}, "Expected a Google-hosted image URL.");

const localizedTextSchema = z.object({
  text: z.string().trim().min(1),
  languageCode: z.string().trim().min(2),
});

const authorAttributionSchema = z.object({
  displayName: z.string().trim().min(1),
  uri: googleUrlSchema,
  photoUri: googleImageUrlSchema.optional(),
});

const visitDateSchema = z.object({
  year: z.number().int().min(1).max(9999),
  month: z.number().int().min(1).max(12),
  day: z.number().int().min(0).max(31).optional(),
});

export const googlePlacesReviewSchema = z.object({
  name: z.string().trim().min(1),
  relativePublishTimeDescription: z.string().trim().min(1),
  text: localizedTextSchema,
  originalText: localizedTextSchema.optional(),
  rating: z.number().min(1).max(5),
  authorAttribution: authorAttributionSchema,
  publishTime: z.string().datetime({ offset: true }),
  flagContentUri: googleUrlSchema,
  googleMapsUri: googleUrlSchema,
  visitDate: visitDateSchema.optional(),
});

const providerAttributionSchema = z.object({
  provider: z.string().trim().min(1),
  providerUri: httpsUrlSchema,
});

export const googlePlacesResponseSchema = z.object({
  id: z.string().trim().min(1),
  displayName: localizedTextSchema,
  rating: z.number().min(1).max(5).optional(),
  userRatingCount: z.number().int().nonnegative().optional(),
  googleMapsUri: googleUrlSchema.optional(),
  reviews: z.array(z.unknown()).max(5).default([]),
  attributions: z.array(providerAttributionSchema).default([]),
});

export type GooglePlacesResponse = z.infer<typeof googlePlacesResponseSchema>;
