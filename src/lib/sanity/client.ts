import { createClient } from "next-sanity";

import { getSanityEnvStatus } from "@/sanity/env";

let cachedClient: ReturnType<typeof createClient> | null | undefined;

/**
 * Returns a public, published-content client or null when Sanity is not activated.
 * Server-only tokens are deliberately excluded from this shared client.
 */
export function getSanityClient(): ReturnType<typeof createClient> | null {
  if (cachedClient !== undefined) {
    return cachedClient;
  }

  const status = getSanityEnvStatus();

  if (!status.configured) {
    cachedClient = null;
    return cachedClient;
  }

  cachedClient = createClient({
    apiVersion: status.env.apiVersion,
    dataset: status.env.dataset,
    perspective: "published",
    projectId: status.env.projectId,
    useCdn: true,
  });

  return cachedClient;
}
