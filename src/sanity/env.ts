const DEFAULT_DATASET = "production";
const DEFAULT_API_VERSION = "2026-03-01";

const PROJECT_ID_PATTERN = /^[a-z0-9]+$/;
const DATASET_PATTERN = /^[a-z0-9][a-z0-9_-]{0,63}$/;
const API_VERSION_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export interface SanityPublicEnv {
  projectId: string;
  dataset: string;
  apiVersion: string;
}

export type SanityEnvStatus =
  | {
      configured: true;
      env: SanityPublicEnv;
    }
  | {
      configured: false;
      reason:
        "missing-project-id" | "invalid-project-id" | "invalid-dataset" | "invalid-api-version";
    };

function clean(value: string | undefined): string | undefined {
  const cleanedValue = value?.trim();

  return cleanedValue ? cleanedValue : undefined;
}

/**
 * Reads public Sanity settings without touching server-only tokens.
 * Missing credentials are a supported state so local development and builds stay usable.
 */
export function getSanityEnvStatus(): SanityEnvStatus {
  const projectId = clean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
  const dataset = clean(process.env.NEXT_PUBLIC_SANITY_DATASET) ?? DEFAULT_DATASET;
  const apiVersion = clean(process.env.NEXT_PUBLIC_SANITY_API_VERSION) ?? DEFAULT_API_VERSION;

  if (!projectId) {
    return { configured: false, reason: "missing-project-id" };
  }

  if (!PROJECT_ID_PATTERN.test(projectId)) {
    return { configured: false, reason: "invalid-project-id" };
  }

  if (!DATASET_PATTERN.test(dataset)) {
    return { configured: false, reason: "invalid-dataset" };
  }

  if (!API_VERSION_PATTERN.test(apiVersion)) {
    return { configured: false, reason: "invalid-api-version" };
  }

  return {
    configured: true,
    env: {
      projectId,
      dataset,
      apiVersion,
    },
  };
}

export function isSanityConfigured(): boolean {
  return getSanityEnvStatus().configured;
}
