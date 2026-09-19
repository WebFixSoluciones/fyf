'use client';

import React, { useState, useMemo } from "react";
import { useCart } from "@/context/cart-context";
import { calculateProductPrice } from "@/lib/pricing-calculator";
import { formatCurrency } from "@/lib/utils";
import { 
  Check, 
  MessageCircle, 
  CreditCard, 
  ShoppingBag, 
  ShieldCheck, 
  Sparkles,
  Sliders,
  Truck,
  Clock,
  PackageCheck,
  ChevronDown
} from "lucide-react";

interface Variant {
  code?: string;
  sizeLabel: string;
  shape?: string;
  color?: string;
  unitPrice: number;
  dozenPrice: number;
  wholesalePrice: number;
}

interface ProductCustomizerProps {
  product: {
    id: string;
    name: string;
    slug: string;
    sku: string;
    description: string;
    material?: string;
    mainImage: string;
    hasLogoOption: boolean;
    logoPriceExtra?: number;
    allowCustomSize: boolean;
    variants: Variant[];
  };
  whatsappNumber?: string;
  layout?: "three-column" | "compact";
  gallerySlot?: React.ReactNode;
}

export function ProductCustomizer({ 
  product, 
  whatsappNumber = "593993358701",
  layout = "compact",
  gallerySlot
}: ProductCustomizerProps) {
  const { addItem, buyNow } = useCart();

  // Extract unique available shapes and colors from variants or defaults
  const availableShapes = useMemo(() => {
    const set = new Set<string>();
    product.variants.forEach((v) => {
      if (v.shape) set.add(v.shape);
    });
    if (set.size === 0 && product.material?.includes("MDF")) {
      return ["Rizada", "Redonda", "Cuadrada", "Corazón", "Estrella", "Punta Redonda"];
    }
    return Array.from(set);
  }, [product]);

  const [selectedShape, setSelectedShape] = useState(availableShapes[0] || "Rizada");
  const [selectedColor, setSelectedColor] = useState("Blanco");
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [isCustomSize, setIsCustomSize] = useState(false);
  const [customWidth, setCustomWidth] = useState(25);
  const [customHeight, setCustomHeight] = useState(25);
  const [withLogo, setWithLogo] = useState(false);
  const [quantity, setQuantity] = useState(12); // Default to a dozen for cake supplies

  const activeVariant = product.variants[selectedVariantIndex] || {
    sizeLabel: "20 cm",
    unitPrice: 0.75,
    dozenPrice: 0.64,
    wholesalePrice: 0.55,
  };

  // Compute live price
  const pricing = useMemo(() => {
    return calculateProductPrice({
      unitPrice: Number(activeVariant.unitPrice),
      dozenPrice: Number(activeVariant.dozenPrice),
      wholesalePrice: Number(activeVariant.wholesalePrice),
      quantity,
      withLogo,
      logoPriceExtra: product.logoPriceExtra ?? 0.20,
      customDimensions: isCustomSize ? { widthCm: customWidth, heightCm: customHeight } : null,
    });
  }, [activeVariant, quantity, withLogo, isCustomSize, customWidth, customHeight, product.logoPriceExtra]);

  const sizeDisplayText = isCustomSize
    ? `${customWidth}x${customHeight} cm (A Medida)`
    : activeVariant.sizeLabel;

  // Registrar analítica y abrir WhatsApp
  const handleWhatsAppBuy = async () => {
    try {
      fetch("/api/analytics/whatsapp-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          variantDetails: {
            size: sizeDisplayText,
            shape: selectedShape,
            color: selectedColor,
            withLogo,
          },
          calculatedPrice: pricing.itemSubtotal,
          quantity,
        }),
      }).catch((e) => console.error("Analytics log error:", e));
    } catch (e) {}

    const text = `¡Hola FYF Uniformes! Deseo cotizar este producto:
*Producto:* ${product.name}
*Talla / Medida:* ${sizeDisplayText}
${selectedShape ? `*Tipo / Modelo:* ${selectedShape}\n` : ""}${selectedColor ? `*Color:* ${selectedColor}\n` : ""}*Cantidad:* ${quantity} unidades
*Subtotal estimado:* $${pricing.itemSubtotal.toFixed(2)} USD

¿Me podrían confirmar disponibilidad, tiempos de confección y opciones de bordado? ¡Gracias!`;

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  // Compra directa estilo Shopify (bypasses cart drawer and opens streamlined checkout)
  const handleDirectBuy = () => {
    buyNow({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      mainImage: product.mainImage,
      variantCode: activeVariant.code,
      sizeLabel: sizeDisplayText,
      shape: selectedShape,
      color: selectedColor,
      withLogo,
      customDimensions: isCustomSize ? { widthCm: customWidth, heightCm: customHeight } : null,
      unitPrice: pricing.effectiveUnitPrice,
      quantity,
    });
  };

  // Agregar al carrito normal
  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      mainImage: product.mainImage,
      variantCode: activeVariant.code,
      sizeLabel: sizeDisplayText,
      shape: selectedShape,
      color: selectedColor,
      withLogo,
      customDimensions: isCustomSize ? { widthCm: customWidth, heightCm: customHeight } : null,
      unitPrice: pricing.effectiveUnitPrice,
      quantity,
    });
  };

  // ==========================================
  // PRESENTACIÓN EN 3 COLUMNAS (ALTO RENDIMIENTO)
  // ==========================================
  if (layout === "three-column") {
    return (
      <div className="grid grid-cols-1 gap-6 lg:gap-8 lg:grid-cols-12 items-start pb-20 lg:pb-0">
        {/* COLUMNA 1: Galería de Fotos (4 cols) */}
        <div className="lg:col-span-4 xl:col-span-4 lg:sticky lg:top-24">
          {gallerySlot}
        </div>

        {/* COLUMNA 2: Información, Configurador y Especificaciones Técnicas (5 cols) */}
        <div className="lg:col-span-5 xl:col-span-5 space-y-4 sm:space-y-6">
          {/* Cabecera del Producto */}
          <div className="border-b border-slate-100 pb-3 sm:pb-4">
            <div className="flex items-center gap-2">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                {(product as any).categoryTag || "Línea FYF Uniformes"}
              </span>
            </div>
            <h1 className="mt-1 text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight leading-tight">
              {product.name}
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-slate-600">
              {product.description}
            </p>

            {/* Micro-resumen de precio visible de inmediato en smartphone */}
            <div className="lg:hidden mt-3 p-3 bg-slate-50 border border-slate-200/90 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Precio unitario
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display font-bold text-2xl text-slate-950">
                    {formatCurrency(pricing.effectiveUnitPrice)}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">/ und</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-600 block">
                  Total ({quantity} unds): <strong className="text-alina-700 font-bold">{formatCurrency(pricing.itemSubtotal)}</strong>
                </span>
                {pricing.savingsTotal > 0 && (
                  <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mt-0.5">
                    Ahorras {formatCurrency(pricing.savingsTotal)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Bloque de Configuración Neurálgico */}
          <div className="space-y-4 sm:space-y-5">
            {/* 1. Selector de Forma (si aplica) */}
            {availableShapes.length > 0 && (
              <div>
                <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 sm:mb-2">
                  1. Forma de la base: <span className="font-semibold text-alina-600 normal-case">{selectedShape}</span>
                </label>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {availableShapes.map((shape) => (
                    <button
                      key={shape}
                      type="button"
                      onClick={() => setSelectedShape(shape)}
                      className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        selectedShape === shape
                          ? "bg-alina-50 border-alina-600 text-alina-700 font-bold shadow-2xs"
                          : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      {shape}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Selector de Color / Acabado */}
            {product.material?.includes("MDF") && (
              <div>
                <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 sm:mb-2">
                  2. Acabado / Color: <span className="font-semibold text-slate-900 normal-case">{selectedColor}</span>
                </label>
                <div className="flex gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedColor("Blanco")}
                    className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border text-xs font-medium transition-all ${
                      selectedColor === "Blanco"
                        ? "border-alina-600 bg-white ring-1 ring-alina-600 font-bold shadow-2xs"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <span className="size-3 sm:size-3.5 rounded-full bg-white border border-slate-300 shadow-2xs" />
                    Blanco Laminado
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedColor("Wengué")}
                    className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border text-xs font-medium transition-all ${
                      selectedColor === "Wengué"
                        ? "border-alina-600 bg-white ring-1 ring-alina-600 font-bold shadow-2xs"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <span className="size-3 sm:size-3.5 rounded-full bg-amber-950 shadow-2xs" />
                    Wengué Oscuro
                  </button>
                </div>
              </div>
            )}

            {/* 3. Selector de Medidas o Medida Personalizada */}
            <div className="border border-slate-200 rounded-xl p-3 sm:p-4 bg-white shadow-2xs">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-alina-600" />
                  3. Medida y Dimensiones
                </label>
                {product.allowCustomSize && (
                  <span className="text-[10px] sm:text-[11px] text-alina-600 font-semibold bg-alina-50 px-2 py-0.5 rounded border border-alina-200">
                    A Medida Disp.
                  </span>
                )}
              </div>

              {product.allowCustomSize && (
                <div className="grid grid-cols-2 gap-1.5 sm:gap-2 p-1 bg-slate-100 rounded-lg mb-2.5 sm:mb-3">
                  <button
                    type="button"
                    onClick={() => setIsCustomSize(false)}
                    className={`py-1 sm:py-1.5 text-xs font-semibold rounded-md transition-all ${
                      !isCustomSize
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Medidas Estándar
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCustomSize(true)}
                    className={`py-1 sm:py-1.5 text-xs font-semibold rounded-md transition-all ${
                      isCustomSize
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Bajo Pedido (cm)
                  </button>
                </div>
              )}

              {!isCustomSize ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 sm:gap-2">
                  {product.variants.map((v, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedVariantIndex(idx)}
                      className={`p-1.5 sm:p-2 rounded-lg border text-left transition-all ${
                        selectedVariantIndex === idx
                          ? "border-alina-600 bg-alina-50/50 ring-1 ring-alina-600 font-bold"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="font-semibold text-[11px] sm:text-xs text-slate-900 truncate">{v.sizeLabel}</div>
                      <div className="text-[10px] sm:text-[11px] text-slate-500">{formatCurrency(v.dozenPrice)} doc.</div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-2.5 pt-1">
                  <p className="text-xs text-slate-600">
                    Ingresa el ancho y largo en cm para cotización en tiempo real:
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <div>
                      <label className="block text-[10px] sm:text-[11px] font-semibold text-slate-600 mb-0.5 sm:mb-1">Ancho (cm):</label>
                      <input
                        type="number"
                        min="5"
                        max="100"
                        value={customWidth}
                        onChange={(e) => setCustomWidth(Math.max(5, Number(e.target.value)))}
                        className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-alina-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] sm:text-[11px] font-semibold text-slate-600 mb-0.5 sm:mb-1">Largo (cm):</label>
                      <input
                        type="number"
                        min="5"
                        max="100"
                        value={customHeight}
                        onChange={(e) => setCustomHeight(Math.max(5, Number(e.target.value)))}
                        className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-alina-600"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Grabado de Logotipo Personalizado (+ $0.20 ctv) */}
            {product.hasLogoOption && (
              <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-2.5 sm:p-3.5 flex items-center justify-between">
                <div>
                  <div className="font-display font-semibold text-xs text-slate-900 flex items-center gap-1.5">
                    <span>¿Grabar el logo de tu pastelería?</span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">
                    Grabado láser permanente por <strong>+$0.20 ctvs</strong>/base
                  </p>
                </div>
                <label className="flex items-center gap-1.5 cursor-pointer font-bold text-xs text-alina-600 shrink-0 ml-2">
                  <input
                    type="checkbox"
                    checked={withLogo}
                    onChange={(e) => setWithLogo(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-alina-600 focus:ring-alina-500"
                  />
                  <span>Incluir</span>
                </label>
              </div>
            )}
          </div>

          {/* Ficha Técnica Detallada y Especificaciones (Colapsable en móvil para agilidad) */}
          <details className="group rounded-xl border border-slate-200/90 bg-slate-50/70 overflow-hidden text-xs" open={false}>
            <summary className="p-3 sm:p-4 font-display text-xs font-bold uppercase tracking-wider text-slate-900 cursor-pointer flex items-center justify-between select-none hover:bg-slate-100/60 transition-colors">
              <span>Ficha Técnica & Especificaciones</span>
              <ChevronDown className="size-4 text-slate-500 transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <div className="px-3 pb-3.5 sm:px-4 sm:pb-4 border-t border-slate-200/60 pt-2.5 sm:pt-3">
              <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
                <li className="flex flex-col sm:flex-row sm:items-start gap-0.5 sm:gap-2">
                  <span className="font-semibold text-slate-800 w-28 shrink-0">Material:</span>
                  <span>{product.material || "MDF 3mm de alta densidad corte láser computarizado"}</span>
                </li>
                <li className="flex flex-col sm:flex-row sm:items-start gap-0.5 sm:gap-2">
                  <span className="font-semibold text-slate-800 w-28 shrink-0">Código SKU:</span>
                  <span className="font-mono font-semibold text-slate-800">{product.sku}</span>
                </li>
                <li className="flex flex-col sm:flex-row sm:items-start gap-0.5 sm:gap-2">
                  <span className="font-semibold text-slate-800 w-28 shrink-0">Resistencia:</span>
                  <span>Apto para tortas pesadas, pisos múltiples, buttercream y fondant sin flexión.</span>
                </li>
                <li className="flex flex-col sm:flex-row sm:items-start gap-0.5 sm:gap-2">
                  <span className="font-semibold text-slate-800 w-28 shrink-0">Acabado:</span>
                  <span>Borde sellado por corte láser de precisión, suave y listo para entrega.</span>
                </li>
              </ul>
            </div>
          </details>
        </div>

        {/* COLUMNA 3: Precios, Cantidad, Botones y Beneficios de Envío (3 cols) */}
        <div className="lg:col-span-3 xl:col-span-3 lg:sticky lg:top-24">
          <div className="rounded-2xl border-2 border-slate-200/90 bg-white p-5 shadow-lg space-y-5">
            {/* Header del Precio */}
            <div className="border-b border-slate-100 pb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Precio por Unidad
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-bold text-3xl text-slate-950 tracking-tight">
                  {formatCurrency(pricing.effectiveUnitPrice)}
                </span>
                <span className="text-xs font-medium text-slate-500">/ und</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-xs text-slate-600 font-medium">
                <span>Total ({quantity} {quantity === 1 ? "und" : "unds"}):</span>
                <strong className="text-alina-700 font-bold text-sm">{formatCurrency(pricing.itemSubtotal)}</strong>
              </div>

              {pricing.savingsTotal > 0 && (
                <div className="mt-2.5 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
                  <Sparkles className="size-3.5 text-emerald-600" />
                  <span>Ahorras {formatCurrency(pricing.savingsTotal)} por volumen</span>
                </div>
              )}
            </div>

            {/* Disponibilidad de Taller */}
            <div className="flex items-center gap-2 text-xs">
              <span className="size-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="font-semibold text-slate-800">En taller para despacho</span>
            </div>

            {/* Selector de Cantidad */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Cantidad:
              </label>
              <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 font-bold transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full text-center font-bold text-sm text-slate-900 border-none focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 font-bold transition-colors"
                >
                  +
                </button>
              </div>

              {/* Accesos directos: 1 Docena & 50+ Mayorista */}
              <div className="grid grid-cols-2 gap-1.5 mt-2">
                <button
                  type="button"
                  onClick={() => setQuantity(12)}
                  className={`py-1 px-2 rounded-lg text-xs font-bold border transition-all ${
                    quantity === 12
                      ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  1 Docena (12)
                </button>
                <button
                  type="button"
                  onClick={() => setQuantity(50)}
                  className={`py-1 px-2 rounded-lg text-xs font-bold border transition-all ${
                    quantity === 50
                      ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  50+ Mayor
                </button>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="space-y-2.5 pt-1">
              {/* Botón Principal Carrito / Agregar (Alto Contraste Naranja) */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full bg-[#ff6600] hover:bg-[#ea580c] text-white font-medium py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg text-sm active:scale-[0.99] cursor-pointer"
              >
                <ShoppingBag className="size-4.5 shrink-0" />
                <span>Agregar al Carrito</span>
              </button>

              {/* Botón WhatsApp */}
              <button
                type="button"
                onClick={handleWhatsAppBuy}
                className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-xs text-xs hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <MessageCircle className="size-4 fill-current shrink-0" />
                <span>Cotizar por WhatsApp</span>
              </button>

              {/* Botón Compra Directa */}
              <button
                type="button"
                onClick={handleDirectBuy}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all text-xs hover:scale-[1.01] active:scale-[0.99] shadow-2xs cursor-pointer"
              >
                <CreditCard className="size-4 shrink-0" />
                <span>Pagar con Tarjeta (Directo)</span>
              </button>
            </div>

            {/* Beneficios y Envíos */}
            <div className="border-t border-slate-100 pt-3.5 space-y-2 text-xs">
              <div className="flex items-center gap-2.5">
                <Truck className="size-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-slate-800">Envíos a todo el Ecuador</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="size-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-slate-800">Despacho Rápido 24-48h</span>
              </div>

              <div className="flex items-center gap-2.5">
                <PackageCheck className="size-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-slate-800">Empaque Reforzado Antichoque</span>
              </div>

              <div className="flex items-center gap-2.5">
                <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-slate-800">Garantía FYF Uniformes (+20 años)</span>
              </div>
            </div>

          </div>
        </div>

        {/* Barra de Compra Flotante Sticky en Smartphone y Tablet */}
        <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-40 px-3 py-2 sm:px-4 sm:py-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] flex items-center justify-between gap-2">
          <div className="min-w-0 pr-1">
            <div className="flex items-baseline gap-1">
              <span className="font-display font-bold text-lg text-slate-950 tracking-tight leading-none">
                {formatCurrency(pricing.effectiveUnitPrice)}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">/und</span>
            </div>
            <div className="text-[11px] text-slate-600 truncate font-semibold mt-0.5">
              Total: <span className="text-alina-700 font-bold">{formatCurrency(pricing.itemSubtotal)}</span> ({quantity} {quantity === 1 ? "und" : "unds"})
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleWhatsAppBuy}
              className="bg-[#25D366] hover:bg-[#20ba5a] text-white p-2 sm:p-2.5 rounded-xl shadow-xs active:scale-95 transition-all flex items-center justify-center cursor-pointer"
              title="WhatsApp"
              aria-label="Comprar por WhatsApp"
            >
              <MessageCircle className="size-4.5 sm:size-5 fill-current" />
            </button>
            <button
              type="button"
              onClick={handleDirectBuy}
              className="bg-slate-900 hover:bg-slate-800 text-white font-display font-bold text-xs px-3 sm:px-4 py-2.5 rounded-xl shadow-xs active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <CreditCard className="size-3.5" />
              <span>Comprar</span>
            </button>
            <button
              type="button"
              onClick={handleAddToCart}
              className="bg-alina-50 border border-alina-600 text-alina-700 font-bold text-xs p-2.5 rounded-xl shadow-xs active:scale-95 transition-all flex items-center justify-center cursor-pointer"
              title="Agregar al carrito"
              aria-label="Agregar al carrito"
            >
              <ShoppingBag className="size-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // PRESENTACIÓN COMPACTA (QUICK VIEW MODAL)
  // ==========================================
  return (
    <div className="flex flex-col gap-5">
      {/* Dynamic Price Summary Box */}
      <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4 flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-bold text-3xl text-slate-900 tracking-tight">
              {formatCurrency(pricing.effectiveUnitPrice)}
            </span>
            <span className="text-slate-500 text-xs font-medium">/ unidad</span>
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            Total ({quantity} unds):{" "}
            <strong className="text-alina-600 font-bold">{formatCurrency(pricing.itemSubtotal)}</strong>
          </div>
        </div>

        {pricing.savingsTotal > 0 && (
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Ahorras {formatCurrency(pricing.savingsTotal)} por volumen
          </div>
        )}
      </div>

      {/* 1. Selector de Forma (si aplica) */}
      {availableShapes.length > 0 && (
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            1. Forma: <span className="font-semibold text-alina-600 normal-case">{selectedShape}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {availableShapes.map((shape) => (
              <button
                key={shape}
                type="button"
                onClick={() => setSelectedShape(shape)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  selectedShape === shape
                    ? "bg-alina-50 border-alina-600 text-alina-700 font-bold shadow-2xs"
                    : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                }`}
              >
                {shape}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2. Selector de Color / Acabado */}
      {product.material?.includes("MDF") && (
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            2. Color del MDF: <span className="font-semibold text-slate-900 normal-case">{selectedColor}</span>
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setSelectedColor("Blanco")}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                selectedColor === "Blanco"
                  ? "border-alina-600 bg-white ring-1 ring-alina-600 font-bold"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white border border-slate-300 shadow-2xs" />
              Blanco Laminado
            </button>
            <button
              type="button"
              onClick={() => setSelectedColor("Wengué")}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                selectedColor === "Wengué"
                  ? "border-alina-600 bg-white ring-1 ring-alina-600 font-bold"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-amber-950 shadow-2xs" />
              Wengué Oscuro
            </button>
          </div>
        </div>
      )}

      {/* 3. Selector de Medidas o Medida Personalizada */}
      <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-alina-600" />
            3. Medida y Dimensiones
          </label>
          {product.allowCustomSize && (
            <span className="text-[11px] text-alina-600 font-semibold bg-alina-50 px-2 py-0.5 rounded border border-alina-200">
              Fabricación a Medida Disponible
            </span>
          )}
        </div>

        {product.allowCustomSize && (
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg mb-3">
            <button
              type="button"
              onClick={() => setIsCustomSize(false)}
              className={`py-1.5 text-xs font-semibold rounded-md transition-all ${
                !isCustomSize
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Medidas de Tienda
            </button>
            <button
              type="button"
              onClick={() => setIsCustomSize(true)}
              className={`py-1.5 text-xs font-semibold rounded-md transition-all ${
                isCustomSize
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Bajo Pedido (cm exactos)
            </button>
          </div>
        )}

        {!isCustomSize ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {product.variants.map((v, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedVariantIndex(idx)}
                className={`p-2 rounded-lg border text-left transition-all ${
                  selectedVariantIndex === idx
                    ? "border-alina-600 bg-alina-50/50 ring-1 ring-alina-600"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="font-semibold text-xs text-slate-900 truncate">{v.sizeLabel}</div>
                <div className="text-[11px] text-slate-500">{formatCurrency(v.dozenPrice)} doc.</div>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-3 pt-1">
            <p className="text-xs text-slate-600">
              Ingresa el ancho y largo que necesitas para calcular el precio exacto en tiempo real:
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Ancho (cm):</label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={customWidth}
                  onChange={(e) => setCustomWidth(Math.max(5, Number(e.target.value)))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-alina-600"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Largo (cm):</label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={customHeight}
                  onChange={(e) => setCustomHeight(Math.max(5, Number(e.target.value)))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-alina-600"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Grabado de Logotipo Personalizado (+ $0.20 ctv) */}
      {product.hasLogoOption && (
        <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <div className="font-display font-semibold text-xs text-slate-900 flex items-center gap-1.5">
              <span>¿Deseas grabar el logo de tu pastelería?</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Grabado láser permanente en cada base por solo <strong>+$0.20 ctvs</strong>
            </p>
          </div>
          <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-alina-600">
            <input
              type="checkbox"
              checked={withLogo}
              onChange={(e) => setWithLogo(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-alina-600 focus:ring-alina-500"
            />
            <span>Incluir Logo</span>
          </label>
        </div>
      )}

      {/* 5. Selector de Cantidad */}
      <div className="flex items-center gap-4">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Cantidad:</label>
        <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold"
          >
            -
          </button>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-14 text-center font-bold text-sm text-slate-900 border-none focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold"
          >
            +
          </button>
        </div>

        {/* Quick presets */}
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => setQuantity(12)}
            className={`px-2 py-1 rounded text-xs font-medium border ${
              quantity === 12
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            1 Docena
          </button>
          <button
            type="button"
            onClick={() => setQuantity(50)}
            className={`px-2 py-1 rounded text-xs font-medium border ${
              quantity === 50
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            50+ (Mayor)
          </button>
        </div>
      </div>

      {/* 6. Botones de Acción Neurálgicos */}
      <div className="flex flex-col gap-2.5 pt-2">
        {/* Botón Principal Carrito / Agregar (Alto Contraste) */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full bg-[#ff6600] hover:bg-[#ea580c] text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md text-sm active:scale-[0.99]"
        >
          <ShoppingBag className="size-4.5" />
          <span>Agregar al Carrito</span>
        </button>

        {/* Botón WhatsApp & Tarjeta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleWhatsAppBuy}
            className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-medium py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all text-xs"
          >
            <MessageCircle className="size-4 fill-current" />
            <span>Cotizar por WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={handleDirectBuy}
            className="bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all text-xs"
          >
            <CreditCard className="size-4" />
            <span>Pagar con Tarjeta</span>
          </button>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center text-[11px] text-slate-500 font-medium">
        <div className="flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Pagos Seguros Payphone</span>
        </div>
        <div className="flex items-center justify-center gap-1.5">
          <Truck className="w-3.5 h-3.5 text-alina-600 shrink-0" />
          <span>Envíos Servientrega / Laar</span>
        </div>
        <div className="flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>Garantía en Taller</span>
        </div>
      </div>
    </div>
  );
}
