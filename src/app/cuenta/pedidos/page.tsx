'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { formatCurrency } from "@/lib/utils";
import {
  ShoppingBag,
  Truck,
  RotateCcw,
  FileText,
  UserCheck,
  LogOut,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Printer,
  ExternalLink,
  PackageCheck
} from "lucide-react";

interface CustomerData {
  id: string;
  name: string;
  email: string;
  phone: string;
  idNumber?: string;
}

interface OrderItemData {
  productId?: string;
  name: string;
  sizeLabel?: string;
  shape?: string;
  color?: string;
  withLogo?: boolean;
  customDimensions?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface OrderData {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingCity: string;
  shippingProvince: string;
  shippingAddress: string;
  paymentMethod: string;
  paymentStatus: "PENDIENTE" | "PAGADO" | "CANCELADO";
  orderStatus: "PENDIENTE" | "PAGADO" | "EN_PREPARACION" | "ENVIADO" | "ENTREGADO";
  total: number;
  subtotal: number;
  items: OrderItemData[];
  trackingNumber?: string;
  courier?: string;
  createdAt: string;
}

export default function CustomerOrdersDashboard() {
  const router = useRouter();
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    async function loadCustomerData() {
      try {
        const res = await fetch("/api/customer/me");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.customer) {
            setCustomer(data.customer);
            setOrders(data.orders || []);
            return;
          }
        }
      } catch (err) {
        console.error("Error al cargar sesión de cliente:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadCustomerData();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/customer/logout", { method: "POST" });
      setCustomer(null);
      setOrders([]);
      router.push("/login");
    } catch (e) {
      console.error("Error during logout", e);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* Loading State */}
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-alina-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold text-slate-600">
              Verificando sesión y cargando tus pedidos seguros...
            </p>
          </div>
        ) : !customer ? (
          /* Unauthenticated State Prompt */
          <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 text-center shadow-sm space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-pink-50 text-alina-600 flex items-center justify-center mx-auto shadow-xs">
              <ShoppingBag className="w-8 h-8" />
            </div>
            
            <div className="space-y-1">
              <h1 className="font-display font-bold text-xl text-slate-900">
                Portal de Clientes Alina Shop
              </h1>
              <p className="text-xs text-slate-500 leading-relaxed">
                Inicia sesión en tu cuenta para ver el historial de compras, rastrear tus guías de Servientrega y descargar tus comprobantes de pago.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <Link
                href="/login?redirect=/cuenta/pedidos"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <span>Iniciar Sesión</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/registro"
                className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center transition-colors border border-slate-200"
              >
                ¿Aún no tienes cuenta? Regístrate aquí
              </Link>
            </div>

            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tus datos de compra están protegidos bajo la LOPDP de Ecuador</span>
            </div>
          </div>
        ) : (
          /* Authenticated Customer View */
          <div className="space-y-8">
            
            {/* Customer Profile Banner */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-alina-500 text-white font-display font-extrabold text-xl flex items-center justify-center shadow-md">
                  {customer.name ? customer.name.charAt(0).toUpperCase() : "C"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-extrabold text-xl text-slate-900">
                      Hola, {customer.name}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                      <UserCheck className="w-3 h-3 text-emerald-600" />
                      <span>Cliente Alina</span>
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 flex flex-wrap gap-x-3 gap-y-1 mt-1">
                    <span>{customer.email}</span>
                    <span>·</span>
                    <span>{customer.phone}</span>
                    {customer.idNumber && (
                      <>
                        <span>·</span>
                        <span>C.I./RUC: {customer.idNumber}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/catalogo"
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors shadow-2xs"
                >
                  Nuevo Pedido
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="border border-slate-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-slate-600 text-xs font-semibold px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="Cerrar sesión de cliente"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Cerrar Sesión</span>
                </button>
              </div>
            </div>

            {/* Section Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h2 className="font-display font-extrabold text-lg text-slate-900">
                  Tus Compras y Pedidos ({orders.length})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Descarga tus comprobantes oficiales de pago y rastrea cada paquete con Servientrega.
                </p>
              </div>
            </div>

            {/* Orders List / Empty State */}
            {orders.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4 shadow-xs">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto">
                  <PackageCheck className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-slate-900">
                    Aún no tienes pedidos registrados
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Cuando adquieras bases personalizadas, toppers o complementos en Alina Shop, podrás consultar aquí tus órdenes y comprobantes digitales en PDF.
                  </p>
                </div>
                <Link
                  href="/catalogo"
                  className="inline-flex items-center gap-2 bg-slate-900 hover:bg-black text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm"
                >
                  <span>Explorar Catálogo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => {
                  const orderDate = new Date(ord.createdAt).toLocaleDateString("es-EC", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  });

                  return (
                    <div
                      key={ord.id}
                      className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4 transition-all hover:border-slate-300"
                    >
                      {/* Order Head */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-base text-slate-900">
                            {ord.orderNumber}
                          </span>
                          <span className="text-xs text-slate-400">· {orderDate}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${
                            ord.paymentStatus === "PAGADO"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : "bg-amber-50 text-amber-800 border-amber-200"
                          }`}>
                            {ord.paymentStatus === "PAGADO" ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Pagado</span>
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3 text-amber-600" />
                                <span>Pago Pendiente</span>
                              </>
                            )}
                          </span>

                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                            {ord.orderStatus === "ENTREGADO"
                              ? "Entregado"
                              : ord.orderStatus === "ENVIADO"
                              ? "Enviado con Guía"
                              : "En Taller"}
                          </span>
                        </div>
                      </div>

                      {/* Order Items Preview */}
                      <div className="space-y-2">
                        {ord.items && ord.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs py-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                                {item.quantity}x
                              </span>
                              <span className="font-semibold text-slate-800">{item.name}</span>
                              <span className="text-slate-400 text-[11px]">
                                {item.sizeLabel && `(${item.sizeLabel})`}
                                {item.withLogo && <strong className="text-pink-600 ml-1">+Logo</strong>}
                              </span>
                            </div>
                            <span className="font-bold text-slate-800">
                              {formatCurrency(item.subtotal)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Footer: Logistics & Action Buttons */}
                      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                        <div className="space-y-0.5">
                          {ord.trackingNumber ? (
                            <div className="text-xs text-blue-700 flex items-center gap-1.5 font-medium">
                              <Truck className="w-3.5 h-3.5" />
                              <span>{ord.courier || "Servientrega"} · Guía: <strong className="font-mono">{ord.trackingNumber}</strong></span>
                            </div>
                          ) : (
                            <div className="text-xs text-slate-500 flex items-center gap-1">
                              <Truck className="w-3.5 h-3.5 text-slate-400" />
                              <span>Destino: {ord.shippingCity}, {ord.shippingProvince}</span>
                            </div>
                          )}
                          <div className="text-xs text-slate-400">
                            Total Pagado: <strong className="text-slate-900 text-sm font-extrabold">{formatCurrency(ord.total)}</strong>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            href={`/cuenta/pedidos/${ord.id}/comprobante`}
                            className="bg-slate-900 hover:bg-black text-white text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-2xs"
                          >
                            <FileText className="w-3.5 h-3.5 text-alina-300" />
                            <span>Ver / Bajar Comprobante</span>
                          </Link>

                          <Link
                            href={`/rastreo?orden=${encodeURIComponent(ord.orderNumber)}`}
                            className="border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                          >
                            <Truck className="w-3.5 h-3.5 text-slate-500" />
                            <span>Rastrear Envío</span>
                          </Link>

                          <Link
                            href="/catalogo"
                            className="border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1 transition-colors"
                            title="Volver a comprar insumos"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Repetir</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
