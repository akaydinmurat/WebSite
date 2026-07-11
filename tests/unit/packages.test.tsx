import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PackageCard } from "@/components/packages/package-card";
import { fallbackPackages } from "@/content/fallback-packages";

describe("design package dossiers", () => {
  it("keeps seven uniquely ordered, verified service scopes", () => {
    expect(fallbackPackages).toHaveLength(7);
    expect(new Set(fallbackPackages.map((designPackage) => designPackage.slug)).size).toBe(7);
    expect(fallbackPackages.map((designPackage) => designPackage.order)).toEqual([
      1, 2, 3, 4, 5, 6, 7,
    ]);
  });

  it("keeps the verified 2D exclusion and 2D + 3D furniture scope explicit", () => {
    const twoDimensional = fallbackPackages.find(
      (designPackage) => designPackage.slug === "space-design-2d",
    );
    const visualized = fallbackPackages.find(
      (designPackage) => designPackage.slug === "space-design-2d-3d",
    );

    expect(twoDimensional?.presentationFormats).toEqual(["2D"]);
    expect(twoDimensional?.exclusions).toEqual(["3D görsel hizmeti"]);
    expect(visualized?.presentationFormats).toEqual(["2D", "3D"]);
    expect(visualized?.scopeItems).toContain("1 özel imalat mobilya tasarımı");
  });

  it("renders scope information without price, delivery, or revision placeholders", () => {
    render(<PackageCard designPackage={fallbackPackages[3]} index={3} />);

    expect(screen.getByRole("heading", { name: "Mekân Tasarımı — 2D + 3D" })).toBeVisible();
    expect(screen.getByText("Sunum biçimi")).toBeVisible();
    expect(screen.queryByText("Ücret")).not.toBeInTheDocument();
    expect(screen.queryByText("Teslim")).not.toBeInTheDocument();
    expect(screen.queryByText("Revizyon")).not.toBeInTheDocument();
  });
});
