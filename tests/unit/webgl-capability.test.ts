import { describe, expect, it } from "vitest";

import {
  isWebglViewportCapable,
  WEBGL_MIN_VIEWPORT_WIDTH,
} from "@/lib/experience/webgl-capability";

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
