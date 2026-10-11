'use client';

import React from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { CheckCircle2, MessageCircle, Truck } from "lucide-react";

export function OrderSuccessClient() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const id = params?.id || "new";
  const num = searchParams.get("num");
  const method = searchParams.get("method");
  const orderNumber = num || `FYF-2026-${String(id).slice(-4)}`;

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 text-center">
        {/* Success Icon */}
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          ¡Pedido Registrado con Éxito!
        </span>

        <h1 className="font-bold text-2xl text-slate-900 mt-3">
          ¡Gracias por tu compra en FYF Uniformes!
        </h1>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 my-6 text-left">
          <div className="text-xs text-slate-500">Número de Orden Oficial:</div>
          <div className="font-extrabold text-xl text-[#FF841D] font-mono mt-0.5">
            {orderNumber}
          </div>
          <div className="text-xs text-slate-500 mt-2">
            Método seleccionado:{" "}
            <strong className="text-slate-800">
              {method === "whatsapp" ? "Pedido por WhatsApp (Transferencia)" : "Tarjeta con Payphone"}
            </strong>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed mb-6">
          Hemos recibido los detalles de tu pedido. Nuestro equipo comenzará la preparación de tus uniformes y equipos de seguridad. En cuanto se asigne la guía de envío por Servientrega o LaarCourier, te notificaremos directamente.
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <a
            href={`https://wa.me/593993358701?text=Hola%20FYF%20Uniformes,%20acabo%20de%20realizar%20el%20pedido%20*${orderNumber}*%20en%20la%20tienda%20virtual.`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Consultar Estado por WhatsApp</span>
          </a>

          <Link
            href="/rastreo"
            className="w-full bg-black hover:bg-neutral-800 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm transition-all"
          >
            <Truck className="w-4 h-4" />
            <span>Rastrear este Pedido</span>
          </Link>

          <Link
            href="/catalogo"
            className="block text-xs font-semibold text-slate-500 hover:text-slate-800 pt-2"
          >
            Seguir comprando en la tienda
          </Link>
        </div>
      </div>
    </div>
  );
}
