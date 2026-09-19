'use client';

import React from "react";
import Image from "next/image";
import { useCart } from "@/context/cart-context";
import { ProductCustomizer } from "@/components/product/product-customizer";
import { X } from "lucide-react";

export function QuickViewModal() {
  const { quickViewProduct, setQuickViewProduct } = useCart();

  if (!quickViewProduct) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center p-6 relative aspect-square">
            <Image
              src={quickViewProduct.mainImage || "/logo.jpg"}
              alt={quickViewProduct.name}
              fill
              className="object-contain p-4"
            />
          </div>

          <div className="md:col-span-7">
            <div className="mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-alina-600">
                Vista Rápida
              </span>
              <h3 className="font-display font-semibold text-xl text-slate-900 mt-0.5">
                {quickViewProduct.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                {quickViewProduct.description}
              </p>
            </div>

            <ProductCustomizer product={quickViewProduct} />
          </div>
        </div>
      </div>
    </div>
  );
}
