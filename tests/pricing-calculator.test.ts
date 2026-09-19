import { describe, it, expect } from "vitest";
import { calculateProductPrice } from "../src/lib/pricing-calculator";

describe("Pricing Calculator Engine", () => {
  const sampleBase = {
    unitPrice: 0.80,
    dozenPrice: 0.64,
    wholesalePrice: 0.55,
    quantity: 1,
    withLogo: false,
  };

  it("calculates unit tier for quantity < 12", () => {
    const result = calculateProductPrice({ ...sampleBase, quantity: 5 });
    expect(result.tier).toBe("unit");
    expect(result.baseUnitPrice).toBe(0.80);
    expect(result.effectiveUnitPrice).toBe(0.80);
    expect(result.itemSubtotal).toBe(4.00);
    expect(result.savingsTotal).toBe(0);
  });

  it("calculates dozen tier for quantity between 12 and 49", () => {
    const result = calculateProductPrice({ ...sampleBase, quantity: 12 });
    expect(result.tier).toBe("dozen");
    expect(result.baseUnitPrice).toBe(0.64);
    expect(result.effectiveUnitPrice).toBe(0.64);
    expect(result.itemSubtotal).toBe(7.68);
    expect(result.savingsTotal).toBe(1.92); // (0.80 * 12) - 7.68 = 9.60 - 7.68 = 1.92
  });

  it("calculates wholesale tier for quantity >= 50", () => {
    const result = calculateProductPrice({ ...sampleBase, quantity: 50 });
    expect(result.tier).toBe("wholesale");
    expect(result.baseUnitPrice).toBe(0.55);
    expect(result.effectiveUnitPrice).toBe(0.55);
    expect(result.itemSubtotal).toBe(27.50);
    expect(result.savingsTotal).toBe(12.50); // (0.80 * 50) - 27.50 = 40 - 27.50 = 12.50
  });

  it("adds logo surcharge (+ $0.20) per unit accurately", () => {
    const result = calculateProductPrice({ ...sampleBase, quantity: 12, withLogo: true });
    expect(result.tier).toBe("dozen");
    expect(result.baseUnitPrice).toBe(0.64);
    expect(result.logoUnitPrice).toBe(0.20);
    expect(result.effectiveUnitPrice).toBe(0.84); // 0.64 + 0.20
    expect(result.itemSubtotal).toBe(10.08); // 0.84 * 12 = 10.08
  });

  it("computes dynamic price for custom dimensions", () => {
    const result = calculateProductPrice({
      ...sampleBase,
      quantity: 10,
      customDimensions: { widthCm: 30, heightCm: 40 }, // 1200 cm2
    });
    expect(result.baseUnitPrice).toBeGreaterThan(0.50);
    expect(result.itemSubtotal).toBeGreaterThan(0);
  });
});
