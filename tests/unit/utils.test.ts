import { describe, expect, it } from "vitest";

import { cn } from "@/lib/utils";

describe("cn", () => {
  it("combines conditional class names", () => {
    expect(cn("base", false && "hidden", { active: true })).toBe("base active");
  });

  it("resolves conflicting Tailwind utilities using the last value", () => {
    expect(cn("px-3 text-sm", "px-6 text-lg")).toBe("px-6 text-lg");
  });
});
