'use client';

import React, { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/utils";
import {
  ShoppingBag,
  Filter,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  X,
  ExternalLink,
  MessageCircle,
  AlertCircle,
  Inbox,
  Sparkles
} from "lucide-react";

export interface OrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  city: string;
  address: string;
  total: number;
  paymentMethod: string;
  orderStatus: "PENDIENTE" | "PAGADO" | "EN_PREPARACION" | "ENVIADO" | "ENTREGADO";
  items: string;
  courier?: string;
  trackingNumber?: string;
  createdAt?: string;
}

const ORDERS_STORAGE_KEY = "alina_admin_orders_list";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrderForShipping, setSelectedOrderForShipping] = useState<OrderItem | null>(null);
  const [courierInput, setCourierInput] = useState("Servientrega");
  const [trackingNumberInput, setTrackingNumberInput] = useState("");

  // Load orders from localStorage if any, or default clean empty
  useEffect(() => {
    try {
      const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setOrders(parsed);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveOrders = (newOrders: OrderItem[]) => {
    setOrders(newOrders);
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(newOrders));
    } catch {}
  };

  const filteredOrders = orders.filter((o) => {
    const matchStatus = filterStatus === "ALL" || o.orderStatus === filterStatus;
    const matchQuery =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchQuery;
  });

  const handleUpdateStatus = (orderId: string, newStatus: OrderItem["orderStatus"]) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o));
    saveOrders(updated);
  };

  const handleSaveShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForShipping) return;

    const updated = orders.map((o) =>
      o.id === selectedOrderForShipping.id
        ? {
            ...o,
            orderStatus: "ENVIADO" as const,
            courier: courierInput,
            trackingNumber: trackingNumberInput || `GUIA-${Date.now().toString().slice(-6)}`,
          }
        : o
    );

    saveOrders(updated);
    setSelectedOrderForShipping(null);
    setTrackingNumberInput("");
  };

  const counts = {
    total: orders.length,
    pendientes: orders.filter((o) => o.orderStatus === "PENDIENTE").length,
    pagados: orders.filter((o) => o.orderStatus === "PAGADO").length,
    preparacion: orders.filter((o) => o.orderStatus === "EN_PREPARACION").length,
    enviados: orders.filter((o) => o.orderStatus === "ENVIADO").length,
    entregados: orders.filter((o) => o.orderStatus === "ENTREGADO").length,
  };

  return (
    <main className="p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-alina-600" />
            <span>Gestión de Pedidos & Envíos</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Control de estados de taller, transportistas de Ecuador (Servientrega, LaarCourier) y atención al cliente
          </p>
        </div>

        {orders.length > 0 && (
          <button
            onClick={() => {
              if (confirm("¿Deseas vaciar todos los pedidos de prueba?")) {
                saveOrders([]);
              }
            }}
            className="text-xs font-semibold text-slate-500 hover:text-rose-600 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-rose-200 hover:bg-rose-50 transition-colors"
          >
            Limpiar Pedidos a 0
          </button>
        )}
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white border border-slate-200 p-3.5 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Pedidos</span>
          <div className="font-display font-extrabold text-xl text-slate-900 mt-0.5">{counts.total}</div>
        </div>
        <div className="bg-white border border-slate-200 p-3.5 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Pendientes</span>
          <div className="font-display font-extrabold text-xl text-amber-600 mt-0.5">{counts.pendientes}</div>
        </div>
        <div className="bg-white border border-slate-200 p-3.5 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Pagados</span>
          <div className="font-display font-extrabold text-xl text-emerald-600 mt-0.5">{counts.pagados}</div>
        </div>
        <div className="bg-white border border-slate-200 p-3.5 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">En Taller</span>
          <div className="font-display font-extrabold text-xl text-purple-600 mt-0.5">{counts.preparacion}</div>
        </div>
        <div className="bg-white border border-slate-200 p-3.5 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Enviados</span>
          <div className="font-display font-extrabold text-xl text-blue-600 mt-0.5">{counts.enviados}</div>
        </div>
        <div className="bg-white border border-slate-200 p-3.5 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Entregados</span>
          <div className="font-display font-extrabold text-xl text-slate-700 mt-0.5">{counts.entregados}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between shadow-2xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { key: "ALL", label: "Todos", count: counts.total },
            { key: "PENDIENTE", label: "Pendientes", count: counts.pendientes },
            { key: "PAGADO", label: "Pagados", count: counts.pagados },
            { key: "EN_PREPARACION", label: "En Taller", count: counts.preparacion },
            { key: "ENVIADO", label: "Enviados", count: counts.enviados },
            { key: "ENTREGADO", label: "Entregados", count: counts.entregados },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setFilterStatus(item.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                filterStatus === item.key
                  ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <span>{item.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                filterStatus === item.key ? "bg-white/25 text-white" : "bg-slate-100 text-slate-600"
              }`}>
                {item.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por N° orden o cliente..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-alina-600"
          />
        </div>
      </div>

      {/* Orders Table & Clean Empty State */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-slate-50 border border-slate-200/80 text-slate-400 flex items-center justify-center mx-auto shadow-xs">
              <Inbox className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-900">
                No hay pedidos registrados en la tienda
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
                El historial de pedidos se encuentra limpio y en 0. Cuando los clientes realicen compras a través del checkout con Payphone o por WhatsApp, se reflejarán aquí al instante con sus datos y lista de artículos.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-4">N° Orden</th>
                  <th className="p-4">Cliente & Destino</th>
                  <th className="p-4">Detalle de Productos</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <span className="font-display font-bold text-slate-900">{ord.orderNumber}</span>
                      <div className="text-[11px] text-slate-400 mt-0.5">{ord.paymentMethod}</div>
                    </td>

                    <td className="p-4">
                      <div className="font-semibold text-slate-800">{ord.customerName}</div>
                      <div className="text-slate-500 text-[11px]">{ord.city} · {ord.customerPhone}</div>
                    </td>

                    <td className="p-4 max-w-xs">
                      <span className="text-slate-700">{ord.items}</span>
                      {ord.courier && (
                        <div className="text-[11px] text-blue-700 font-semibold mt-1 flex items-center gap-1">
                          <Truck className="w-3 h-3 text-blue-600 shrink-0" />
                          <span>{ord.courier}: {ord.trackingNumber}</span>
                        </div>
                      )}
                    </td>

                    <td className="p-4">
                      <span className="font-display font-bold text-sm text-slate-900">
                        {formatCurrency(ord.total)}
                      </span>
                    </td>

                    <td className="p-4">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => handleUpdateStatus(ord.id, e.target.value as any)}
                        className="text-xs font-semibold rounded-lg border border-slate-200 px-2 py-1 bg-white focus:outline-none cursor-pointer"
                      >
                        <option value="PENDIENTE">Pendiente</option>
                        <option value="PAGADO">Pagado</option>
                        <option value="EN_PREPARACION">En Taller / Fabricación</option>
                        <option value="ENVIADO">Enviado con Guía</option>
                        <option value="ENTREGADO">Entregado</option>
                      </select>
                    </td>

                    <td className="p-4 text-right space-x-2">
                      {ord.orderStatus !== "ENVIADO" && ord.orderStatus !== "ENTREGADO" && (
                        <button
                          onClick={() => setSelectedOrderForShipping(ord)}
                          className="inline-flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Asignar Guía</span>
                        </button>
                      )}

                      <a
                        href={`https://wa.me/593${ord.customerPhone.slice(-9)}?text=Hola%20${encodeURIComponent(ord.customerName)},%20te%20saludamos%20de%20Alina%20Shop%20sobre%20tu%20pedido%20*${ord.orderNumber}*.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Asignar Guía de Envío */}
      {selectedOrderForShipping && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-100">
            <button
              onClick={() => setSelectedOrderForShipping(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display font-bold text-lg text-slate-900 mb-1">
              Asignar Guía de Envío
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Pedido: <strong className="text-slate-800">{selectedOrderForShipping.orderNumber}</strong> ({selectedOrderForShipping.customerName})
            </p>

            <form onSubmit={handleSaveShipping} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Empresa de Transporte
                </label>
                <select
                  value={courierInput}
                  onChange={(e) => setCourierInput(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 bg-white focus:outline-none focus:border-alina-600 font-medium"
                >
                  <option value="Servientrega">Servientrega Ecuador</option>
                  <option value="LaarCourier">LaarCourier</option>
                  <option value="Cooperativa Baños">Cooperativa Baños</option>
                  <option value="Cooperativa Loja">Cooperativa Loja</option>
                  <option value="Motorizado Local">Motorizado Local (Quito)</option>
                  <option value="Retiro en Taller">Retiro en Taller (Quito)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Número de Guía de Remisión / Rastreo
                </label>
                <input
                  type="text"
                  required
                  value={trackingNumberInput}
                  onChange={(e) => setTrackingNumberInput(e.target.value)}
                  placeholder="Ej: SER-9823471029"
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-alina-600 font-mono"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForShipping(null)}
                  className="flex-1 bg-white border border-slate-200 text-slate-700 text-xs font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-slate-900 text-white text-xs font-bold py-2.5 rounded-xl hover:bg-black transition-colors shadow-md flex items-center justify-center gap-1.5"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Confirmar Despacho</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
