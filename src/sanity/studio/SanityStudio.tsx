"use client";

import { NextStudio } from "next-sanity/studio";

import { createStudioConfig } from "../config";
import { getSanityEnvStatus } from "../env";

export function SanityStudio() {
  const status = getSanityEnvStatus();

  if (!status.configured) {
    return null;
  }

  return <NextStudio config={createStudioConfig(status.env)} />;
}
