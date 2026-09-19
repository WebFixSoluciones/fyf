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
      const orderNumber = data.orderNumber || "FYF-2026-1001";
      const orderId = data.orderId || "new";

      clearCart();

      // If WhatsApp order, open WhatsApp with confirmation text and redirect to success
      if (formData.paymentMethod === "whatsapp") {
        const waText = `*¡Pedido Registrado con Éxito en FYF Uniformes!*
*N° Pedido:* ${orderNumber}
*Cliente:* ${formData.fullName} (C.I: ${formData.idNumber})
*Teléfono:* ${formData.phone}
*Entrega:* ${formData.city}, ${formData.address}
*Total a pagar:* $${total.toFixed(2)} USD

He seleccionado pago por transferencia/WhatsApp. Por favor envíenme los datos bancarios para enviar el comprobante.`;

        window.open(`https://wa.me/593993358701?text=${encodeURIComponent(waText)}`, "_blank");
        router.push(`/pedido/${orderId}/exito?num=${orderNumber}&method=whatsapp`);
        return;
      }

      // If Payphone payment:
      if (formData.paymentMethod === "payphone") {
        router.push(`/pedido/${orderId}/exito?num=${orderNumber}&method=payphone`);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Ocurrió un error inesperado. Por favor intenta de nuevo.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Encabezado Simple y Limpio */}
      <header className="bg-white border-b border-slate-200/80 py-3.5 px-4 sm:px-8 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.jpg"
              alt="FYF Uniformes"
              width={160}
              height={50}
              className="h-9 sm:h-12 w-auto object-contain"
              priority
            />
          </Link>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Lock className="size-4 text-emerald-600 shrink-0" />
            <span className="hidden sm:inline">Checkout Seguro · Encriptado 256-bit</span>
            <span className="sm:hidden">Pago Seguro</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Columna Izquierda: Formulario Continuo y Limpio (7 columnas) */}
            <div className="lg:col-span-7 space-y-7">
              <Link
                href="/catalogo"
                className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-black transition-colors"
              >
                <ArrowLeft className="size-3.5" />
                <span>Volver a la tienda</span>
              </Link>

              {/* Resumen Móvil Desplegable (visible solo en smartphone/tablet) */}
              <div className="lg:hidden border border-slate-200 rounded-xl overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => setShowMobileSummary(!showMobileSummary)}
                  className="w-full p-4 flex items-center justify-between bg-slate-50/70 hover:bg-slate-100/70 transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                    <ShoppingBag className="size-4 text-[#FF841D]" />
                    <span>{showMobileSummary ? "Ocultar resumen del pedido" : "Ver resumen del pedido"}</span>
                    {showMobileSummary ? (
                      <ChevronUp className="size-3.5 text-slate-500" />
                    ) : (
                      <ChevronDown className="size-3.5 text-slate-500" />
                    )}
                  </div>
                  <span className="font-bold text-sm text-slate-950">
                    {formatCurrency(total)}
                  </span>
                </button>

                {showMobileSummary && (
                  <div className="p-4 border-t border-slate-200 space-y-3 bg-white">
                    <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto pr-1">
                      {checkoutItems.map((item) => (
                        <div key={item.id} className="py-2.5 flex gap-3 items-center">
                          <div className="relative size-12 bg-slate-50 rounded-lg border border-slate-200/80 flex items-center justify-center shrink-0">
                            <Image
                              src={item.mainImage || "/logo.jpg"}
                              alt={item.productName}
                              width={44}
                              height={44}
                              className="object-contain p-0.5"
                            />
                            <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[10px] font-bold size-4.5 rounded-full flex items-center justify-center">
                              {item.quantity}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-xs text-slate-900 truncate">{item.productName}</h4>
                            <div className="text-[11px] text-slate-500 truncate">
                              <span>Talla: {item.sizeLabel}</span>
                              {item.shape && <span> · {item.shape}</span>}
                              {item.withLogo && <span className="text-[#FF841D] font-medium"> · +Personalizado</span>}
                            </div>
                          </div>
                          <span className="font-semibold text-xs text-slate-950 shrink-0">
                            {formatCurrency(item.unitPrice * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-slate-100 pt-3 space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-600">
                        <span>Subtotal</span>
                        <span className="font-medium text-slate-900">{formatCurrency(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Envío</span>
                        <span className="font-medium text-slate-900">
                          {shippingCost === 0 ? "Gratis" : formatCurrency(shippingCost)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs sm:text-sm flex items-center gap-2.5">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 1. Información de Contacto */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                    1. Información de Contacto
                  </h2>
                  <span className="text-xs text-slate-400 font-normal">Requerido</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Correo Electrónico (para comprobante y factura)
                    </label>
                    <input
                      type="email"
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="tu-correo@empresa.com"
                      className="w-full h-12 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-black placeholder:text-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Nombres y Apellidos
                    </label>
                    <input
                      type="text"
                      required
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Ej. Juan Pérez"
                      className="w-full h-12 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-black placeholder:text-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Cédula o RUC (para facturación)
                    </label>
                    <input
                      type="text"
                      required
                      name="idNumber"
                      value={formData.idNumber}
                      onChange={handleInputChange}
                      placeholder="1723456789 o 1790012345001"
                      className="w-full h-12 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-black placeholder:text-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Teléfono Celular (WhatsApp para coordinar entrega)
                    </label>
                    <input
                      type="tel"
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="0991234567"
                      className="w-full h-12 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-black placeholder:text-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Divisor limpio entre secciones */}
              <div className="border-t border-slate-200/80 pt-6" />

              {/* 2. Dirección de Entrega */}
              <div className="space-y-3.5">
                <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                  2. Dirección de Entrega (Ecuador)
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">Provincia</label>
                    <select
                      name="province"
                      value={formData.province}
                      onChange={handleInputChange}
                      className="w-full h-12 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all cursor-pointer"
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

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">Ciudad / Cantón</label>
                    <input
                      type="text"
                      required
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Quito"
                      className="w-full h-12 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-black placeholder:text-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Calle Principal, Número y Secundaria
                    </label>
                    <input
                      type="text"
                      required
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Av. Amazonas N24-102 y Colón"
                      className="w-full h-12 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-black placeholder:text-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Referencia de Entrega (Opcional)
                    </label>
                    <input
                      type="text"
                      name="reference"
                      value={formData.reference}
                      onChange={handleInputChange}
                      placeholder="Ej. Frente al parque / Edificio azul, timbre 2B"
                      className="w-full h-12 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-black placeholder:text-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Divisor limpio entre secciones */}
              <div className="border-t border-slate-200/80 pt-6" />

              {/* 3. Método de Envío (Contenedor agrupado de 1px sin tarjetas sueltas) */}
              <div className="space-y-3.5">
                <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                  3. Método de Envío
                </h2>

                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 bg-white">
                  <label
                    className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${
                      formData.shippingMethod === "pichincha" ? "bg-slate-50/80" : "hover:bg-slate-50/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value="pichincha"
                        checked={formData.shippingMethod === "pichincha"}
                        onChange={handleInputChange}
                        className="size-4 text-black accent-black cursor-pointer"
                      />
                      <div>
                        <div className="font-semibold text-sm text-slate-900">Envío Local (Pichincha / Quito)</div>
                        <div className="text-xs text-slate-500 mt-0.5">Entrega 24-48 horas laborables</div>
                      </div>
                    </div>
                    <span className="font-bold text-sm text-slate-900">$3.50</span>
                  </label>

                  <label
                    className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${
                      formData.shippingMethod === "national" ? "bg-slate-50/80" : "hover:bg-slate-50/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value="national"
                        checked={formData.shippingMethod === "national"}
                        onChange={handleInputChange}
                        className="size-4 text-black accent-black cursor-pointer"
                      />
                      <div>
                        <div className="font-semibold text-sm text-slate-900">Envío Nacional (Servientrega / LaarCourier)</div>
                        <div className="text-xs text-slate-500 mt-0.5">A todo el Ecuador con guía de rastreo</div>
                      </div>
                    </div>
                    <span className="font-bold text-sm text-slate-900">$5.50</span>
                  </label>

                  <label
                    className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${
                      formData.shippingMethod === "pickup" ? "bg-slate-50/80" : "hover:bg-slate-50/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value="pickup"
                        checked={formData.shippingMethod === "pickup"}
                        onChange={handleInputChange}
                        className="size-4 text-black accent-black cursor-pointer"
                      />
                      <div>
                        <div className="font-semibold text-sm text-slate-900">Retiro en Planta FYF Uniformes</div>
                        <div className="text-xs text-slate-500 mt-0.5">Parque Urb. Matovelle, Quito</div>
                      </div>
                    </div>
                    <span className="font-bold text-sm text-emerald-700">GRATIS</span>
                  </label>
                </div>
              </div>

            </div>

            {/* Columna Derecha: Panel Unificado de Resumen y Pago (5 columnas) */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
              <div className="border border-slate-200 rounded-2xl bg-slate-50/40 p-5 sm:p-6 space-y-6">
                
                {/* Header del Resumen */}
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-3.5">
                  <h2 className="font-semibold text-xs uppercase text-slate-500 flex items-center gap-2">
                    <ShoppingBag className="size-4 text-[#FF841D]" />
                    <span>Resumen del Pedido</span>
                  </h2>
                  <span className="text-xs text-slate-500 font-medium">
                    {checkoutItems.length} {checkoutItems.length === 1 ? "artículo" : "artículos"}
                  </span>
                </div>

                {/* Lista de productos */}
                <div className="divide-y divide-slate-200/70 max-h-72 overflow-y-auto pr-1">
                  {checkoutItems.map((item) => (
                    <div key={item.id} className="py-3 flex gap-3.5 items-center">
                      <div className="relative size-14 bg-white rounded-xl border border-slate-200/80 flex items-center justify-center shrink-0">
                        <Image
                          src={item.mainImage || "/logo.jpg"}
                          alt={item.productName}
                          width={48}
                          height={48}
                          className="object-contain p-1"
                        />
                        <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[11px] font-bold size-5 rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-slate-900 truncate">{item.productName}</h4>
                        <div className="text-xs text-slate-500 truncate mt-0.5">
                          <span>Talla: {item.sizeLabel}</span>
                          {item.shape && <span> · {item.shape}</span>}
                          {item.withLogo && <span className="text-[#FF841D] font-medium"> · +Personalizado</span>}
                        </div>
                      </div>
                      <span className="font-bold text-sm text-slate-950 shrink-0">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Subtotal, Envío y Total */}
                <div className="border-t border-slate-200/80 pt-4 space-y-2.5 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-slate-900">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Envío</span>
                    <span className="font-medium text-slate-900">
                      {shippingCost === 0 ? "Gratis" : formatCurrency(shippingCost)}
                    </span>
                  </div>
                  <div className="border-t border-slate-200 pt-3.5 flex justify-between items-baseline">
                    <span className="text-base font-bold text-slate-900">Total a Pagar</span>
                    <span className="text-2xl font-bold text-slate-950">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>

                {/* Método de Pago integrado sin caja flotante */}
                <div className="border-t border-slate-200/80 pt-4 space-y-2.5">
                  <label className="block text-xs font-semibold uppercase text-slate-500">
                    Método de Pago
                  </label>
                  <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 bg-white">
                    {/* Opción Payphone */}
                    <label
                      className={`flex items-start gap-3 p-3.5 cursor-pointer transition-colors ${
                        formData.paymentMethod === "payphone" ? "bg-slate-50/80" : "hover:bg-slate-50/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="payphone"
                        checked={formData.paymentMethod === "payphone"}
                        onChange={handleInputChange}
                        className="mt-1 size-4 text-black accent-black cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-semibold text-sm text-slate-900 flex items-center gap-1.5 truncate">
                            <CreditCard className="size-4 text-slate-700 shrink-0" />
                            <span>Tarjeta Crédito / Débito (Payphone)</span>
                          </span>
                          <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                            Inmediato
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Visa o Mastercard a través de Payphone Ecuador.
                        </p>
                      </div>
                    </label>

                    {/* Opción WhatsApp / Transferencia */}
                    <label
                      className={`flex items-start gap-3 p-3.5 cursor-pointer transition-colors ${
                        formData.paymentMethod === "whatsapp" ? "bg-slate-50/80" : "hover:bg-slate-50/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="whatsapp"
                        checked={formData.paymentMethod === "whatsapp"}
                        onChange={handleInputChange}
                        className="mt-1 size-4 text-black accent-black cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-semibold text-sm text-slate-900 flex items-center gap-1.5 truncate">
                            <MessageCircle className="size-4 text-emerald-600 shrink-0" />
                            <span>Pedido por WhatsApp (Transferencia)</span>
                          </span>
                          <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded shrink-0">
                            Personal
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Coordinación y datos bancarios directos por WhatsApp.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Botón Principal de Pago */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 sm:h-13 bg-black hover:bg-neutral-900 text-white font-semibold rounded-xl flex items-center justify-center gap-2 text-sm sm:text-base transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Procesando Pedido...</span>
                  ) : formData.paymentMethod === "payphone" ? (
                    <span>Pagar con Payphone · {formatCurrency(total)}</span>
                  ) : (
                    <span>Confirmar por WhatsApp · {formatCurrency(total)}</span>
                  )}
                </button>

                {/* Garantías y Confianza */}
                <div className="border-t border-slate-200/80 pt-4 space-y-2 text-xs text-slate-500 font-medium">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
                    <span>Compra protegida directamente por FYF Uniformes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="size-4 text-[#FF841D] shrink-0" />
                    <span>Guía de rastreo asignada tras despacho</span>
                  </div>
                </div>

              </div>
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
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-2 border-[#FF841D] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold text-slate-600">Cargando checkout seguro de FYF Uniformes...</p>
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
