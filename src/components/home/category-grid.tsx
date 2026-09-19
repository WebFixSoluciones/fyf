'use client';

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CATEGORIES_DATA } from "@/lib/catalog-data";

export function CategoryGrid() {
  return (
    <section className="mx-auto w-[92%] max-w-[1440px] px-4 py-12 sm:py-16">
      {/* Clean section title matching Image 2 */}
      <div className="text-center mb-10 sm:mb-12">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-normal text-slate-900 tracking-tight">
          Explora Nuestras Líneas de <strong className="font-bold text-slate-950">Uniformes y Ropa de Trabajo</strong>
        </h2>
      </div>

      {/* 7 category cards grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3.5 sm:gap-4">
        {CATEGORIES_DATA.map((cat) => (
          <Link
            key={cat.slug}
            href={`/catalogo?categoria=${cat.slug}`}
            className="group flex flex-col items-center text-center transition-transform duration-200 hover:-translate-y-1"
          >
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-50 border border-slate-200/80 shadow-xs group-hover:border-slate-300 group-hover:shadow-md transition-all">
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 14vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <h3 className="mt-3 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-900 group-hover:text-amber-600 transition-colors leading-tight line-clamp-2">
              {cat.name}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
