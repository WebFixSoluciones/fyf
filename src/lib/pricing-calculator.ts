export interface PricingInput {
  unitPrice: number;
  dozenPrice: number;
  wholesalePrice: number;
  quantity: number;
  withLogo?: boolean;
  logoPriceExtra?: number; // Default 0.20
  customDimensions?: {
    widthCm: number;
    heightCm: number;
  } | null;
}

export interface PricingResult {
  tier: "unit" | "dozen" | "wholesale";
  baseUnitPrice: number;
  effectiveUnitPrice: number;
  logoUnitPrice: number;
  itemSubtotal: number;
  savingsTotal: number;
  savingsPerUnit: number;
}

/**
 * Motor de cálculo oficial de precios para Alina Shop
 * - < 12 unds: precio unitario
 * - 12 a 49 unds: precio por docena
 * - 50+ unds: precio por mayor
 * - Grabado de logo: +$0.20 ctv por base (opcional)
 * - Dimensiones personalizadas: cálculo dinámico basado en área cm2
 */
export function calculateProductPrice(input: PricingInput): PricingResult {
  const quantity = Math.max(1, Math.floor(input.quantity || 1));
  const logoExtra = input.withLogo ? (input.logoPriceExtra ?? 0.20) : 0;

  let baseUnitPrice = input.unitPrice;
  let dozenPrice = input.dozenPrice;
  let wholesalePrice = input.wholesalePrice;

  // Si tiene dimensiones personalizadas, calcular precio base según área en cm2
  if (input.customDimensions && input.customDimensions.widthCm > 0 && input.customDimensions.heightCm > 0) {
    const area = input.customDimensions.widthCm * input.customDimensions.heightCm;
    // Tasa referencial MDF 3mm corte láser: aprox $0.0016 por cm2 con base mínima
    const calculatedBase = Math.max(0.50, Number((area * 0.0016).toFixed(2)));
    baseUnitPrice = calculatedBase;
    dozenPrice = Number((calculatedBase * 0.88).toFixed(2));
    wholesalePrice = Number((calculatedBase * 0.75).toFixed(2));
  }

  let tier: "unit" | "dozen" | "wholesale" = "unit";
  let appliedBasePrice = baseUnitPrice;

  if (quantity >= 50) {
    tier = "wholesale";
    appliedBasePrice = wholesalePrice;
  } else if (quantity >= 12) {
    tier = "dozen";
    appliedBasePrice = dozenPrice;
  }

  const effectiveUnitPrice = Number((appliedBasePrice + logoExtra).toFixed(2));
  const itemSubtotal = Number((effectiveUnitPrice * quantity).toFixed(2));

  // Ahorro frente al precio unitario estándar sin escala
  const standardUnitTotal = (baseUnitPrice + logoExtra) * quantity;
  const savingsTotal = Math.max(0, Number((standardUnitTotal - itemSubtotal).toFixed(2)));
  const savingsPerUnit = Math.max(0, Number((baseUnitPrice - appliedBasePrice).toFixed(2)));

  return {
    tier,
    baseUnitPrice: appliedBasePrice,
    effectiveUnitPrice,
    logoUnitPrice: logoExtra,
    itemSubtotal,
    savingsTotal,
    savingsPerUnit,
  };
}
