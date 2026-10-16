import { describe, it, expect } from "vitest";
import { PRODUCTS_DATA, CATEGORIES_DATA } from "../src/lib/catalog-data";
import { calculateProductPrice } from "../src/lib/pricing-calculator";

describe("FYF Uniformes E-Commerce Integration & Data Integrity Tests", () => {
  it("verifies all official categories exist with proper slugs and descriptions", () => {
    expect(CATEGORIES_DATA.length).toBeGreaterThanOrEqual(6);
    const expectedSlugs = [
      "ropa-termica",
      "ropa-ignifuga",
      "uniformes-personalizados",
      "ropa-industrial-trabajo",
      "calzado-industrial",
      "implementos-seguridad",
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
        const dozenPrice = v.dozenPrice ?? v.unitPrice;
        const wholesalePrice = v.wholesalePrice ?? dozenPrice;
        expect(dozenPrice).toBeGreaterThan(0);
        expect(wholesalePrice).toBeGreaterThan(0);
        expect(dozenPrice).toBeLessThanOrEqual(v.unitPrice);
        expect(wholesalePrice).toBeLessThanOrEqual(dozenPrice);
      });
    });
  });

  it("simulates full cart checkout calculation for FYF Uniformes corporate workwear order", () => {
    // 24 Chompas térmicas reflectivas ($45.00 c/u docena) + Bordado computarizado (+$0.20 c/u) = $45.20 c/u -> $1084.80
    const thermalJackets = calculateProductPrice({
      unitPrice: 48.00,
      dozenPrice: 45.00,
      wholesalePrice: 42.00,
      quantity: 24,
      withLogo: true,
      logoPriceExtra: 0.20,
    });

    expect(thermalJackets.effectiveUnitPrice).toBe(45.20);
    expect(thermalJackets.itemSubtotal).toBe(1084.80);

    // 10 Botines Bompel Dieléctricos ($45.00 c/u)
    const boots = calculateProductPrice({
      unitPrice: 45.00,
      dozenPrice: 42.00,
      wholesalePrice: 39.00,
      quantity: 10,
      withLogo: false,
    });
    expect(boots.itemSubtotal).toBe(450.00);

    const subtotal = thermalJackets.itemSubtotal + boots.itemSubtotal;
    expect(subtotal).toBe(1534.80);

    const shippingLocal = 3.50;
    const grandTotal = Number((subtotal + shippingLocal).toFixed(2));
    expect(grandTotal).toBe(1538.30);
  });
});
