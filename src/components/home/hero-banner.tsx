'use client';

import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Award, Factory } from "lucide-react";

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 text-white py-16 sm:py-24">
      {/* Subtle background grid pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

      <div className="relative mx-auto w-[90%] max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/80 px-3.5 py-1 text-xs font-medium text-amber-400 backdrop-blur-xs mb-6">
            <Award className="size-3.5" />
            <span>+20 Años de Experiencia en Ecuador</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            Innovación y Calidad en <span className="text-amber-500 font-black">UNIFORMES</span>
          </h1>

          <p className="mt-5 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
            Fabricantes de uniformes corporativos, ropa jean de trabajo, prendas ignífugas, cuartos fríos y calzado de seguridad. Soluciones a la medida de tu empresa.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 px-6 py-3.5 text-sm font-bold shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-95"
            >
              <span>Explorar Catálogo</span>
              <ArrowRight className="size-4" />
            </Link>

            <Link
              href="/contactos"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-white px-6 py-3.5 text-sm font-semibold transition-all hover:border-slate-500"
            >
              <span>Solicitar Cotización</span>
            </Link>
          </div>

          {/* Micro trust indicators */}
          <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Factory className="size-4 text-amber-400 shrink-0" />
              <span>Fabricación Directa</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-amber-400 shrink-0" />
              <span>Normativas de Seguridad</span>
            </div>
            <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
              <Award className="size-4 text-amber-400 shrink-0" />
              <span>Entrega Puntual Garantizada</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
