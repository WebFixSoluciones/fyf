import { describe, it, expect } from "vitest";
import { PRODUCTS_DATA, CATEGORIES_DATA } from "../src/lib/catalog-data";
import { calculateProductPrice } from "../src/lib/pricing-calculator";

describe("Alina Shop E-Commerce Integration & Data Integrity Tests", () => {
  it("verifies all 8 official categories exist with proper slugs and descriptions", () => {
    expect(CATEGORIES_DATA.length).toBe(8);
    const expectedSlugs = [
      "bases-mdf",
      "minibases",
      "bases-rectangulares",
      "bases-disenos",
      "toppers",
      "apliques",
      "cajas",
      "complementos",
    ];
    expectedSlugs.forEach((slug) => {
      const found = CATEGORIES_DATA.find((c) => c.slug === slug);
      expect(found).toBeDefined();
      expect(found?.name.length).toBeGreaterThan(0);
    });
  });

  it("verifies all products have valid SKUs, slugs, and categories", () => {
    expect(PRODUCTS_DATA.length).toBeGreaterThanOrEqual(10);
    const skus = new Set<string>();
    const slugs = new Set<string>();

    PRODUCTS_DATA.forEach((product) => {
      expect(skus.has(product.sku)).toBe(false);
      skus.add(product.sku);

      expect(slugs.has(product.slug)).toBe(false);
      slugs.add(product.slug);

      const categoryExists = CATEGORIES_DATA.some((c) => c.slug === product.categorySlug);
      expect(categoryExists).toBe(true);

      expect(product.variants.length).toBeGreaterThan(0);
      product.variants.forEach((v) => {
        expect(v.unitPrice).toBeGreaterThan(0);
        expect(v.dozenPrice).toBeGreaterThan(0);
        expect(v.wholesalePrice).toBeGreaterThan(0);
        expect(v.dozenPrice).toBeLessThanOrEqual(v.unitPrice);
        expect(v.wholesalePrice).toBeLessThanOrEqual(v.dozenPrice);
      });
    });
  });

  it("simulates full cart checkout calculation for Alina Shop typical baker order", () => {
    // 24 Bases MDF 20cm ($0.64 c/u) + Logo grabado (+$0.20 c/u) = $0.84 c/u -> $20.16
    const cakeBases = calculateProductPrice({
      unitPrice: 0.75,
      dozenPrice: 0.64,
      wholesalePrice: 0.55,
      quantity: 24,
      withLogo: true,
      logoPriceExtra: 0.20,
    });

    expect(cakeBases.effectiveUnitPrice).toBe(0.84);
    expect(cakeBases.itemSubtotal).toBe(20.16);

    // 10 Toppers ($1.00 c/u)
    const toppers = calculateProductPrice({
      unitPrice: 1.20,
      dozenPrice: 1.00,
      wholesalePrice: 0.90,
      quantity: 10,
      withLogo: false,
    });
    expect(toppers.itemSubtotal).toBe(12.00);

    const subtotal = cakeBases.itemSubtotal + toppers.itemSubtotal;
    expect(subtotal).toBe(32.16);

    const shippingLocal = 3.50;
    const grandTotal = Number((subtotal + shippingLocal).toFixed(2));
    expect(grandTotal).toBe(35.66);
  });
});
