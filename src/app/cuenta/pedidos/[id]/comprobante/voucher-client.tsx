'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { PrintActionButtons } from "./print-action-buttons";
import { ShieldCheck, CheckCircle2, Clock, AlertTriangle, Truck, ExternalLink, ArrowLeft } from "lucide-react";
import type { StoredOrder } from "@/lib/orders-store";

export function VoucherClient() {
  const params = useParams<{ id: string }>();
  const id = params?.id || "FYF-2026-1001";
  const [order, setOrder] = useState<StoredOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/customer/me?orderId=${encodeURIComponent(String(id))}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.orders && Array.isArray(data.orders)) {
          const found = data.orders.find(
            (o: StoredOrder) => o.id === id || o.orderNumber === id
          );
          if (found) {
            setOrder(found);
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <p className="text-xs font-semibold text-slate-500">Cargando comprobante {id}...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h1 className="font-bold text-xl text-slate-900">Comprobante no encontrado</h1>
          <p className="text-xs text-slate-500">
            El pedido solicitado ({id}) no existe o requiere iniciar sesión con la cuenta titular.
          </p>
          <Link
            href="/cuenta/pedidos"
            className="inline-flex items-center gap-2 bg-black text-white text-xs font-semibold px-5 py-2.5 rounded-xl hover:bg-neutral-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a Mis Pedidos</span>
          </Link>
        </div>
      </div>
    );
  }

  const orderDate = new Date(order.createdAt).toLocaleDateString("es-EC", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedSeal = `FYF-${order.orderNumber}-EC-VERIFIED`;

  return (
    <div className="min-h-screen bg-slate-100/70 py-6 sm:py-10 px-4 sm:px-6 font-sans antialiased text-slate-800">
      <div className="max-w-4xl mx-auto">
        <PrintActionButtons orderNumber={order.orderNumber} />

        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 space-y-8 print:border-none print:shadow-none print:p-0 print:rounded-none">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-200 pb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo.jpg"
                  alt="FYF Uniformes Ecuador"
                  width={160}
                  height={55}
                  className="h-12 w-auto object-contain"
                  priority
                />
              </div>
              <div className="text-xs text-slate-500 space-y-0.5 leading-tight">
                <p className="font-bold text-slate-800 text-sm">FYF UNIFORMES &amp; SEGURIDAD INDUSTRIAL</p>
                <p>Fabricación y Comercialización de Ropa de Trabajo y EPP</p>
                <p><strong>Matriz:</strong> Quito - Ecuador</p>
                <p><strong>Contacto:</strong> +593 99 335 8701 · ventas@fyf.com.ec</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 text-right w-full sm:w-auto min-w-[260px] space-y-2">
              <div className="text-[11px] uppercase tracking-wider font-extrabold text-[#FF841D]">
                Comprobante de Venta Digital
              </div>
              <div className="font-mono font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
                {order.orderNumber}
              </div>
              <div className="text-xs text-slate-500">
                <span>Fecha: </span>
                <span className="font-medium text-slate-800">{orderDate}</span>
              </div>
              <div className="pt-2 flex justify-end">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                    order.paymentStatus === "PAGADO"
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : "bg-amber-50 text-amber-800 border-amber-200"
                  }`}
                >
                  {order.paymentStatus === "PAGADO" ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>PAGO CONFIRMADO</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>PAGO PENDIENTE</span>
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5">
            <div className="space-y-1 text-xs">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Datos del Cliente
              </h3>
              <p className="text-sm font-bold text-slate-900">{order.customerName}</p>
              <p>
                <span className="text-slate-500">Cédula / RUC: </span>
                <span className="font-mono font-medium text-slate-800">
                  {order.customerIdNumber || "Consumidor Final"}
                </span>
              </p>
              <p>
                <span className="text-slate-500">Teléfono: </span>
                <span className="font-medium text-slate-800">{order.customerPhone}</span>
              </p>
              <p>
                <span className="text-slate-500">Email: </span>
                <span className="font-medium text-slate-800">{order.customerEmail}</span>
              </p>
            </div>

            <div className="space-y-1 text-xs border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Destino de Entrega
              </h3>
              <p>
                <span className="text-slate-500">Provincia / Ciudad: </span>
                <span className="font-semibold text-slate-800">
                  {order.shippingProvince}, {order.shippingCity}
                </span>
              </p>
              <p>
                <span className="text-slate-500">Dirección: </span>
                <span className="font-medium text-slate-800">{order.shippingAddress}</span>
              </p>
              {order.shippingReference && (
                <p>
                  <span className="text-slate-500">Referencia: </span>
                  <span className="italic text-slate-600">{order.shippingReference}</span>
                </p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Detalle de Productos
            </h3>

            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/80 border-b border-slate-200 font-bold text-slate-700">
                    <th className="py-3 px-4 w-12 text-center">Cant.</th>
                    <th className="py-3 px-4">Descripción / Talla</th>
                    <th className="py-3 px-4 text-right w-24">P. Unitario</th>
                    <th className="py-3 px-4 text-right w-24">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 text-center font-bold text-slate-800">
                        {item.quantity}
                      </td>
                      <td className="py-3 px-4 space-y-0.5">
                        <div className="font-bold text-slate-900 text-[13px]">{item.name}</div>
                        <div className="text-[11px] text-slate-500 flex flex-wrap gap-x-2">
                          {item.sizeLabel && <span>Talla: <strong>{item.sizeLabel}</strong></span>}
                          {item.withLogo && (
                            <span className="text-[#FF841D] font-bold">· Con Bordado de Logotipo</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-slate-700">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900">
                        {formatCurrency(item.subtotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-t border-slate-200 pt-6">
            <div className="space-y-3 w-full sm:max-w-sm">
              {order.trackingNumber && (
                <div className="bg-blue-50 border border-blue-200/80 rounded-2xl p-4 space-y-1 text-xs">
                  <div className="font-bold text-blue-900 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-blue-600" />
                    <span>Rastreo de Envío</span>
                  </div>
                  <p className="text-blue-800">
                    Operador: <strong>{order.courier || "Servientrega"}</strong>
                  </p>
                  <p className="text-blue-800">
                    N° Guía: <strong className="font-mono">{order.trackingNumber}</strong>
                  </p>
                  <div className="pt-1 print:hidden">
                    <Link
                      href={`/rastreo?orden=${encodeURIComponent(order.orderNumber)}`}
                      className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-900 font-bold underline text-[11px]"
                    >
                      <span>Consultar estado del paquete</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="w-full sm:w-72 space-y-2 text-xs border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-slate-900">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Costo de Envío:</span>
                <span className="font-semibold text-slate-900">
                  {order.shippingCost === 0 ? "GRATIS" : formatCurrency(order.shippingCost)}
                </span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between items-baseline">
                <span className="font-black text-sm text-slate-900">TOTAL:</span>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold mr-1">USD</span>
                  <span className="font-black text-xl text-slate-900">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 bg-slate-50/80 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Sello Digital: {formattedSeal}</span>
              </div>
              <div className="text-right shrink-0 text-[10px] text-slate-500">
                <p className="font-semibold text-slate-700">FYF Uniformes Ecuador · {new Date().getFullYear()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
