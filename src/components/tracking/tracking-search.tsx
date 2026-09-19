'use client';

import React, { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { Search, Package, Truck, CheckCircle2, Clock, MapPin, ExternalLink, AlertCircle } from "lucide-react";

export function TrackingSearch() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);

    // Simulated / real lookup
    setTimeout(() => {
      setLoading(false);
      // Demo order data
      const clean = query.trim().toUpperCase();
      if (clean.includes("ALN") || clean.length >= 10 || clean === "123") {
        setResult({
          orderNumber: clean.startsWith("ALN") ? clean : `ALN-2026-1082`,
          customerName: "Pastelería Sweet Dreams (Karla Morales)",
          city: "Quito, Pichincha",
          orderStatus: "ENVIADO", // PENDIENTE, PAGADO, EN_PREPARACION, ENVIADO, ENTREGADO
          date: "15 de Septiembre de 2026",
          items: [
            { name: "24x Base de Torta MDF Rizada 20cm (Color Blanco + Logo)", price: 20.16 },
          ],
          total: 23.66,
          tracking: {
            courier: "Servientrega Ecuador",
            trackingNumber: "SER-9823471029",
            trackingUrl: "https://www.servientrega.com.ec/rastreo",
            shippedAt: "16 de Septiembre, 09:30 AM",
            notes: "En tránsito hacia agencia centro norte",
          },
        });
      } else {
        setResult(null);
      }
    }, 600);
  };

  const steps = [
    { label: "Pendiente", key: "PENDIENTE", icon: Clock },
    { label: "Pagado", key: "PAGADO", icon: CheckCircle2 },
    { label: "En Taller", key: "EN_PREPARACION", icon: Package },
    { label: "Enviado con Guía", key: "ENVIADO", icon: Truck },
    { label: "Entregado", key: "ENTREGADO", icon: CheckCircle2 },
  ];

  const getStepStatus = (stepKey: string, currentStatus: string) => {
    const order = ["PENDIENTE", "PAGADO", "EN_PREPARACION", "ENVIADO", "ENTREGADO"];
    const currentIndex = order.indexOf(currentStatus);
    const stepIndex = order.indexOf(stepKey);

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "upcoming";
  };

  return (
    <div className="space-y-8">
      {/* Search Input Box */}
      <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ingresa tu N° de Pedido (ej: ALN-2026-1082) o Cédula..."
              className="w-full pl-11 pr-4 py-2.5 text-sm text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:border-alina-600 font-medium"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-slate-900 hover:bg-slate-800 text-white font-display font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
          >
            {loading ? "Buscando..." : "Rastrear"}
          </button>
        </form>
        <p className="text-[11px] text-slate-400 text-center mt-2.5">
          ¿No tienes a mano tu código? También puedes consultar usando el número de cédula o RUC registrado.
        </p>
      </div>

      {/* Results View */}
      {hasSearched && (
        result ? (
          <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-md">
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-alina-600">
                  Estado del Envío
                </span>
                <h3 className="font-display font-extrabold text-2xl text-slate-900 mt-0.5">
                  Pedido {result.orderNumber}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Cliente: <strong className="text-slate-800">{result.customerName}</strong> · Destino: {result.city}
                </p>
              </div>

              <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full border border-blue-200 flex items-center gap-1.5">
                <Truck className="w-4 h-4" />
                Enviado en Camino
              </span>
            </div>

            {/* Stepper Timeline */}
            <div className="py-6 border-b border-slate-100">
              <div className="grid grid-cols-5 gap-2 text-center">
                {steps.map((s, idx) => {
                  const status = getStepStatus(s.key, result.orderStatus);
                  const Icon = s.icon;

                  return (
                    <div key={idx} className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                          status === "completed"
                            ? "bg-emerald-600 border-emerald-600 text-white"
                            : status === "current"
                            ? "bg-blue-600 border-blue-600 text-white ring-4 ring-blue-100"
                            : "bg-slate-100 border-slate-200 text-slate-400"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[11px] font-semibold mt-2 ${
                        status === "current" ? "text-blue-700 font-bold" : "text-slate-600"
                      }`}>
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shipping details */}
            {result.tracking && (
              <div className="bg-slate-50 rounded-xl p-4 mt-6 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-alina-600" />
                    <span className="font-semibold text-xs text-slate-900">
                      Transportista: {result.tracking.courier}
                    </span>
                  </div>
                  <a
                    href={result.tracking.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-alina-600 hover:text-alina-700 inline-flex items-center gap-1"
                  >
                    <span>Ver en Servientrega</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-200/60">
                  <div>
                    <span className="text-slate-500">N° de Guía:</span>
                    <div className="font-mono font-bold text-slate-900 mt-0.5">
                      {result.tracking.trackingNumber}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500">Fecha de Despacho:</span>
                    <div className="font-medium text-slate-800 mt-0.5">
                      {result.tracking.shippedAt}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-md mx-auto text-center py-10 bg-white border border-slate-200 rounded-2xl p-6">
            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="font-semibold text-sm text-slate-800">No encontramos un pedido con esos datos</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Verifica que el número de orden esté escrito correctamente o contáctanos por WhatsApp para ayudarte.
            </p>
          </div>
        )
      )}
    </div>
  );
}
