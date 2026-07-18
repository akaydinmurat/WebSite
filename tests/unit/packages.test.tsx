import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PackageCard } from "@/components/packages/package-card";
import { fallbackPackages } from "@/content/fallback-packages";

describe("design package dossiers", () => {
  it("keeps seven uniquely ordered, verified service scopes", () => {
    expect(fallbackPackages).toHaveLength(7);
    expect(new Set(fallbackPackages.map((designPackage) => designPackage.slug)).size).toBe(7);
    expect(new Set(fallbackPackages.map((designPackage) => designPackage.image.src)).size).toBe(7);
    expect(fallbackPackages.map((designPackage) => designPackage.order)).toEqual([
      1, 2, 3, 4, 5, 6, 7,
    ]);

    for (const designPackage of fallbackPackages) {
      expect(designPackage.benefit).not.toHaveLength(0);
      expect(designPackage.pricingLabel).not.toHaveLength(0);
      expect(designPackage.pricingNote).not.toHaveLength(0);
      expect(designPackage.image.src).toMatch(/^\/images\/packages\/.+\.webp$/);
      expect(designPackage.image.alt).not.toHaveLength(0);
    }
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

  it("renders the benefit and transparent pricing method without invented amounts", () => {
    render(<PackageCard designPackage={fallbackPackages[3]} index={3} />);

    expect(screen.getByRole("heading", { name: "Mekân Tasarımı — 2D + 3D" })).toBeVisible();
    expect(screen.getByText("Sunum biçimi")).toBeVisible();
    expect(screen.getByText("Size ne katar?")).toBeVisible();
    expect(screen.getByText("Fiyatlandırma")).toBeVisible();
    expect(screen.getByText("Kapsama göre teklif")).toBeVisible();
    expect(screen.queryByText(/₺/)).not.toBeInTheDocument();
    expect(screen.queryByText("Teslim")).not.toBeInTheDocument();
    expect(screen.queryByText("Revizyon")).not.toBeInTheDocument();
  });
});
