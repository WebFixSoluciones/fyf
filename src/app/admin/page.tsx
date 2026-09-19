import React from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import {
  ShoppingBag,
  CreditCard,
  TrendingUp,
  Package,
  Truck,
  Clock,
  CheckCircle2,
  ArrowRight,
  Inbox
} from "lucide-react";

export default function AdminDashboardPage() {
  const kpis = [
    { label: "Pedidos Este Mes", value: "0", icon: ShoppingBag, change: "Sin pedidos registrados", color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Facturado", value: "$0.00", icon: CreditCard, change: "Payphone + WhatsApp", color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Clics en WhatsApp", value: "0", icon: TrendingUp, change: "Consultas de clientes", color: "text-alina-600", bg: "bg-pink-50" },
    { label: "En Preparación / Taller", value: "0", icon: Package, change: "Corte y grabado láser", color: "text-purple-600", bg: "bg-purple-50" },
  ];

  const recentOrders: any[] = [];

  return (
    <main className="p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight">
            Panel de Control General
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Resumen operativo en tiempo real de Alina Shop (Ecuador)
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/admin/pedidos"
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Gestionar Pedidos</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500">{kpi.label}</span>
                <div className={`w-8 h-8 rounded-xl ${kpi.bg} ${kpi.color} flex items-center justify-center`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="font-display font-extrabold text-2xl text-slate-900 tracking-tight">
                {kpi.value}
              </div>
              <div className="text-[11px] text-slate-400 mt-1 font-medium">{kpi.change}</div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-slate-500" />
            <h2 className="font-display font-bold text-base text-slate-900">Últimos Pedidos</h2>
          </div>
          <Link href="/admin/pedidos" className="text-xs font-bold text-alina-600 hover:text-alina-700 flex items-center gap-1">
            Ver todos <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200/80 text-slate-400 flex items-center justify-center mx-auto">
              <Inbox className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-slate-800">
                No hay pedidos registrados todavía
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                Cuando los clientes completen compras con Payphone o soliciten cotizaciones por WhatsApp, aparecerán aquí automáticamente.
              </p>
            </div>
            <Link
              href="/catalogo"
              target="_blank"
              className="inline-flex items-center gap-1 text-xs font-semibold text-alina-600 hover:text-alina-700 hover:underline pt-1"
            >
              <span>Ver tienda en vivo</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentOrders.map((ord: any) => (
              <div key={ord.id} className="p-4 hover:bg-slate-50/80 transition-colors flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="w-32">
                  <span className="font-display font-bold text-slate-900">{ord.id}</span>
                  <div className="text-[11px] text-slate-400">{ord.method}</div>
                </div>

                <div className="flex-1 min-w-[200px]">
                  <strong className="text-slate-800 font-semibold">{ord.customer}</strong>
                  <div className="text-slate-500 text-[11px]">{ord.city} · {ord.items}</div>
                </div>

                <div className="w-24 text-right">
                  <span className="font-display font-bold text-slate-900 text-sm">{formatCurrency(ord.total)}</span>
                </div>

                <div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold border bg-slate-100 text-slate-800 border-slate-200">
                    {ord.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
