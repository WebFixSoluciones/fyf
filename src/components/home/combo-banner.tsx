'use client';

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, ArrowRight, MessageCircle, Check } from "lucide-react";

export function ComboBanner() {
  return (
    <section className="w-full py-6">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-10 lg:p-14 text-white shadow-sm">
        <div className="relative z-10 grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
          
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-800/90 border border-slate-700 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
              <ShieldCheck className="size-3.5 text-amber-400" aria-hidden="true" />
              <span>Dotación y Seguridad Integral</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight">
              Equipamiento Integral para tu Empresa:{" "}
              <span className="text-amber-500">
                Uniformes, Calzado y EPP
              </span>
            </h2>

            <p className="text-sm sm:text-base leading-relaxed text-slate-300 max-w-xl font-normal">
              Confeccionamos ropa de trabajo resistente (jean, térmica, ignífuga) y la combinamos con calzado de seguridad dieléctrico y equipos de protección certificados. Soluciones completas con entrega puntual a nivel nacional.
            </p>

            <ul className="space-y-2 text-xs sm:text-sm text-slate-300 pt-1">
              <li className="flex items-center gap-2">
                <Check className="size-4 text-amber-500 shrink-0" />
                <span>Personalización total con bordados de alta definición para tu marca</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-amber-500 shrink-0" />
                <span>Precios especiales por volumen para dotaciones corporativas</span>
              </li>
            </ul>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <Link
                href="/catalogo"
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm px-6 py-3.5 shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Ver Catálogo Completo</span>
                <ArrowRight className="size-4" />
              </Link>
              <a
                href="https://wa.me/593993358701?text=¡Hola%20FYF%20Uniformes!%20Quiero%20una%20cotización%20de%20dotación%20para%20mi%20empresa."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold text-xs sm:text-sm px-5 py-3.5 transition-colors"
              >
                <MessageCircle className="size-4 text-emerald-400 shrink-0" />
                <span>Cotizar por WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Column: Visual Showcase */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="relative aspect-square w-full max-w-sm rounded-2xl overflow-hidden border border-slate-800 bg-slate-800/50 shadow-2xl">
              <Image
                src="https://www.fyf.com.ec/wp-content/uploads/2025/04/uniformes-y-ropa-de-trabajo-en-ecuador.jpg"
                alt="Dotaciones de uniformes y ropa de trabajo en Ecuador"
                fill
                className="object-cover"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
