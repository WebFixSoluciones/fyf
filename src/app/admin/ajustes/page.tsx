'use client';

import React, { useState, useEffect } from "react";
import {
  Settings,
  CreditCard,
  MessageCircle,
  Truck,
  CheckCircle2,
  Lock,
  Save,
  Share2,
  AlertCircle,
  RefreshCw,
  ExternalLink
} from "lucide-react";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [settings, setSettings] = useState({
    // WhatsApp
    whatsappPrimary: "593993358701",
    whatsappSecondary: "593988742584",
    whatsappActive: "593993358701",
    whatsappTemplate: "¡Hola FYF Uniformes! Deseo realizar este pedido: *{orderNumber}* por un valor de *{total}*.",

    // Redes Sociales Oficiales
    facebookUrl: "https://facebook.com/fyfuniformes",
    instagramUrl: "https://instagram.com/fyfuniformes",
    tiktokUrl: "https://tiktok.com/@fyfuniformes",

    // Payphone Ecuador
    payphoneAppId: "live_app_fyf_uniformes",
    payphoneClientId: "live_client_fyf_uniformes",
    payphoneToken: "",
    payphoneIsSandbox: true,

    // Envíos
    shippingPichincha: 3.50,
    shippingNational: 5.50,
  });

  // Cargar configuración actual desde API
  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && data?.settings) {
          const s = data.settings;
          setSettings((prev) => ({
            ...prev,
            whatsappPrimary: s.whatsappPrimary || prev.whatsappPrimary,
            whatsappSecondary: s.whatsappSecondary || prev.whatsappSecondary,
            whatsappActive: s.whatsappActive || s.whatsappActiveNumber || prev.whatsappActive,
            whatsappTemplate: s.whatsappTemplate || prev.whatsappTemplate,
            payphoneAppId: s.payphoneAppId || prev.payphoneAppId,
            payphoneClientId: s.payphoneClientId || prev.payphoneClientId,
            payphoneToken: s.payphoneToken || "",
            payphoneIsSandbox: s.payphoneIsSandbox !== undefined ? Boolean(s.payphoneIsSandbox) : true,
            shippingPichincha: s.shippingPichincha !== undefined ? Number(s.shippingPichincha) : 3.50,
            shippingNational: s.shippingNational !== undefined ? Number(s.shippingNational) : 5.50,
          }));
        }
      })
      .catch((err) => console.warn("Error cargando ajustes:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Error al guardar los ajustes");
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || "Ocurrió un error al guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="p-8 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#FF841D]" />
          <span>Ajustes de Tienda & Pasarela Payphone</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configuración centralizada de números de WhatsApp receptores, pasarela Payphone Ecuador y tarifas de despacho
        </p>
      </div>

      {loading && (
        <div className="bg-slate-50 border border-slate-200 text-slate-600 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
          <RefreshCw className="size-4 animate-spin text-[#FF841D]" />
          <span>Cargando configuración actual de MySQL...</span>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="size-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Ajustes guardados y sincronizados correctamente en la base de datos MySQL de la tienda.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Bloque 1: Configuración de WhatsApp */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
            <h2 className="font-display font-bold text-sm text-slate-900">
              Configuración de Canales de WhatsApp FYF
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Número de WhatsApp Principal (con código 593)
              </label>
              <input
                type="text"
                value={settings.whatsappPrimary}
                onChange={(e) => setSettings({ ...settings, whatsappPrimary: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-[#FF841D]"
              />
              <span className="text-[11px] text-slate-400">Oficial FYF: 593993358701</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Número de WhatsApp Secundario / Alternativo
              </label>
              <input
                type="text"
                value={settings.whatsappSecondary}
                onChange={(e) => setSettings({ ...settings, whatsappSecondary: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-[#FF841D]"
              />
              <span className="text-[11px] text-slate-400">Oficial FYF: 593988742584</span>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Número Activo para Recibir los Pedidos de la Tienda
              </label>
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="radio"
                    name="whatsappActive"
                    value={settings.whatsappPrimary}
                    checked={settings.whatsappActive === settings.whatsappPrimary}
                    onChange={(e) => setSettings({ ...settings, whatsappActive: e.target.value })}
                    className="accent-[#FF841D]"
                  />
                  <span>Recibir en el Principal ({settings.whatsappPrimary})</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="radio"
                    name="whatsappActive"
                    value={settings.whatsappSecondary}
                    checked={settings.whatsappActive === settings.whatsappSecondary}
                    onChange={(e) => setSettings({ ...settings, whatsappActive: e.target.value })}
                    className="accent-[#FF841D]"
                  />
                  <span>Recibir en el Secundario ({settings.whatsappSecondary})</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Bloque 2: Pasarela de Pagos Payphone Ecuador */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#FF841D]" />
              <h2 className="font-display font-bold text-sm text-slate-900">
                Credenciales Pasarela Payphone Ecuador (API v3)
              </h2>
            </div>
            <a
              href="https://live.payphone.com.ec"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-[#FF841D] hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Portal Payphone Developers</span>
              <ExternalLink className="size-3" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                App ID de Payphone
              </label>
              <input
                type="text"
                value={settings.payphoneAppId}
                onChange={(e) => setSettings({ ...settings, payphoneAppId: e.target.value })}
                placeholder="live_app_..."
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-[#FF841D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Client ID de Payphone
              </label>
              <input
                type="text"
                value={settings.payphoneClientId}
                onChange={(e) => setSettings({ ...settings, payphoneClientId: e.target.value })}
                placeholder="live_client_..."
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-[#FF841D]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Token de Autenticación de Payphone (Bearer Token)
              </label>
              <input
                type="password"
                value={settings.payphoneToken}
                onChange={(e) => setSettings({ ...settings, payphoneToken: e.target.value })}
                placeholder="Pega aquí el Token permanente generado en tu consola de Payphone"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-[#FF841D]"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Si no se proporciona un token live, el sistema opera con el simulador seguro para pruebas de checkout.
              </span>
            </div>

            <div className="sm:col-span-2">
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.payphoneIsSandbox}
                  onChange={(e) => setSettings({ ...settings, payphoneIsSandbox: e.target.checked })}
                  className="size-4 rounded accent-[#FF841D]"
                />
                <span>Habilitar Modo Pruebas (Sandbox de Payphone)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Bloque 3: Tarifas de Envío */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Truck className="w-4 h-4 text-slate-700" />
            <h2 className="font-display font-bold text-sm text-slate-900">
              Tarifas Base de Despacho (USD)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Envío Local (Pichincha / Quito)
              </label>
              <input
                type="number"
                step="0.25"
                value={settings.shippingPichincha}
                onChange={(e) => setSettings({ ...settings, shippingPichincha: parseFloat(e.target.value) || 0 })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:border-[#FF841D]"
              />
              <span className="text-[11px] text-slate-400">Por defecto: $3.50</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Envío Nacional (Resto del País por Servientrega/Laar)
              </label>
              <input
                type="number"
                step="0.25"
                value={settings.shippingNational}
                onChange={(e) => setSettings({ ...settings, shippingNational: parseFloat(e.target.value) || 0 })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:border-[#FF841D]"
              />
              <span className="text-[11px] text-slate-400">Por defecto: $5.50</span>
            </div>
          </div>
        </div>

        {/* Bloque 4: Redes Sociales Oficiales FYF */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Share2 className="w-4 h-4 text-[#FF841D]" />
            <h2 className="font-display font-bold text-sm text-slate-900">
              Redes Sociales Oficiales FYF Uniformes
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Página de Facebook
              </label>
              <input
                type="text"
                value={settings.facebookUrl}
                onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                placeholder="https://facebook.com/fyfuniformes"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-[#FF841D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cuenta de Instagram
              </label>
              <input
                type="text"
                value={settings.instagramUrl}
                onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                placeholder="https://instagram.com/fyfuniformes"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-[#FF841D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cuenta de TikTok
              </label>
              <input
                type="text"
                value={settings.tiktokUrl}
                onChange={(e) => setSettings({ ...settings, tiktokUrl: e.target.value })}
                placeholder="https://tiktok.com/@fyfuniformes"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-[#FF841D]"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={saving}
          className="bg-black hover:bg-neutral-800 disabled:opacity-50 text-white font-display font-bold px-6 py-3 rounded-xl text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
        >
          {saving ? (
            <RefreshCw className="size-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{saving ? "Guardando en MySQL..." : "Guardar Configuración General"}</span>
        </button>
      </form>
    </main>
  );
}
