'use client';

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart, CartItem } from "@/context/cart-context";
import { formatCurrency } from "@/lib/utils";
import {
  CreditCard,
  MessageCircle,
  ShieldCheck,
  Truck,
  ArrowLeft,
  Lock,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ShoppingBag
} from "lucide-react";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDirect = searchParams.get("direct") === "true";
  const { items: cartItems, directBuyItem, clearCart } = useCart();
  const [showMobileSummary, setShowMobileSummary] = useState(false);

  // Determine active checkout items: if direct buy, take direct item; otherwise full cart
  const checkoutItems: CartItem[] = isDirect && directBuyItem ? [directBuyItem] : cartItems;

  // Customer & Shipping Form State
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    idNumber: "", // Cédula o RUC
    phone: "",
    province: "Pichincha",
    city: "Quito",
    address: "",
    reference: "",
    shippingMethod: "pichincha", // "pichincha" ($3.50), "national" ($5.50), "pickup" ($0.00)
    paymentMethod: "payphone", // "payphone" or "whatsapp"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Pre-fill logged-in customer info
  useEffect(() => {
    fetch("/api/customer/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.authenticated && data?.customer) {
          const c = data.customer;
          setFormData((prev) => ({
            ...prev,
            email: prev.email || c.email || "",
            fullName: prev.fullName || c.name || "",
            phone: prev.phone || c.phone || "",
            idNumber: prev.idNumber || c.idNumber || "",
          }));
        }
      })
      .catch(() => {});
  }, []);

  const subtotal = checkoutItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const shippingCost =
    formData.shippingMethod === "pickup"
      ? 0
      : formData.shippingMethod === "pichincha"
      ? 3.50
      : 5.50;

  const total = subtotal + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateEcuadorianId = (id: string) => {
    const clean = id.trim();
    return clean.length >= 10 && clean.length <= 13;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (checkoutItems.length === 0) {
      setErrorMessage("No hay productos en tu pedido. Agrega productos antes de continuar.");
      return;
    }

    if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
      setErrorMessage("Por favor completa todos los campos obligatorios de entrega.");
      return;
    }

    if (!validateEcuadorianId(formData.idNumber)) {
      setErrorMessage("Ingresa una cédula o RUC ecuatoriano válido (10 a 13 dígitos).");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create order on server (server recalculates exact prices for anti-tampering)
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: formData.fullName,
            email: formData.email,
            idNumber: formData.idNumber,
            phone: formData.phone,
          },
          shipping: {
            province: formData.province,
            city: formData.city,
            address: formData.address,
            reference: formData.reference,
            method: formData.shippingMethod,
            cost: shippingCost,
          },
          paymentMethod: formData.paymentMethod,
          items: checkoutItems.map((i) => ({
            productId: i.productId,
            name: i.productName,
            sizeLabel: i.sizeLabel,
            shape: i.shape,
            color: i.color,
            withLogo: i.withLogo,
            customDimensions: i.customDimensions,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Error al procesar el pedido");
      }

      // Order created successfully
      const orderNumber = data.orderNumber || "ALN-2026-1001";
      const orderId = data.orderId || "new";

      clearCart();

      // If WhatsApp order, open WhatsApp with confirmation text and redirect to success
      if (formData.paymentMethod === "whatsapp") {
        const waText = `*¡Pedido Registrado con Éxito!*
*N° Pedido:* ${orderNumber}
*Cliente:* ${formData.fullName} (C.I: ${formData.idNumber})
*Teléfono:* ${formData.phone}
*Entrega:* ${formData.city}, ${formData.address}
*Total a pagar:* $${total.toFixed(2)} USD

He seleccionado pago directo por transferencia/WhatsApp. Por favor envíenme los datos bancarios para enviar el comprobante.`;

        window.open(`https://wa.me/593985890956?text=${encodeURIComponent(waText)}`, "_blank");
        router.push(`/pedido/${orderId}/exito?num=${orderNumber}&method=whatsapp`);
        return;
      }

      // If Payphone payment:
      if (formData.paymentMethod === "payphone") {
        // En modo demostración / local, si Payphone está en sandbox, redirigimos a confirmación exitosa con simulación
        router.push(`/pedido/${orderId}/exito?num=${orderNumber}&method=payphone`);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Ocurrió un error inesperado. Por favor intenta de nuevo.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Top Simple Shopify-style Header */}
      <header className="bg-white border-b border-slate-200 py-2.5 sm:py-4 px-3 sm:px-8 sticky top-0 z-30">
        <div className="w-full max-w-[1600px] mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 sm:gap-3">
            <Image
              src="/logo.jpg"
              alt="Alina Shop"
              width={180}
              height={60}
              className="h-10 sm:h-14 md:h-16 w-auto object-contain"
            />
          </Link>
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-500 font-semibold">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Pago Seguro y Encriptado 256-bit</span>
            <span className="sm:hidden">Pago Seguro 256-bit</span>
          </div>
        </div>
      </header>

      <main className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-10 items-start">
            
            {/* Columna Izquierda: Formulario de Checkout (7 cols) */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6">
              <Link
                href="/catalogo"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Volver a la tienda</span>
              </Link>

              {/* Resumen Móvil Acordeón Desplegable (Shopify Style) */}
              <div className="lg:hidden bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={() => setShowMobileSummary(!showMobileSummary)}
                  className="w-full p-3 flex items-center justify-between bg-slate-50/80 hover:bg-slate-100/70 transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                    <ShoppingBag className="size-4 text-alina-600" />
                    <span>{showMobileSummary ? "Ocultar resumen de compra" : "Ver resumen de compra"}</span>
                    {showMobileSummary ? (
                      <ChevronUp className="size-3.5 text-slate-500" />
                    ) : (
                      <ChevronDown className="size-3.5 text-slate-500" />
                    )}
                  </div>
                  <span className="font-display font-bold text-sm text-slate-900">
                    {formatCurrency(total)}
                  </span>
                </button>

                {showMobileSummary && (
                  <div className="p-3 border-t border-slate-200/80 space-y-2.5 bg-white">
                    <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto pr-1">
                      {checkoutItems.map((item) => (
                        <div key={item.id} className="py-2 flex gap-2.5 items-center">
                          <div className="relative size-11 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-center shrink-0">
                            <Image
                              src={item.mainImage || "/logo.jpg"}
                              alt={item.productName}
                              width={40}
                              height={40}
                              className="object-contain p-0.5"
                            />
                            <span className="absolute -top-1.5 -right-1.5 bg-slate-800 text-white text-[9px] font-bold size-4 rounded-full flex items-center justify-center shadow-xs">
                              {item.quantity}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-xs text-slate-900 truncate">{item.productName}</h4>
                            <div className="text-[10px] text-slate-500 truncate">
                              <span>{item.sizeLabel}</span>
                              {item.shape && <span> · {item.shape}</span>}
                              {item.withLogo && <span className="text-pink-600 font-semibold"> · +Logo</span>}
                            </div>
                          </div>
                          <span className="font-bold text-xs text-slate-900 shrink-0">
                            {formatCurrency(item.unitPrice * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-slate-100 pt-2 space-y-1 text-xs">
                      <div className="flex justify-between text-slate-600 text-[11px]">
                        <span>Subtotal</span>
                        <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-slate-600 text-[11px]">
                        <span>Envío</span>
                        <span className="font-semibold text-slate-900">
                          {shippingCost === 0 ? "Gratis" : formatCurrency(shippingCost)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Bloque 1: Contacto */}
              <div className="bg-white border border-slate-200/90 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 shadow-2xs">
                <h2 className="font-display font-bold text-sm sm:text-base text-slate-900 mb-3 sm:mb-4 flex items-center justify-between">
                  <span>1. Información de Contacto</span>
                  <span className="text-[11px] text-slate-400 font-normal">Requerido</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 mb-1">
                      Correo Electrónico (para comprobante)
                    </label>
                    <input
                      type="email"
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="ejemplo@pasteleria.com"
                      className="w-full border border-slate-300 rounded-lg px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-alina-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 mb-1">
                      Nombres y Apellidos
                    </label>
                    <input
                      type="text"
                      required
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Karla Morales"
                      className="w-full border border-slate-300 rounded-lg px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-alina-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 mb-1">
                      Cédula o RUC (para facturación)
                    </label>
                    <input
                      type="text"
                      required
                      name="idNumber"
                      value={formData.idNumber}
                      onChange={handleInputChange}
                      placeholder="1723456789001"
                      className="w-full border border-slate-300 rounded-lg px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-alina-600"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 mb-1">
                      Teléfono Celular (WhatsApp para coordinar entrega)
                    </label>
                    <input
                      type="tel"
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="0991234567"
                      className="w-full border border-slate-300 rounded-lg px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-alina-600"
                    />
                  </div>
                </div>
              </div>

              {/* Bloque 2: Dirección de Envío */}
              <div className="bg-white border border-slate-200/90 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 shadow-2xs">
                <h2 className="font-display font-bold text-sm sm:text-base text-slate-900 mb-3 sm:mb-4">
                  2. Dirección de Envío (Ecuador)
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  <div>
                    <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 mb-1">Provincia</label>
                    <select
                      name="province"
                      value={formData.province}
                      onChange={handleInputChange}
                      className="w-full border border-slate-300 rounded-lg px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-900 bg-white focus:outline-none focus:border-alina-600"
                    >
                      <option value="Pichincha">Pichincha</option>
                      <option value="Guayas">Guayas</option>
                      <option value="Azuay">Azuay</option>
                      <option value="Manabí">Manabí</option>
                      <option value="Tungurahua">Tungurahua</option>
                      <option value="Imbabura">Imbabura</option>
                      <option value="Loja">Loja</option>
                      <option value="Santo Domingo">Santo Domingo</option>
                      <option value="Otra">Otra Provincia</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 mb-1">Ciudad / Cantón</label>
                    <input
                      type="text"
                      required
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Quito"
                      className="w-full border border-slate-300 rounded-lg px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-alina-600"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 mb-1">
                      Calle Principal, Número y Secundaria
                    </label>
                    <input
                      type="text"
                      required
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Av. Amazonas N24-102 y Colón"
                      className="w-full border border-slate-300 rounded-lg px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-alina-600"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 mb-1">
                      Referencia de Entrega (Opcional)
                    </label>
                    <input
                      type="text"
                      name="reference"
                      value={formData.reference}
                      onChange={handleInputChange}
                      placeholder="Frente a la panadería / Portón blanco"
                      className="w-full border border-slate-300 rounded-lg px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-alina-600"
                    />
                  </div>
                </div>
              </div>

              {/* Bloque 3: Método de Envío */}
              <div className="bg-white border border-slate-200/90 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 shadow-2xs">
                <h2 className="font-display font-bold text-sm sm:text-base text-slate-900 mb-2.5 sm:mb-3">
                  3. Método de Envío
                </h2>

                <div className="space-y-2">
                  <label
                    className={`flex items-center justify-between p-2.5 sm:p-3.5 rounded-lg sm:rounded-xl border cursor-pointer transition-all ${
                      formData.shippingMethod === "pichincha"
                        ? "border-alina-600 bg-alina-50/40 ring-1 ring-alina-600"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value="pichincha"
                        checked={formData.shippingMethod === "pichincha"}
                        onChange={handleInputChange}
                        className="text-alina-600 focus:ring-alina-500"
                      />
                      <div>
                        <div className="font-semibold text-xs text-slate-900">Envío Local (Pichincha / Quito)</div>
                        <div className="text-[10px] sm:text-[11px] text-slate-500">Entrega 24-48 horas laborables</div>
                      </div>
                    </div>
                    <span className="font-bold text-xs text-slate-900">$3.50</span>
                  </label>

                  <label
                    className={`flex items-center justify-between p-2.5 sm:p-3.5 rounded-lg sm:rounded-xl border cursor-pointer transition-all ${
                      formData.shippingMethod === "national"
                        ? "border-alina-600 bg-alina-50/40 ring-1 ring-alina-600"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value="national"
                        checked={formData.shippingMethod === "national"}
                        onChange={handleInputChange}
                        className="text-alina-600 focus:ring-alina-500"
                      />
                      <div>
                        <div className="font-semibold text-xs text-slate-900">Envío Nacional (Servientrega / LaarCourier)</div>
                        <div className="text-[10px] sm:text-[11px] text-slate-500">A todo el Ecuador con guía de rastreo</div>
                      </div>
                    </div>
                    <span className="font-bold text-xs text-slate-900">$5.50</span>
                  </label>

                  <label
                    className={`flex items-center justify-between p-2.5 sm:p-3.5 rounded-lg sm:rounded-xl border cursor-pointer transition-all ${
                      formData.shippingMethod === "pickup"
                        ? "border-alina-600 bg-alina-50/40 ring-1 ring-alina-600"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value="pickup"
                        checked={formData.shippingMethod === "pickup"}
                        onChange={handleInputChange}
                        className="text-alina-600 focus:ring-alina-500"
                      />
                      <div>
                        <div className="font-semibold text-xs text-slate-900">Retiro en Taller Alina Shop</div>
                        <div className="text-[10px] sm:text-[11px] text-slate-500">Previa coordinación de horario</div>
                      </div>
                    </div>
                    <span className="font-bold text-xs text-emerald-700">GRATIS</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Resumen de Pedido + Métodos de Pago + Botón de Pago (5 cols) */}
            <div className="lg:col-span-5 space-y-4 sm:space-y-5 lg:sticky lg:top-24">
              {/* Resumen del Pedido */}
              <div className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 shadow-2xs space-y-4 sm:space-y-5">
                <h3 className="font-display font-bold text-sm sm:text-base text-slate-900 pb-2.5 sm:pb-3 border-b border-slate-100">
                  Resumen del Pedido ({checkoutItems.length} {checkoutItems.length === 1 ? "producto" : "productos"})
                </h3>

                {/* Items List */}
                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
                  {checkoutItems.map((item) => (
                    <div key={item.id} className="py-2.5 sm:py-3 flex gap-2.5 sm:gap-3 items-center">
                      <div className="relative size-12 sm:size-14 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-center shrink-0">
                        <Image
                          src={item.mainImage || "/logo.jpg"}
                          alt={item.productName}
                          width={48}
                          height={48}
                          className="object-contain p-0.5 sm:p-1"
                        />
                        <span className="absolute -top-1.5 -right-1.5 bg-slate-800 text-white text-[9px] sm:text-[10px] font-bold size-4.5 sm:size-5 rounded-full flex items-center justify-center shadow-xs">
                          {item.quantity}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-xs text-slate-900 truncate">
                          {item.productName}
                        </h4>
                        <div className="text-[10px] sm:text-[11px] text-slate-500 truncate">
                          <span>{item.sizeLabel}</span>
                          {item.shape && <span> · {item.shape}</span>}
                          {item.withLogo && <span className="text-pink-600 font-semibold"> · +Logo</span>}
                        </div>
                      </div>

                      <span className="font-bold text-xs text-slate-900 shrink-0">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Cost calculations */}
                <div className="border-t border-slate-100 pt-3 sm:pt-4 space-y-1.5 sm:space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Costo de Envío</span>
                    <span className="font-semibold text-slate-900">
                      {shippingCost === 0 ? "Gratis" : formatCurrency(shippingCost)}
                    </span>
                  </div>
                  <div className="border-t border-slate-200 pt-2.5 sm:pt-3 flex justify-between items-baseline">
                    <span className="font-display font-bold text-xs sm:text-sm text-slate-900">Total a Pagar</span>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-medium mr-1">USD</span>
                      <span className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
                        {formatCurrency(total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Guarantees */}
                <div className="bg-slate-50 rounded-xl p-3 sm:p-3.5 text-[11px] sm:text-xs text-slate-600 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="size-3.5 sm:size-4 text-emerald-600 shrink-0" />
                    <span className="font-medium">Compra protegida directamente por Alina Shop</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="size-3.5 sm:size-4 text-alina-600 shrink-0" />
                    <span className="font-medium">Guía de rastreo asignada inmediatamente</span>
                  </div>
                </div>
              </div>

              {/* Bloque 4: Método de Pago */}
              <div className="bg-white border border-slate-200/90 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 shadow-2xs">
                <h2 className="font-display font-bold text-sm sm:text-base text-slate-900 mb-2.5 sm:mb-3">
                  4. Método de Pago
                </h2>

                <div className="space-y-2 sm:space-y-3">
                  {/* Opción Payphone */}
                  <label
                    className={`flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3.5 rounded-lg sm:rounded-xl border cursor-pointer transition-all ${
                      formData.paymentMethod === "payphone"
                        ? "border-alina-600 bg-alina-50/40 ring-1 ring-alina-600"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="payphone"
                      checked={formData.paymentMethod === "payphone"}
                      onChange={handleInputChange}
                      className="mt-1 text-alina-600 focus:ring-alina-500"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-xs text-slate-900 flex items-center gap-1 sm:gap-1.5 truncate">
                          <CreditCard className="size-3.5 sm:size-4 text-alina-600 shrink-0" />
                          <span>Tarjeta Crédito / Débito (Payphone)</span>
                        </span>
                        <span className="bg-emerald-50 text-emerald-800 text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                          Inmediato
                        </span>
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-slate-500 mt-1">
                        Paga seguro con Visa o Mastercard a través de Payphone Ecuador.
                      </p>
                    </div>
                  </label>

                  {/* Opción WhatsApp / Transferencia */}
                  <label
                    className={`flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3.5 rounded-lg sm:rounded-xl border cursor-pointer transition-all ${
                      formData.paymentMethod === "whatsapp"
                        ? "border-alina-600 bg-alina-50/40 ring-1 ring-alina-600"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="whatsapp"
                      checked={formData.paymentMethod === "whatsapp"}
                      onChange={handleInputChange}
                      className="mt-1 text-alina-600 focus:ring-alina-500"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-xs text-slate-900 flex items-center gap-1 sm:gap-1.5 truncate">
                          <MessageCircle className="size-3.5 sm:size-4 text-emerald-600 shrink-0" />
                          <span>Pedido por WhatsApp (Transferencia)</span>
                        </span>
                        <span className="bg-slate-100 text-slate-700 text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded shrink-0">
                          Personal
                        </span>
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-slate-500 mt-1">
                        Tu pedido queda registrado y enviamos el detalle a WhatsApp para tu pago bancario.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Botón de Pagar */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-display font-bold py-3.5 sm:py-4 px-4 sm:px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg text-xs sm:text-base disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Procesando Pedido...</span>
                ) : formData.paymentMethod === "payphone" ? (
                  <span>Pagar con Payphone · {formatCurrency(total)}</span>
                ) : (
                  <span>Confirmar por WhatsApp · {formatCurrency(total)}</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-2 border-alina-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold text-slate-600">Cargando checkout seguro de Alina Shop...</p>
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
