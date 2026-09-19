'use client';

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CATEGORIES_DATA } from "@/lib/catalog-data";

export function CategoryGrid() {
  return (
    <section className="mx-auto w-[95%] max-w-[1720px] px-4 py-10 sm:py-14">
      {/* Clean section title matching Image 2 */}
      <div className="text-center mb-8 sm:mb-10">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-normal text-neutral-800 tracking-tight">
          Explora Nuestras Líneas de <span className="font-semibold text-black">Uniformes y Ropa de Trabajo</span>
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
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-white border border-slate-200 shadow-xs group-hover:shadow-md transition-all border-b-4 border-b-[#ff6600]">
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 14vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <h3 className="mt-2.5 text-[11px] sm:text-xs font-medium uppercase tracking-wider text-slate-900 group-hover:text-[#ff6600] transition-colors leading-snug line-clamp-2">
              {cat.name}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
