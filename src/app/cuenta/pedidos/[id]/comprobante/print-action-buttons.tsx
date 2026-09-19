'use client';

import React from "react";
import Link from "next/link";
import { Printer, ArrowLeft, Truck, Download } from "lucide-react";

interface PrintActionButtonsProps {
  orderNumber: string;
}

export function PrintActionButtons({ orderNumber }: PrintActionButtonsProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="print:hidden bg-slate-900 text-white py-3 px-4 sm:px-6 shadow-md rounded-2xl mb-6 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <Link
          href="/cuenta/pedidos"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver a Mis Pedidos</span>
        </Link>
        <span className="hidden sm:inline text-xs text-slate-400">
          Comprobante Oficial de Compra #{orderNumber}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href={`/rastreo?orden=${encodeURIComponent(orderNumber)}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Truck className="w-3.5 h-3.5 text-alina-400" />
          <span>Rastrear Envío</span>
        </Link>

        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 bg-alina-600 hover:bg-alina-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer active:scale-95"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimir / Descargar PDF</span>
        </button>
      </div>
    </div>
  );
}
