'use client';

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SeedProduct } from "@/lib/catalog-data";

interface ProductGridProps {
  products: SeedProduct[];
  className?: string;
}

export function ProductGrid({ products, className }: ProductGridProps) {
  return (
    <div
      className={
        className ||
        "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6"
      }
    >
      {products.map((product) => {
        return (
          <Link
            key={product.sku || product.slug}
            href={`/producto/${product.slug}`}
            className="group flex flex-col bg-white text-left transition-all duration-200"
          >
            {/* Image Container with pure white background */}
            <div className="relative aspect-square w-full overflow-hidden bg-white flex items-center justify-center p-2 sm:p-4 rounded-xl border border-transparent group-hover:border-slate-100 transition-all">
              <Image
                src={product.mainImage}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-contain p-1 transition-transform duration-300 ease-out group-hover:scale-105"
              />
            </div>

            {/* Product Meta */}
            <div className="pt-3 flex flex-col">
              {/* Category Tag */}
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                {product.categoryTag || product.categorySlug?.replace("-", " ")}
              </span>

              {/* Product Title */}
              <h3 className="mt-1 text-xs sm:text-[13px] font-medium text-slate-900 leading-snug line-clamp-3 group-hover:text-slate-600 transition-colors">
                {product.name}
              </h3>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
