import { describe, expect, it } from "vitest";

import {
  isWebglHeroEnabled,
  isWebglViewportCapable,
  WEBGL_MIN_VIEWPORT_WIDTH,
} from "@/lib/experience/webgl-capability";

describe("isWebglHeroEnabled", () => {
  it("enables WebGL when the deployment variable is absent", () => {
    expect(isWebglHeroEnabled(undefined)).toBe(true);
  });

  it("allows deployments to disable WebGL explicitly", () => {
    expect(isWebglHeroEnabled("false")).toBe(false);
    expect(isWebglHeroEnabled(" FALSE ")).toBe(false);
  });
});

describe("isWebglViewportCapable", () => {
  it("allows a compact fine-pointer desktop viewport", () => {
    expect(isWebglViewportCapable({ hasFinePointer: true, viewportWidth: 639 })).toBe(true);
  });

  it("keeps narrow and coarse-pointer devices on the fallback", () => {
    expect(
      isWebglViewportCapable({
        hasFinePointer: true,
        viewportWidth: WEBGL_MIN_VIEWPORT_WIDTH - 1,
      }),
    ).toBe(false);
    expect(isWebglViewportCapable({ hasFinePointer: false, viewportWidth: 1280 })).toBe(false);
  });
});
