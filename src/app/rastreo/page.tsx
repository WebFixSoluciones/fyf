import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { TrackingSearch } from "@/components/tracking/tracking-search";
import { Truck, ShieldCheck, Phone } from "lucide-react";

export default function TrackingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar />

      <main className="flex-1 w-[95%] max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-800 text-xs font-medium px-3 py-1 rounded-full mb-3">
            <Truck className="w-3.5 h-3.5 text-[#FF841D]" />
            <span>Seguimiento de Envíos en Tiempo Real</span>
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-neutral-900 tracking-tight">
            Rastrea tu Pedido FYF Uniformes
          </h1>
          <p className="text-sm text-neutral-600 mt-2">
            Consulta el estado de confección y el número de guía asignado por Servientrega o LaarCourier.
          </p>
        </div>

        <TrackingSearch />
      </main>

      <Footer />
    </div>
  );
}
