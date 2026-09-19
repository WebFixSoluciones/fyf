import React from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import crypto from "crypto";
import { getCustomerSession } from "@/lib/customer-auth";
import { getAdminSession } from "@/lib/auth";
import { findOrderById, findOrderByOrderNumber } from "@/lib/orders-store";
import { formatCurrency } from "@/lib/utils";
import { PrintActionButtons } from "./print-action-buttons";
import { ShieldCheck, CheckCircle2, Clock, AlertTriangle, Truck, ExternalLink, ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderReceiptVoucherPage({ params }: PageProps) {
  const { id } = await params;

  // 1. Session verification (Customer or Admin)
  const [customerSession, adminSession] = await Promise.all([
    getCustomerSession(),
    getAdminSession(),
  ]);

  if (!customerSession && !adminSession) {
    redirect(`/login?redirect=/cuenta/pedidos/${encodeURIComponent(id)}/comprobante`);
  }

  // 2. Fetch order
  const order = findOrderById(id) || findOrderByOrderNumber(id);

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-sm space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h1 className="font-display font-bold text-xl text-slate-900">Comprobante no encontrado</h1>
          <p className="text-xs text-slate-500">
            El pedido solicitado ({id}) no existe o fue archivado.
          </p>
          <Link
            href="/cuenta/pedidos"
            className="inline-flex items-center gap-2 bg-slate-900 text-white text-xs font-semibold px-5 py-2.5 rounded-xl hover:bg-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a Mis Pedidos</span>
          </Link>
        </div>
      </div>
    );
  }

  // 3. Anti-IDOR Security Check
  const isAdmin = !!adminSession;
  const isOwner =
    customerSession &&
    ((order.customerId && order.customerId === customerSession.id) ||
      order.customerEmail.toLowerCase() === customerSession.email.toLowerCase() ||
      (order.customerPhone &&
        customerSession.phone &&
        order.customerPhone.replace(/\D/g, "") === customerSession.phone.replace(/\D/g, "")));

  if (!isAdmin && !isOwner) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-red-200 rounded-3xl p-8 text-center shadow-md space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h1 className="font-display font-bold text-xl text-slate-900">Acceso No Autorizado</h1>
          <p className="text-xs text-slate-600 leading-relaxed">
            Por seguridad de datos personales y conforme a la <strong>Ley Orgánica de Protección de Datos Personales (LOPDP) de Ecuador</strong>, solo el titular de la cuenta puede visualizar y descargar este comprobante.
          </p>
          <div className="pt-2">
            <Link
              href="/cuenta/pedidos"
              className="inline-flex items-center gap-2 bg-slate-900 text-white text-xs font-semibold px-5 py-2.5 rounded-xl hover:bg-black transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Ir a Mi Historial de Pedidos</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Generate SHA-256 Digital Authenticity Hash
  const hashPayload = `${order.orderNumber}|${order.customerEmail}|${order.total}|${order.createdAt}|ALINA_EC_SECRET_SALT`;
  const digitalSealHash = crypto.createHash("sha256").update(hashPayload).digest("hex").toUpperCase();
  const formattedSeal = `${digitalSealHash.slice(0, 8)}-${digitalSealHash.slice(8, 16)}-${digitalSealHash.slice(16, 24)}-${digitalSealHash.slice(24, 32)}`;

  // Formatted date in Ecuador timezone
  const orderDate = new Date(order.createdAt).toLocaleDateString("es-EC", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-slate-100/70 py-6 sm:py-10 px-4 sm:px-6 font-sans antialiased text-slate-800">
      <div className="max-w-4xl mx-auto">
        
        {/* Print / Action Buttons Bar */}
        <PrintActionButtons orderNumber={order.orderNumber} />

        {/* Printable Official Voucher Document */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 sm:p-10 space-y-8 print:border-none print:shadow-none print:p-0 print:rounded-none">
          
          {/* 1. Header: Empresa y Metadata del Documento */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-200 pb-8">
            
            {/* Empresa Datos */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo.jpg"
                  alt="Alina Shop Ecuador"
                  width={160}
                  height={55}
                  className="h-12 w-auto object-contain"
                  priority
                />
              </div>
              <div className="text-xs text-slate-500 space-y-0.5 leading-tight">
                <p className="font-bold text-slate-800 text-sm">ALINA SHOP TEXTIL & MODA S.A.S.</p>
                <p>Fabricación y Comercialización de Insumos de Repostería</p>
                <p><strong>R.U.C.:</strong> 1793201458001</p>
                <p><strong>Matriz:</strong> Av. América N31-45 y Mariana de Jesús, Quito - Ecuador</p>
                <p><strong>Contacto:</strong> +593 98 589 0956 · pedidos@alinashop.ec</p>
                <p className="text-[11px] text-slate-400 font-medium">Contribuyente Régimen RIMPE - Emprendedor</p>
              </div>
            </div>

            {/* Document Details Box */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 text-right w-full sm:w-auto min-w-[260px] space-y-2">
              <div className="text-[11px] uppercase tracking-wider font-extrabold text-alina-600">
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
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                  order.paymentStatus === "PAGADO"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-amber-50 text-amber-800 border-amber-200"
                }`}>
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

          {/* 2. Customer & Shipping Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5">
            {/* Datos del Cliente */}
            <div className="space-y-1 text-xs">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Datos del Cliente (Receptor)
              </h3>
              <p className="text-sm font-bold text-slate-900">{order.customerName}</p>
              <p>
                <span className="text-slate-500">Cédula / RUC: </span>
                <span className="font-mono font-medium text-slate-800">
                  {order.customerIdNumber || "Consumidor Final (9999999999999)"}
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

            {/* Datos de Entrega */}
            <div className="space-y-1 text-xs border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Destino de Entrega (Ecuador)
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
              <p>
                <span className="text-slate-500">Modalidad: </span>
                <span className="font-semibold text-alina-600">
                  {order.shippingMethod === "pichincha"
                    ? "Envío Local Pichincha / Quito ($3.50)"
                    : order.shippingMethod === "national"
                    ? "Envío Nacional Servientrega ($5.50)"
                    : "Retiro en Taller Alina Shop (Gratis)"}
                </span>
              </p>
            </div>
          </div>

          {/* 3. Items Detail Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Detalle de Insumos y Productos
            </h3>

            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/80 border-b border-slate-200 font-bold text-slate-700">
                    <th className="py-3 px-4 w-12 text-center">Cant.</th>
                    <th className="py-3 px-4">Descripción / Medida / Acabado</th>
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
                          {item.sizeLabel && <span>Medida: <strong>{item.sizeLabel}</strong></span>}
                          {item.shape && <span>· Forma: <strong>{item.shape}</strong></span>}
                          {item.color && <span>· Color: <strong>{item.color}</strong></span>}
                          {item.withLogo && (
                            <span className="text-pink-600 font-bold">· Grabado con Logotipo (+ $0.20)</span>
                          )}
                          {item.customDimensions && (
                            <span className="text-blue-600">· Dim: {item.customDimensions}</span>
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

          {/* 4. Totals & Payment Breakdown */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-t border-slate-200 pt-6">
            
            {/* Payment Method & Shipping Tracking Note */}
            <div className="space-y-3 w-full sm:max-w-sm">
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2 text-xs">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Método de Pago Seleccionado</span>
                </div>
                <p className="text-slate-600">
                  {order.paymentMethod === "payphone"
                    ? "Tarjeta de Crédito / Débito mediante Payphone Ecuador (Procesamiento Encriptado)"
                    : "Transferencia Bancaria Directa / Coordinación WhatsApp"}
                </p>
              </div>

              {order.trackingNumber ? (
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
                      <span>Consultar estado del paquete en tiempo real</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">Estado logístico:</span> Tu pedido se encuentra en preparación en taller. La guía de transporte Servientrega se notificará a tu WhatsApp y correo.
                </div>
              )}
            </div>

            {/* Financial Totals Table */}
            <div className="w-full sm:w-72 space-y-2 text-xs border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal Insumos:</span>
                <span className="font-semibold text-slate-900">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Costo de Envío:</span>
                <span className="font-semibold text-slate-900">
                  {order.shippingCost === 0 ? "GRATIS" : formatCurrency(order.shippingCost)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tarifa IVA (15%):</span>
                <span className="font-semibold text-slate-900">$0.00 (Incluido)</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between items-baseline">
                <span className="font-display font-black text-sm text-slate-900">TOTAL PAGADO:</span>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold mr-1">USD</span>
                  <span className="font-display font-black text-xl text-slate-900">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Cryptographic Security Seal & Legal Footer */}
          <div className="border-t border-slate-200 pt-6 space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 bg-slate-50/80 rounded-2xl p-4 border border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Sello Digital de Autenticidad (Integridad Criptográfica)</span>
                </div>
                <p className="font-mono text-[10px] text-slate-500 break-all">
                  SHA-256: {formattedSeal}
                </p>
              </div>

              <div className="text-right shrink-0 text-[10px] text-slate-500">
                <p>Emisión electrónica certificada</p>
                <p className="font-semibold text-slate-700">Alina Shop Ecuador · {new Date().getFullYear()}</p>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 text-center leading-relaxed">
              Este comprobante certifica la adquisición formal de bases para pastelería y artículos personalizados en Alina Shop Ecuador. Para soporte post-venta o cambios de pedido, contacte a nuestro WhatsApp oficial +593 98 589 0956 indicando el número de orden <strong>{order.orderNumber}</strong>.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
