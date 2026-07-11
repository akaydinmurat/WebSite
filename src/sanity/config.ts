"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import type { SanityPublicEnv } from "./env";
import { schemaTypes } from "./schema";
import { structure } from "./structure";

export function createStudioConfig({ projectId, dataset, apiVersion }: SanityPublicEnv) {
  return defineConfig({
    name: "default",
    title: "Murat Akaydın Studio",
    basePath: "/studio",
    projectId,
    dataset,
    plugins: [
      structureTool({ structure }),
      ...(process.env.NODE_ENV === "development"
        ? [visionTool({ defaultApiVersion: apiVersion })]
        : []),
    ],
    schema: {
      types: schemaTypes,
    },
  });
}
