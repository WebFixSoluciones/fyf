import React from "react";
import {
  TrendingUp,
  MessageCircle,
  ShoppingBag,
  Eye,
  Sparkles,
  ArrowUpRight
} from "lucide-react";

export default function AdminAnalyticsPage() {
  const topProducts = [
    { rank: 1, name: "Base MDF Rizada 20cm (Color Blanco)", category: "Bases MDF", clicks: 142, share: "38%", conversion: "24 pedidos" },
    { rank: 2, name: "Caja Acetato Tapa Blanca (21.5x24 cm)", category: "Cajas", clicks: 89, share: "24%", conversion: "16 pedidos" },
    { rank: 3, name: "Toppers Acrílico Espejado Personalizado", category: "Toppers", clicks: 64, share: "17%", conversion: "11 pedidos" },
    { rank: 4, name: "Base MDF Rectangular 30x20 cm", category: "Bases Rectangulares", clicks: 48, share: "13%", conversion: "8 pedidos" },
    { rank: 5, name: "Mangas Desechables 30cm (Pack 100)", category: "Complementos", clicks: 31, share: "8%", conversion: "5 pedidos" },
  ];

  return (
    <main className="p-8 space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight">
          Analítica de Interacciones WhatsApp
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Métricas registradas al hacer clic en &quot;Comprar por WhatsApp&quot; para identificar productos con mayor demanda
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500">Total Consultas WhatsApp</div>
          <div className="font-display font-extrabold text-3xl text-emerald-600 tracking-tight mt-1">
            374
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">Últimos 30 días</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500">Tasa de Conversión a Pedido</div>
          <div className="font-display font-extrabold text-3xl text-slate-900 tracking-tight mt-1">
            17.1%
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">64 ventas cerradas</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500">Producto Más Cotizado</div>
          <div className="font-display font-bold text-lg text-alina-600 tracking-tight mt-1 truncate">
            Base MDF Rizada 20cm
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">38% del interés total</div>
        </div>
      </div>

      {/* Ranking Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-alina-600" />
            <h2 className="font-display font-bold text-base text-slate-900">
              Ranking de Productos con Más Interacciones
            </h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4 w-12">#</th>
                <th className="p-4">Producto Consultado</th>
                <th className="p-4">Categoría</th>
                <th className="p-4">Total Clics</th>
                <th className="p-4">Cuota de Interés</th>
                <th className="p-4">Pedidos Concretados</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topProducts.map((p) => (
                <tr key={p.rank} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-bold text-slate-400">{p.rank}</td>
                  <td className="p-4 font-semibold text-slate-800">{p.name}</td>
                  <td className="p-4 text-slate-500">{p.category}</td>
                  <td className="p-4 font-mono font-bold text-slate-900">{p.clicks}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div className="bg-alina-500 h-full rounded-full" style={{ width: p.share }} />
                      </div>
                      <span className="font-semibold text-slate-700">{p.share}</span>
                    </div>
                  </td>
                  <td className="p-4 text-emerald-700 font-semibold">{p.conversion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
