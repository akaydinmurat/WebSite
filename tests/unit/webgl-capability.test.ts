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
  it("allows desktop and touch viewports that can fit the responsive scene", () => {
    expect(isWebglViewportCapable({ viewportWidth: 1440 })).toBe(true);
    expect(isWebglViewportCapable({ viewportWidth: 360 })).toBe(true);
  });

  it("keeps unsupported viewport sizes on the fallback", () => {
    expect(
      isWebglViewportCapable({
        viewportWidth: WEBGL_MIN_VIEWPORT_WIDTH - 1,
      }),
    ).toBe(false);
    expect(isWebglViewportCapable({ viewportWidth: Number.NaN })).toBe(false);
  });
});
