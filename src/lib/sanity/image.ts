import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";

import { getSanityClient } from "./client";

let cachedBuilder: ReturnType<typeof createImageUrlBuilder> | undefined;

/**
 * Keeps crop and hotspot data intact when building a responsive image URL.
 * Returns null while Sanity is disabled so callers can render a local fallback.
 */
export function urlForImage(source: SanityImageSource) {
  const client = getSanityClient();

  if (!client) {
    return null;
  }

  cachedBuilder ??= createImageUrlBuilder(client);

  return cachedBuilder.image(source);
}
