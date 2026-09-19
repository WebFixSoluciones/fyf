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
            <div className="pt-2.5 flex flex-col">
              {/* Category Tag (Minimalist Saleor Style) */}
              <span className="text-xs font-normal uppercase text-slate-500">
                {product.categoryTag || product.categorySlug?.replace("-", " ")}
              </span>

              {/* Product Title */}
              <h3 className="mt-1 text-sm font-medium text-slate-900 leading-snug line-clamp-2 group-hover:text-[#FF841D] transition-colors">
                {product.name}
              </h3>

              {/* Price */}
              <p className="mt-1 text-sm font-bold text-slate-950">
                ${(product.variants?.[0]?.unitPrice ?? 45).toFixed(2)}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
