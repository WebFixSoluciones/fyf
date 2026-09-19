'use client';

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, ArrowRight, MessageCircle, Check } from "lucide-react";

export function ComboBanner() {
  return (
    <section className="w-full">
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-neutral-800 bg-gradient-to-br from-neutral-950 via-neutral-900 to-black p-6 sm:p-10 lg:p-12 text-white shadow-xl">
        {/* Sutil halo decorativo en los bordes */}
        <div 
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#FF841D]/10 blur-3xl pointer-events-none" 
          aria-hidden="true" 
        />
        <div 
          className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#FF841D]/5 blur-3xl pointer-events-none" 
          aria-hidden="true" 
        />

        <div className="relative z-10 grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
          
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-7 space-y-5">
            {/* Badge de Seguridad y Dotación */}
            <div className="inline-flex items-center gap-2 rounded-full bg-neutral-900/90 border border-neutral-800 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#FF841D]">
              <ShieldCheck className="size-3.5 text-[#FF841D]" aria-hidden="true" />
              <span>Dotación y Seguridad Integral</span>
            </div>

            {/* Título Principal con branding naranja oficial */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight">
              Equipamiento Integral para tu Empresa:{" "}
              <span className="text-[#FF841D]">
                Uniformes, Calzado y EPP
              </span>
            </h2>

            {/* Párrafo descriptivo */}
            <p className="text-sm sm:text-base leading-relaxed text-neutral-300 max-w-xl font-normal">
              Confeccionamos ropa de trabajo resistente (jean, térmica, ignífuga) y la combinamos con calzado de seguridad dieléctrico y equipos de protección certificados. Soluciones completas con entrega puntual a nivel nacional.
            </p>

            {/* Lista de beneficios con checks destacados */}
            <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-300 pt-1">
              <li className="flex items-center gap-2.5">
                <span className="size-5 rounded-full bg-[#FF841D]/15 border border-[#FF841D]/40 flex items-center justify-center shrink-0">
                  <Check className="size-3 text-[#FF841D]" />
                </span>
                <span>Personalización total con bordados de alta definición para tu marca</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="size-5 rounded-full bg-[#FF841D]/15 border border-[#FF841D]/40 flex items-center justify-center shrink-0">
                  <Check className="size-3 text-[#FF841D]" />
                </span>
                <span>Precios especiales por volumen para dotaciones corporativas</span>
              </li>
            </ul>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <Link
                href="/catalogo"
                className="bg-[#FF841D] hover:bg-[#e57212] active:scale-[0.98] text-white font-medium px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
              >
                <span>Ver Catálogo Completo</span>
                <ArrowRight className="size-4" />
              </Link>
              <a
                href="https://wa.me/593993358701?text=¡Hola%20FYF%20Uniformes!%20Quiero%20una%20cotización%20de%20dotación%20para%20mi%20empresa."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-neutral-900/90 hover:bg-neutral-800 active:scale-[0.98] text-neutral-200 hover:text-white font-medium px-5 py-3.5 rounded-xl border border-neutral-700 hover:border-neutral-600 transition-all text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
              >
                <MessageCircle className="size-4 text-[#25D366] shrink-0" />
                <span>Cotizar por WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Column: Visual Showcase */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="relative aspect-square w-full max-w-sm sm:max-w-md rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl group">
              <Image
                src="https://www.fyf.com.ec/wp-content/uploads/2025/04/uniformes-y-ropa-de-trabajo-en-ecuador.jpg"
                alt="Dotaciones de uniformes y ropa de trabajo en Ecuador"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
