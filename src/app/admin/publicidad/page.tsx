'use client';

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Megaphone,
  Sparkles,
  Truck,
  Gift,
  CreditCard,
  Tag,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Eye,
  Save,
  Clock,
  ArrowRight,
  Sliders,
  X,
  Upload,
  RotateCcw,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  RefreshCw,
  Info
} from "lucide-react";
import { PromotionsConfig, NavbarPromotionItem } from "@/lib/promotions-store";
import { HomePromotionModal } from "@/components/home/home-promotion-modal";
import { PromotionTicker } from "@/components/layout/promotion-ticker";

const CATALOG_PRESETS = [
  {
    name: "Base MDF Blanco / Wengué",
    url: "/images/products/bases-mdf/base-mdf-blanco-wengue.png",
    category: "Bases",
  },
  {
    name: "Base Personalizada Logo Láser",
    url: "/images/products/bases-mdf/base-mdf-personalizada-logo.png",
    category: "Bases",
  },
  {
    name: "Topper Acrílico Espejo Dorado",
    url: "/images/products/toppers/topper-acrilico-espejo-dorado.png",
    category: "Toppers",
  },
  {
    name: "Caja Acetato Cristal 360°",
    url: "/images/products/cajas/caja-acetato-tapa-transparente.png",
    category: "Cajas",
  },
  {
    name: "Apliques Miniatura en Acrílico",
    url: "/images/products/apliques/aplique-acrilico-miniatura-4cm-6cm-01.png",
    category: "Apliques",
  },
  {
    name: "Colección Diseños y Siluetas",
    url: "/images/products/bases-disenos/base-diseno-coleccion.png",
    category: "Diseños",
  },
];

const QUICK_TICKER_TEMPLATES = [
  {
    icon: "truck" as const,
    text: "Envíos asegurados a todo el Ecuador por Servientrega y LaarCourier",
    linkUrl: "/rastreo",
  },
  {
    icon: "tag" as const,
    text: "Por la compra de la docena obtén precios mayoristas de fábrica",
    linkUrl: "/catalogo",
  },
  {
    icon: "sparkles" as const,
    text: "Personaliza tus bases con el logo de tu pastelería por solo +$0.20",
    linkUrl: "/catalogo?categoria=bases-mdf",
  },
  {
    icon: "credit-card" as const,
    text: "Pagos 100% seguros con tarjetas Visa, Mastercard o WhatsApp",
    linkUrl: "/checkout",
  },
  {
    icon: "gift" as const,
    text: "Combos para pastelerías: Base MDF + Topper Espejo + Caja Cristal",
    linkUrl: "/catalogo",
  },
];

export default function AdminPublicidadPage() {
  const [config, setConfig] = useState<PromotionsConfig | null>(null);
  const [activeTab, setActiveTab] = useState<"popup" | "ticker">("popup");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showModalPreview, setShowModalPreview] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      setError("");

      // 1. Intentar cargar desde cache local para respuesta instantánea
      try {
        const cached = localStorage.getItem("alina_promotions_config");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed?.popup && parsed?.ticker) {
            setConfig(parsed);
          }
        }
      } catch (e) {}

      // 2. Traer configuración oficial desde el backend
      const res = await fetch(`/api/admin/promotions?t=${Date.now()}`);
      const data = await res.json();
      if (res.ok && data.success && data.promotions) {
        setConfig(data.promotions);
        try {
          localStorage.setItem("alina_promotions_config", JSON.stringify(data.promotions));
        } catch (e) {}
      } else if (!config) {
        setError(data.message || "Error al cargar configuración de publicidad");
      }
    } catch (e) {
      if (!config) {
        setError("Error de conexión con el servidor");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!config) return;

    setSaving(true);
    setMessage("");
    setError("");

    const timestamp = new Date().toISOString();
    const configToSave: PromotionsConfig = {
      ...config,
      updatedAt: timestamp,
      popup: {
        ...config.popup,
        updatedAt: timestamp,
      },
    };

    try {
      // 1. Guardar localmente y reiniciar bloqueo de visualización para pruebas inmediatas
      try {
        localStorage.setItem("alina_promotions_config", JSON.stringify(configToSave));
        localStorage.removeItem("alina_home_popup_dismissed");
        window.dispatchEvent(
          new CustomEvent("alina_promotions_updated", { detail: configToSave })
        );
      } catch (e) {}

      // 2. Persistir en la API del servidor
      const res = await fetch("/api/admin/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(configToSave),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setConfig(data.promotions || configToSave);
        setMessage("¡Publicidad guardada exitosamente y sincronizada en vivo con la tienda!");
        setTimeout(() => setMessage(""), 4500);
      } else {
        // Aún si la API falla o expira la sesión, se mantiene en memoria local
        setConfig(configToSave);
        setMessage("Guardado localmente. Recuerda verificar tu sesión de administrador.");
        setTimeout(() => setMessage(""), 4000);
      }
    } catch (e) {
      setConfig(configToSave);
      setMessage("Guardado en navegador. Conexión limitada con el servidor.");
      setTimeout(() => setMessage(""), 4000);
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = async () => {
    setResetting(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/admin/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.promotions) {
        setConfig(data.promotions);
        try {
          localStorage.setItem("alina_promotions_config", JSON.stringify(data.promotions));
          localStorage.removeItem("alina_home_popup_dismissed");
          window.dispatchEvent(
            new CustomEvent("alina_promotions_updated", { detail: data.promotions })
          );
        } catch (e) {}
        setMessage("Configuración restablecida a los valores originales de fábrica.");
      } else {
        setError(data.message || "No se pudo restablecer");
      }
    } catch (e) {
      setError("Error de comunicación al restablecer");
    } finally {
      setResetting(false);
      setShowResetConfirm(false);
    }
  };

  const handleImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !config) return;

    if (file.size > 2.5 * 1024 * 1024) {
      alert("La imagen no debe superar los 2.5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setConfig({
          ...config,
          popup: {
            ...config.popup,
            imageUrl: reader.result,
          },
        });
        setMessage("Imagen cargada en la vista previa. Recuerda hacer clic en 'Guardar y Publicar'.");
        setTimeout(() => setMessage(""), 4000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddTickerMessage = (template?: { icon: any; text: string; linkUrl: string }) => {
    if (!config) return;
    const newItem: NavbarPromotionItem = template
      ? {
          id: `msg_${Date.now()}`,
          icon: template.icon,
          text: template.text,
          linkUrl: template.linkUrl,
        }
      : {
          id: `msg_${Date.now()}`,
          icon: "sparkles",
          text: "Nueva promoción exclusiva de Alina Shop",
          linkUrl: "/catalogo",
        };

    setConfig({
      ...config,
      ticker: {
        ...config.ticker,
        messages: [...config.ticker.messages, newItem],
      },
    });
  };

  const handleRemoveTickerMessage = (id: string) => {
    if (!config) return;
    if (config.ticker.messages.length <= 1) {
      alert("Debes mantener al menos un mensaje publicitario en el carrusel.");
      return;
    }
    setConfig({
      ...config,
      ticker: {
        ...config.ticker,
        messages: config.ticker.messages.filter((m) => m.id !== id),
      },
    });
  };

  const handleMoveTickerMessage = (index: number, direction: "up" | "down") => {
    if (!config) return;
    const items = [...config.ticker.messages];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;

    const temp = items[index];
    items[index] = items[targetIdx];
    items[targetIdx] = temp;

    setConfig({
      ...config,
      ticker: {
        ...config.ticker,
        messages: items,
      },
    });
  };

  const handleUpdateTickerItem = (id: string, updates: Partial<NavbarPromotionItem>) => {
    if (!config) return;
    setConfig({
      ...config,
      ticker: {
        ...config.ticker,
        messages: config.ticker.messages.map((m) => (m.id === id ? { ...m, ...updates } : m)),
      },
    });
  };

  if (loading && !config) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-slate-500 text-xs gap-3">
        <RefreshCw className="size-6 text-alina-600 animate-spin" />
        <span>Cargando configuración de publicidad y anuncios...</span>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="p-8 text-center text-red-500 text-xs space-y-3">
        <AlertCircle className="size-6 mx-auto text-red-500" />
        <p>No se pudo cargar la configuración de publicidad.</p>
        <button
          onClick={fetchPromotions}
          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
        >
          Reintentar conexión
        </button>
      </div>
    );
  }

  return (
    <main className="p-4 sm:p-8 space-y-6 max-w-5xl">
      {/* Header Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight flex items-center gap-2.5">
            <Megaphone className="size-6 text-alina-600 shrink-0" />
            <span>Módulo de Publicidad, Pop-ups y Anuncios</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Administra el pop-up de bienvenida al ingresar a la tienda y el carrusel de frases promocionales del Navbar
          </p>
        </div>

        {/* Acciones de Cabecera */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="border border-slate-300 hover:border-slate-400 bg-white text-slate-700 font-bold text-xs py-2.5 px-3.5 rounded-xl flex items-center gap-1.5 transition-all shadow-2xs hover:bg-slate-50"
            title="Ver la tienda en vivo en una pestaña nueva"
          >
            <span>Ver Tienda</span>
            <ExternalLink className="size-3.5 text-slate-400" />
          </Link>

          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            disabled={saving || resetting}
            className="border border-slate-300 hover:border-slate-400 bg-white text-slate-600 hover:text-slate-900 font-bold text-xs py-2.5 px-3 rounded-xl flex items-center gap-1.5 transition-all shadow-2xs hover:bg-slate-50 cursor-pointer disabled:opacity-50"
            title="Restablecer a valores de fábrica"
          >
            <RotateCcw className="size-3.5" />
            <span className="hidden sm:inline">Restablecer</span>
          </button>

          <button
            onClick={() => handleSave()}
            disabled={saving}
            className="bg-slate-900 hover:bg-slate-800 text-white font-display font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all shadow-md cursor-pointer shrink-0 disabled:opacity-50 active:scale-98"
          >
            <Save className="size-4" />
            <span>{saving ? "Guardando..." : "Guardar y Publicar"}</span>
          </button>
        </div>
      </div>

      {/* Alertas de Notificación */}
      {message && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="size-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Pestañas de Navegación */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("popup")}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "popup"
              ? "border-alina-600 text-alina-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Sparkles className="size-4" />
          <span>1. Pop-up de Entrada (Home)</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
              config.popup.enabled ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"
            }`}
          >
            {config.popup.enabled ? "Activo en Tienda" : "Desactivado"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("ticker")}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "ticker"
              ? "border-alina-600 text-alina-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Sliders className="size-4" />
          <span>2. Textos del Navbar (Carrusel)</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
              config.ticker.enabled ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"
            }`}
          >
            {config.ticker.messages.length} frases activas
          </span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* ========================================================= */}
        {/* TAB 1: POP-UP DE BIENVENIDA DEL HOME */}
        {/* ========================================================= */}
        {activeTab === "popup" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Formulario de Configuración del Popup (7 cols) */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="font-display font-bold text-sm text-slate-900">
                    Configuración del Pop-up de Entrada
                  </h2>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Se presenta automáticamente a los clientes que visitan la portada principal
                  </p>
                </div>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={config.popup.enabled}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        popup: { ...config.popup, enabled: e.target.checked },
                      })
                    }
                    className="size-4 text-alina-600 rounded focus:ring-alina-500 cursor-pointer"
                  />
                  <span
                    className={`text-xs font-bold ${
                      config.popup.enabled ? "text-emerald-700" : "text-slate-500"
                    }`}
                  >
                    {config.popup.enabled ? "Pop-up Activo" : "Pop-up Desactivado"}
                  </span>
                </label>
              </div>

              {/* Insignia / Badge */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Insignia Superior (Badge)
                </label>
                <input
                  type="text"
                  value={config.popup.badge || ""}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      popup: { ...config.popup, badge: e.target.value },
                    })
                  }
                  placeholder="Ej: OFERTA MAYORISTA ALINA SHOP"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-alina-600 font-semibold"
                />
              </div>

              {/* Título Principal */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Título Principal del Anuncio
                </label>
                <input
                  type="text"
                  value={config.popup.title || ""}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      popup: { ...config.popup, title: e.target.value },
                    })
                  }
                  placeholder="Ej: ¡Precios de Fábrica en Bases MDF & Toppers!"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-alina-600 font-bold"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Descripción Promocional
                </label>
                <textarea
                  rows={3}
                  value={config.popup.description || ""}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      popup: { ...config.popup, description: e.target.value },
                    })
                  }
                  placeholder="Explica la oferta, porcentajes de descuento por docena, envíos y beneficios..."
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-alina-600 leading-relaxed"
                />
              </div>

              {/* Botón CTA y Enlace */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Texto del Botón CTA
                  </label>
                  <input
                    type="text"
                    value={config.popup.buttonText || ""}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        popup: { ...config.popup, buttonText: e.target.value },
                      })
                    }
                    placeholder="Ej: Ver Catálogo Completo"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-alina-600 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Enlace de Destino (URL)
                  </label>
                  <input
                    type="text"
                    value={config.popup.buttonUrl || ""}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        popup: { ...config.popup, buttonUrl: e.target.value },
                      })
                    }
                    placeholder="/catalogo o WhatsApp"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-alina-600 font-mono"
                  />
                </div>
              </div>

              {/* Selector y Cargador de Imagen */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800">
                    Imagen del Anuncio
                  </label>

                  {config.popup.imageUrl && (
                    <button
                      type="button"
                      onClick={() =>
                        setConfig({
                          ...config,
                          popup: { ...config.popup, imageUrl: "" },
                        })
                      }
                      className="text-[11px] text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="size-3" />
                      <span>Quitar imagen</span>
                    </button>
                  )}
                </div>

                {/* Subir archivo desde dispositivo */}
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileSelect}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-bold py-2 px-3 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Upload className="size-3.5 text-slate-600" />
                    <span>Subir Foto desde PC / Celular</span>
                  </button>

                  <span className="text-[11px] text-slate-400">PNG, JPG, WEBP (máx 2.5MB)</span>
                </div>

                {/* Galería de productos predeterminados de Alina Shop */}
                <div>
                  <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    O selecciona una foto del catálogo oficial Alina Shop:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {CATALOG_PRESETS.map((item) => {
                      const isSelected = config.popup.imageUrl === item.url;
                      return (
                        <button
                          key={item.url}
                          type="button"
                          onClick={() =>
                            setConfig({
                              ...config,
                              popup: { ...config.popup, imageUrl: item.url },
                            })
                          }
                          className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                            isSelected
                              ? "border-alina-600 bg-alina-50/70 ring-2 ring-alina-500/20"
                              : "border-slate-200 hover:border-slate-300 bg-white"
                          }`}
                        >
                          <div className="size-9 bg-slate-50 rounded-lg overflow-hidden border border-slate-100 p-0.5 shrink-0 flex items-center justify-center">
                            <img
                              src={item.url}
                              alt={item.name}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[11px] font-bold text-slate-800 truncate">
                              {item.name}
                            </p>
                            <span className="text-[9px] text-slate-400 block uppercase">
                              {item.category}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Entrada manual de URL */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    O escribe la ruta / URL directa de la imagen:
                  </label>
                  <input
                    type="text"
                    value={config.popup.imageUrl || ""}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        popup: { ...config.popup, imageUrl: e.target.value },
                      })
                    }
                    placeholder="/images/products/bases-mdf/base-mdf-blanco-wengue.png"
                    className="w-full border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-alina-600 font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>

            {/* Vista Previa en Vivo del Pop-up (5 cols) */}
            <div className="lg:col-span-5 space-y-3 sticky top-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Eye className="size-3.5 text-alina-600" />
                  <span>Vista Previa del Pop-up</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowModalPreview(true)}
                  className="text-alina-600 hover:text-alina-700 text-xs font-bold flex items-center gap-1 cursor-pointer bg-alina-50 px-2.5 py-1 rounded-lg hover:bg-alina-100 transition-colors"
                >
                  <Eye className="size-3.5" />
                  <span>Probar en Pantalla Completa</span>
                </button>
              </div>

              {/* Mockup visual a escala */}
              <div className="bg-slate-900/60 p-4 rounded-3xl border border-slate-300 shadow-inner flex items-center justify-center">
                <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-slate-200 relative text-center space-y-3">
                  <div className="absolute top-3 right-3 text-slate-400">
                    <X className="size-4" />
                  </div>

                  {config.popup.badge && (
                    <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-alina-700 bg-alina-50 border border-alina-200 px-2.5 py-0.5 rounded-full">
                      {config.popup.badge}
                    </span>
                  )}

                  {config.popup.imageUrl && (
                    <div className="relative h-28 w-full bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center border border-slate-100 p-1">
                      <img
                        src={config.popup.imageUrl}
                        alt="Preview"
                        className="max-h-full max-w-full object-contain p-1"
                        onError={(e) => {
                          (e.currentTarget.parentElement as HTMLElement)?.classList.add("hidden");
                        }}
                      />
                    </div>
                  )}

                  <h3 className="font-display font-extrabold text-base text-slate-900 leading-tight">
                    {config.popup.title || "Título de la promoción"}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {config.popup.description || "Descripción del anuncio publicitario..."}
                  </p>

                  <div className="pt-1">
                    <div className="w-full bg-alina-600 text-white font-display font-bold py-2.5 px-4 rounded-xl text-xs shadow-md">
                      {config.popup.buttonText || "Aprovechar Oferta"}
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400">
                    No volver a mostrar hoy
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-500 flex items-start gap-2">
                <Info className="size-4 text-slate-400 shrink-0 mt-0.5" />
                <p>
                  Al hacer clic en <strong>"Probar en Pantalla Completa"</strong> podrás verificar las animaciones y el diseño exacto tal como lo experimentarán los visitantes en celulares y computadoras.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: TEXTOS DEL NAVBAR (CARRUSEL/TICKER) */}
        {/* ========================================================= */}
        {activeTab === "ticker" && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-6">
              {/* Encabezado y controles del ticker */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="font-display font-bold text-sm text-slate-900">
                    Carrusel de Textos Promocionales en el Navbar
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Estas frases rotan continuamente en el centro de la barra superior de la tienda
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={config.ticker.enabled}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          ticker: { ...config.ticker, enabled: e.target.checked },
                        })
                      }
                      className="size-4 text-alina-600 rounded focus:ring-alina-500 cursor-pointer"
                    />
                    <span
                      className={`text-xs font-bold ${
                        config.ticker.enabled ? "text-emerald-700" : "text-slate-500"
                      }`}
                    >
                      {config.ticker.enabled ? "Carrusel Activo" : "Carrusel Oculto"}
                    </span>
                  </label>

                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <Clock className="size-3.5 text-slate-400" />
                    <span>Rotar cada:</span>
                    <select
                      value={config.ticker.intervalSeconds}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          ticker: {
                            ...config.ticker,
                            intervalSeconds: Number(e.target.value),
                          },
                        })
                      }
                      className="border border-slate-300 rounded-lg px-2 py-1 text-xs bg-white font-semibold cursor-pointer"
                    >
                      <option value={2}>2 seg (Rápido)</option>
                      <option value={3}>3 seg</option>
                      <option value={4}>4 seg (Recomendado)</option>
                      <option value={5}>5 seg</option>
                      <option value={6}>6 seg</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* VISTA PREVIA EN VIVO DE LA BARRA SUPERIOR */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <Eye className="size-3.5 text-alina-600" />
                    <span>Simulación en Vivo de la Barra Superior de Tienda</span>
                  </span>
                  <span className="text-[11px] text-slate-400">Rotación automática activa</span>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-xl py-2 px-4 shadow-inner flex items-center justify-center min-h-[42px] overflow-hidden">
                  <PromotionTicker
                    customMessages={config.ticker.messages}
                    customInterval={config.ticker.intervalSeconds}
                    customEnabled={config.ticker.enabled}
                  />
                </div>
              </div>

              {/* Plantillas rápidas predefinidas */}
              <div>
                <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Plantillas Rápidas Alina Shop (Clic para agregar frase):
                </span>
                <div className="flex flex-wrap gap-2">
                  {QUICK_TICKER_TEMPLATES.map((tpl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleAddTickerMessage(tpl)}
                      className="text-xs bg-slate-50 hover:bg-alina-50 border border-slate-200 hover:border-alina-300 text-slate-700 hover:text-alina-800 py-1.5 px-2.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus className="size-3 text-alina-600" />
                      <span>{tpl.text.slice(0, 48)}...</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Lista de Mensajes Editables */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Listado de Mensajes en Rotación ({config.ticker.messages.length})</span>
                  <span className="text-[11px] text-slate-400 font-normal">
                    Usa las flechas ⬆️ ⬇️ para cambiar el orden
                  </span>
                </div>

                {config.ticker.messages.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center gap-3 transition-colors"
                  >
                    {/* Controles de orden */}
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="font-mono text-xs font-bold text-slate-400 w-5">
                        #{index + 1}
                      </span>
                      <div className="flex flex-col">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => handleMoveTickerMessage(index, "up")}
                          className="text-slate-400 hover:text-slate-800 disabled:opacity-20 p-0.5 cursor-pointer"
                          title="Mover arriba"
                        >
                          <ChevronUp className="size-3" />
                        </button>
                        <button
                          type="button"
                          disabled={index === config.ticker.messages.length - 1}
                          onClick={() => handleMoveTickerMessage(index, "down")}
                          className="text-slate-400 hover:text-slate-800 disabled:opacity-20 p-0.5 cursor-pointer"
                          title="Mover abajo"
                        >
                          <ChevronDown className="size-3" />
                        </button>
                      </div>
                    </div>

                    {/* Selector de Icono */}
                    <select
                      value={item.icon}
                      onChange={(e) =>
                        handleUpdateTickerItem(item.id, {
                          icon: e.target.value as any,
                        })
                      }
                      className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs bg-white font-semibold cursor-pointer"
                    >
                      <option value="truck">🚚 Envíos / Camión</option>
                      <option value="tag">🏷️ Descuentos / Precios</option>
                      <option value="sparkles">✨ Novedad / Grabado</option>
                      <option value="credit-card">💳 Pagos / Tarjetas</option>
                      <option value="gift">🎁 Regalo / Combo</option>
                    </select>

                    {/* Texto del Mensaje */}
                    <div className="flex-1 min-w-0 w-full">
                      <input
                        type="text"
                        value={item.text}
                        onChange={(e) =>
                          handleUpdateTickerItem(item.id, { text: e.target.value })
                        }
                        placeholder="Texto promocional visible para el cliente..."
                        className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 bg-white font-medium focus:outline-none focus:border-alina-600"
                      />
                    </div>

                    {/* Enlace Opcional */}
                    <div className="w-full sm:w-44">
                      <input
                        type="text"
                        value={item.linkUrl || ""}
                        onChange={(e) =>
                          handleUpdateTickerItem(item.id, { linkUrl: e.target.value })
                        }
                        placeholder="Enlace (/catalogo)"
                        className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 bg-white font-mono focus:outline-none focus:border-alina-600"
                      />
                    </div>

                    {/* Botón Eliminar */}
                    <button
                      type="button"
                      onClick={() => handleRemoveTickerMessage(item.id)}
                      className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                      title="Eliminar este mensaje"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}

                {/* Botón Agregar Mensaje */}
                <button
                  type="button"
                  onClick={() => handleAddTickerMessage()}
                  className="w-full py-3 border-2 border-dashed border-slate-300 hover:border-alina-500 rounded-xl text-xs font-bold text-slate-600 hover:text-alina-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer bg-slate-50/50"
                >
                  <Plus className="size-4" />
                  <span>Agregar Nuevo Mensaje Promocional</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Barra Inferior de Acción */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 className="size-4 text-emerald-600" />
            <span>Los cambios se reflejan en tiempo real en la tienda virtual Alina Shop.</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-slate-900 hover:bg-slate-800 text-white font-display font-bold text-xs py-3 px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg cursor-pointer disabled:opacity-50 active:scale-98"
            >
              <Save className="size-4" />
              <span>{saving ? "Guardando cambios..." : "Guardar y Publicar en Tienda"}</span>
            </button>
          </div>
        </div>
      </form>

      {/* MODAL DE VISTA PREVIA INTERACTIVA COMPLETA */}
      {showModalPreview && (
        <HomePromotionModal
          preview={true}
          previewConfig={config.popup}
          onClosePreview={() => setShowModalPreview(false)}
        />
      )}

      {/* MODAL DE CONFIRMACIÓN DE RESTABLECIMIENTO */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="size-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
              <RotateCcw className="size-6" />
            </div>

            <div className="text-center">
              <h3 className="font-display font-bold text-base text-slate-900">
                ¿Restablecer Publicidad de Fábrica?
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Esto restaurará el Pop-up y las frases del carrusel a las ofertas predeterminadas de Alina Shop.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleResetDefaults}
                disabled={resetting}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm disabled:opacity-50"
              >
                {resetting ? "Restableciendo..." : "Sí, Restablecer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
