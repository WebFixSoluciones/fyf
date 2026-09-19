'use client';

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle, ShieldCheck, Truck, Sparkles, ShoppingBag } from "lucide-react";

export function BottomCtaBanner() {
  return (
    <section className="w-full py-12">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-950 via-slate-900 to-[#3b0b20] text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-slate-800">
        {/* Glow ambient effects */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-alina-600/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid lg:grid-cols-12 gap-10 items-center">
          {/* Left copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-pink-300 backdrop-blur-md">
              <Sparkles className="size-3.5 text-pink-400" aria-hidden="true" />
              <span>Tienda Virtual Oficial · Alina Shop Ecuador</span>
            </div>

            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight text-balance">
              Tu pastelería merece presentaciones que <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-300">vendan solas</span>.
            </h2>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed text-pretty">
              Personalizamos tus bases en MDF 3mm con el <strong>logotipo de tu marca grabado a láser</strong>, fabricamos medidas exactas bajo pedido y enviamos directo a tu taller o domicilio en cualquier provincia del país.
            </p>

            {/* Value checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm text-slate-200">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="size-5 text-emerald-400 shrink-0" />
                <span>Pago seguro con Tarjetas vía Payphone</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Truck className="size-5 text-pink-400 shrink-0" />
                <span>Envíos por Servientrega y LaarCourier</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Sparkles className="size-5 text-amber-400 shrink-0" />
                <span>Grabado de logotipo personalizado (+ $0.20)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="size-5 text-blue-400 shrink-0" />
                <span>Precios por docena y mayorista automáticos</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/catalogo"
                className="inline-flex items-center gap-2 rounded-2xl bg-alina-600 hover:bg-alina-500 text-white font-bold px-6 py-4 text-base shadow-lg shadow-alina-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Explorar Tienda Virtual</span>
                <ArrowRight className="size-4" />
              </Link>

              <a
                href="https://wa.me/593985890956?text=%C2%A1Hola%20Alina%20Shop!%20Quisiera%20cotizar%20un%20pedido%20personalizado%20para%20mi%20pasteler%C3%ADa."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600/90 hover:bg-emerald-600 text-white font-bold px-6 py-4 text-base border border-emerald-500/50 shadow-lg shadow-emerald-950/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <MessageCircle className="size-5" />
                <span>Asesoría por WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Product Collage Showcase */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-md aspect-square rounded-3xl bg-gradient-to-tr from-white/10 to-white/5 border border-white/15 p-6 backdrop-blur-xl flex flex-col justify-between shadow-2xl">
              <div className="relative w-full h-3/5 rounded-2xl overflow-hidden bg-white/90 p-4 shadow-inner flex items-center justify-center">
                <Image
                  src="/images/products/bases-mdf/base-mdf-personalizada-logo.png"
                  alt="Base MDF con logotipo grabado personalizado"
                  fill
                  className="object-contain p-2 hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-md">
                  Corte Láser + Grabado
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3">
                <div className="relative h-24 rounded-xl overflow-hidden bg-white/90 p-2 shadow-sm flex items-center justify-center">
                  <Image
                    src="/images/products/toppers/topper-acrilico-espejo-dorado.png"
                    alt="Toppers en Acrílico Espejado"
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <div className="relative h-24 rounded-xl overflow-hidden bg-white/90 p-2 shadow-sm flex items-center justify-center">
                  <Image
                    src="/images/products/cajas/caja-acetato-tapa-blanca.png"
                    alt="Caja de Acetato con Tapa Blanca"
                    fill
                    className="object-contain p-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
