import { describe, expect, it } from "vitest";

import {
  isWebglHeroEnabled,
  isWebglViewportCapable,
  WEBGL_MIN_VIEWPORT_WIDTH,
} from "@/lib/experience/webgl-capability";

describe("isWebglHeroEnabled", () => {
  it("keeps WebGL disabled unless the deployment opts in", () => {
    expect(isWebglHeroEnabled(undefined)).toBe(false);
    expect(isWebglHeroEnabled("false")).toBe(false);
    expect(isWebglHeroEnabled(" FALSE ")).toBe(false);
  });

  it("accepts only an explicit true value", () => {
    expect(isWebglHeroEnabled("true")).toBe(true);
    expect(isWebglHeroEnabled(" TRUE ")).toBe(true);
  });
});

describe("isWebglViewportCapable", () => {
  it("allows large fine-pointer desktop viewports", () => {
    expect(isWebglViewportCapable({ hasFinePointer: true, viewportWidth: 1440 })).toBe(true);
  });

  it("keeps touch, mobile and unsupported viewports on the fallback", () => {
    expect(isWebglViewportCapable({ hasFinePointer: false, viewportWidth: 1440 })).toBe(false);
    expect(isWebglViewportCapable({ hasFinePointer: true, viewportWidth: 360 })).toBe(false);
    expect(
      isWebglViewportCapable({
        hasFinePointer: true,
        viewportWidth: WEBGL_MIN_VIEWPORT_WIDTH - 1,
      }),
    ).toBe(false);
    expect(isWebglViewportCapable({ hasFinePointer: true, viewportWidth: Number.NaN })).toBe(false);
  });
});
