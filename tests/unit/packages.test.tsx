import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PackageCard } from "@/components/packages/package-card";
import { fallbackPackages } from "@/content/fallback-packages";

describe("design package dossiers", () => {
  it("keeps eleven uniquely ordered Shopier product families", () => {
    expect(fallbackPackages).toHaveLength(11);
    expect(new Set(fallbackPackages.map((designPackage) => designPackage.slug)).size).toBe(11);
    expect(new Set(fallbackPackages.map((designPackage) => designPackage.image.src)).size).toBe(11);
    expect(fallbackPackages.map((designPackage) => designPackage.order)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
    ]);

    for (const designPackage of fallbackPackages) {
      expect(designPackage.benefit).not.toHaveLength(0);
      expect(designPackage.pricingLabel).toMatch(/^\d{1,2}\.\d{3} TL(?:'den)?$/);
      expect(designPackage.pricingNote).not.toHaveLength(0);
      expect(designPackage.image.src).toMatch(/^\/images\/packages\/.+\.webp$/);
      expect(designPackage.image.alt).not.toHaveLength(0);
      expect(designPackage.shopierUrl).toMatch(
        /^https:\/\/www\.shopier\.com\/mimargoknuruygur\/\d+$/,
      );
    }
  });

  it("keeps the verified 2D exclusion and product-design revision scope explicit", () => {
    const twoDimensional = fallbackPackages.find(
      (designPackage) => designPackage.slug === "online-layout-consulting-2d",
    );
    const productDesign = fallbackPackages.find(
      (designPackage) => designPackage.slug === "product-design",
    );

    expect(twoDimensional?.presentationFormats).toEqual(["2D"]);
    expect(twoDimensional?.exclusions).toEqual(["3D çizim hizmeti"]);
    expect(productDesign?.presentationFormats).toEqual(["2D", "3D"]);
    expect(productDesign?.scopeItems).toContain("3D tesliminden sonra 1 revize hakkı");
  });

  it("renders the verified price and links the product to Shopier", () => {
    render(<PackageCard designPackage={fallbackPackages[3]} index={3} />);

    expect(screen.getByRole("heading", { name: "Ürün Tasarımı" })).toBeVisible();
    expect(screen.getByText("Sunum biçimi")).toBeVisible();
    expect(screen.getByText("Size ne katar?")).toBeVisible();
    expect(screen.getByText("Fiyatlandırma")).toBeVisible();
    expect(screen.getByText("6.900 TL")).toBeVisible();
    expect(screen.getByRole("link", { name: /Shopier'da inceleyin/ })).toHaveAttribute(
      "href",
      "https://www.shopier.com/mimargoknuruygur/43321697",
    );
  });

  it("renders all three verified housing options and prices", () => {
    render(<PackageCard designPackage={fallbackPackages[10]} index={10} />);

    expect(screen.getByText("29.000 TL'den")).toBeVisible();
    expect(screen.getByRole("link", { name: /1\+1 · 70 m²'ye kadar/ })).toHaveTextContent(
      "29.000 TL",
    );
    expect(screen.getByRole("link", { name: /2\+1 · 90 m²'ye kadar/ })).toHaveTextContent(
      "39.000 TL",
    );
    expect(screen.getByRole("link", { name: /3\+1 · 120 m²'ye kadar/ })).toHaveTextContent(
      "48.000 TL",
    );
  });
});
