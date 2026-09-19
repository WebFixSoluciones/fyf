'use client';

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { formatCurrency } from "@/lib/utils";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

export function CartDrawer() {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, removeItem, subtotal } = useCart();
  const router = useRouter();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-8 md:pl-10">
        <div className="w-screen max-w-full sm:max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-4 py-3.5 sm:px-6 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-2">
              <ShoppingBag className="size-4.5 text-alina-600" />
              <h2 className="font-display font-bold text-base sm:text-lg text-slate-900">Tu Carrito</h2>
              <span className="bg-alina-50 text-alina-700 text-[11px] font-bold px-2 py-0.5 rounded-full border border-alina-200">
                {items.length} {items.length === 1 ? "ítem" : "ítems"}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Cerrar carrito"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto px-3.5 sm:px-6 py-2 sm:py-4 divide-y divide-slate-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="size-14 sm:size-16 bg-alina-50 text-alina-400 rounded-full flex items-center justify-center mb-3">
                  <ShoppingBag className="size-7 sm:size-8" />
                </div>
                <h3 className="font-display font-semibold text-slate-800 text-sm sm:text-base mb-1">
                  Tu carrito está vacío
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm max-w-xs mb-5">
                  Explora nuestro catálogo de uniformes corporativos, ropa de trabajo y calzado industrial para cotizar.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-slate-900 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
                >
                  Ir a la Tienda
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-3 sm:py-3.5 flex gap-3 items-center">
                  <div className="size-14 sm:size-16 bg-slate-50 border border-slate-200/80 rounded-xl overflow-hidden shrink-0 flex items-center justify-center relative p-1">
                    <Image
                      src={item.mainImage || "/logo.jpg"}
                      alt={item.productName}
                      width={64}
                      height={64}
                      className="object-contain size-full"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-display font-semibold text-slate-900 text-xs sm:text-sm truncate">
                      {item.productName}
                    </h4>

                    <div className="text-[11px] text-slate-500 mt-0.5 space-y-0.5">
                      <div>
                        <span>Medida: </span>
                        <span className="font-semibold text-slate-700">{item.sizeLabel}</span>
                        {item.shape && <span> · {item.shape}</span>}
                      </div>
                      {item.withLogo && (
                        <span className="inline-block bg-pink-50 text-pink-700 font-bold px-1.5 py-0.2 rounded text-[10px] border border-pink-200">
                          + Logo Grabado
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Controller */}
                      <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50/60 overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 hover:bg-slate-200 text-slate-600 transition-colors"
                          aria-label="Disminuir cantidad"
                        >
                          <Minus className="size-3 text-slate-700" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 hover:bg-slate-200 text-slate-600 transition-colors"
                          aria-label="Aumentar cantidad"
                        >
                          <Plus className="size-3 text-slate-700" />
                        </button>
                      </div>

                      {/* Price & Delete */}
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-xs sm:text-sm text-slate-900">
                          {formatCurrency(item.unitPrice * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-slate-400 hover:text-red-500 transition-colors p-1"
                          aria-label="Eliminar producto"
                        >
                          <Trash2 className="size-3.5 sm:size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Checkout */}
          {items.length > 0 && (
            <div className="p-3.5 sm:p-5 border-t border-slate-100 bg-slate-50/90 space-y-2.5 sm:space-y-3 shrink-0">
              <div className="flex justify-between items-baseline">
                <span className="text-slate-600 text-xs sm:text-sm font-medium">Subtotal estimado:</span>
                <span className="font-display font-extrabold text-lg sm:text-xl text-slate-950">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Los costos de envío e impuestos se calculan al proceder al pago.
              </p>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  router.push("/checkout");
                }}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-display font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg text-xs sm:text-sm cursor-pointer active:scale-[0.99]"
              >
                <span>Proceder al Pago Seguro</span>
                <ArrowRight className="size-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
