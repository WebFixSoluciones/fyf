'use client';

import React, { useState } from "react";
import {
  Settings,
  CreditCard,
  MessageCircle,
  Truck,
  CheckCircle2,
  Lock,
  Save,
  Share2
} from "lucide-react";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    // WhatsApp
    whatsappPrimary: "593985890956",
    whatsappSecondary: "593979431238",
    whatsappActive: "593985890956",
    whatsappTemplate: "¡Hola Alina Shop! Deseo realizar este pedido: *{orderNumber}* por un valor de *{total}*.",

    // Redes Sociales Oficiales
    facebookUrl: "https://facebook.com/alinashop.ec",
    instagramUrl: "https://instagram.com/alinashop.ec",
    tiktokUrl: "https://tiktok.com/@alinashop.ec",

    // Payphone
    payphoneAppId: "live_app_alina_shop",
    payphoneClientId: "live_client_alina_shop",
    payphoneToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    payphoneIsSandbox: false,

    // Envíos
    shippingPichincha: 3.50,
    shippingNational: 5.50,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <main className="p-8 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-slate-700" />
          <span>Ajustes de Tienda & Pasarelas</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configuración centralizada de números de WhatsApp receptores, botón Payphone y tarifas de envío
        </p>
      </div>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Ajustes guardados y sincronizados correctamente en la tienda virtual.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Bloque 1: Configuración de WhatsApp */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <h2 className="font-display font-bold text-sm text-slate-900">
              Configuración de Canales de WhatsApp
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
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-alina-600"
              />
              <span className="text-[11px] text-slate-400">Por defecto: 593985890956</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Número de WhatsApp Secundario / Alternativo
              </label>
              <input
                type="text"
                value={settings.whatsappSecondary}
                onChange={(e) => setSettings({ ...settings, whatsappSecondary: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-alina-600"
              />
              <span className="text-[11px] text-slate-400">Por defecto: 593979431238</span>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Número Activo para Recibir los Pedidos de la Tienda
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="radio"
                    name="whatsappActive"
                    value={settings.whatsappPrimary}
                    checked={settings.whatsappActive === settings.whatsappPrimary}
                    onChange={(e) => setSettings({ ...settings, whatsappActive: e.target.value })}
                    className="text-alina-600"
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
                    className="text-alina-600"
                  />
                  <span>Recibir en el Secundario ({settings.whatsappSecondary})</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Bloque 2: Redes Sociales Oficiales */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Share2 className="w-4 h-4 text-blue-600" />
            <h2 className="font-display font-bold text-sm text-slate-900">
              Redes Sociales Oficiales (Facebook, Instagram, TikTok)
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
                placeholder="https://facebook.com/alinashop.ec"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-alina-600"
              />
              <span className="text-[11px] text-slate-400">Por defecto: https://facebook.com/alinashop.ec</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cuenta de Instagram
              </label>
              <input
                type="text"
                value={settings.instagramUrl}
                onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                placeholder="https://instagram.com/alinashop.ec"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-alina-600"
              />
              <span className="text-[11px] text-slate-400">Por defecto: https://instagram.com/alinashop.ec</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cuenta de TikTok
              </label>
              <input
                type="text"
                value={settings.tiktokUrl}
                onChange={(e) => setSettings({ ...settings, tiktokUrl: e.target.value })}
                placeholder="https://tiktok.com/@alinashop.ec"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-alina-600"
              />
              <span className="text-[11px] text-slate-400">Por defecto: https://tiktok.com/@alinashop.ec</span>
            </div>
          </div>
        </div>

        {/* Bloque 3: Pasarela de Pagos Payphone */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <CreditCard className="w-4 h-4 text-alina-600" />
            <h2 className="font-display font-bold text-sm text-slate-900">
              Credenciales Payphone Ecuador (API v3)
            </h2>
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
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-alina-600"
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
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-alina-600"
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
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-alina-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.payphoneIsSandbox}
                  onChange={(e) => setSettings({ ...settings, payphoneIsSandbox: e.target.checked })}
                  className="w-4 h-4 rounded text-alina-600"
                />
                <span>Habilitar Modo Pruebas (Sandbox de Payphone)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Bloque 4: Tarifas de Envío */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Truck className="w-4 h-4 text-slate-700" />
            <h2 className="font-display font-bold text-sm text-slate-900">
              Tarifas Base de Envío (USD)
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
                onChange={(e) => setSettings({ ...settings, shippingPichincha: parseFloat(e.target.value) })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:border-alina-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Envío Nacional (Resto del País por Servientrega/Laar)
              </label>
              <input
                type="number"
                step="0.25"
                value={settings.shippingNational}
                onChange={(e) => setSettings({ ...settings, shippingNational: parseFloat(e.target.value) })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:border-alina-600"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="bg-slate-900 hover:bg-slate-800 text-white font-display font-bold px-6 py-3 rounded-xl text-xs flex items-center gap-2 transition-all shadow-md"
        >
          <Save className="w-4 h-4" />
          <span>Guardar Configuración General</span>
        </button>
      </form>
    </main>
  );
}
