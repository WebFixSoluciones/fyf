"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, Cookie, Settings, Check, X, Info } from "lucide-react";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  savedAt: string;
}

const STORAGE_KEY = "fyf_lopdp_consent_v1";

export function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [analyticsAllowed, setAnalyticsAllowed] = useState(true);
  const [marketingAllowed, setMarketingAllowed] = useState(true);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        // Delay slightly for smooth entrance
        const timer = setTimeout(() => setShowBanner(true), 1000);
        return () => clearTimeout(timer);
      }
    } catch {
      // localStorage disabled or SSR
    }
  }, []);

  const saveConsent = (prefs: { necessary: boolean; analytics: boolean; marketing: boolean }) => {
    try {
      const payload: CookiePreferences = {
        ...prefs,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore
    }
    setShowBanner(false);
    setShowModal(false);
  };

  const handleAcceptAll = () => {
    saveConsent({ necessary: true, analytics: true, marketing: true });
  };

  const handleNecessaryOnly = () => {
    saveConsent({ necessary: true, analytics: false, marketing: false });
  };

  const handleSaveCustom = () => {
    saveConsent({
      necessary: true,
      analytics: analyticsAllowed,
      marketing: marketingAllowed,
    });
  };

  if (!mounted || !showBanner) return null;

  return (
    <>
      {/* Main Cookie Floating Banner */}
      <aside
        aria-label="Consentimiento de Cookies y LOPDP Ecuador"
        className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-5 sm:max-w-lg z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
      >
        <div className="bg-white/95 backdrop-blur-md text-slate-800 rounded-2xl p-5 shadow-2xl border border-pink-200/80 ring-1 ring-black/5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-bold text-slate-900">
                  Protección de Datos & Cookies
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full">
                  Ecuador LOPDP
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                En <strong>FYF Uniformes</strong> tratamos tus datos conforme a la{" "}
                <span className="font-semibold text-slate-800">
                  Ley Orgánica de Protección de Datos Personales (LOPDP) de la República del Ecuador
                </span>
                . Utilizamos cookies técnicas esenciales y de análisis para garantizar la seguridad de tus compras y cotizaciones, recordar tu selección y mejorar tu experiencia.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
            <button
              onClick={() => setShowModal(true)}
              className="text-xs font-semibold text-slate-600 hover:text-pink-600 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Configurar</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleNecessaryOnly}
                className="flex-1 sm:flex-none text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition-colors text-center"
              >
                Solo Necesarias
              </button>
              <button
                onClick={handleAcceptAll}
                className="flex-1 sm:flex-none text-xs font-bold text-white bg-pink-600 hover:bg-pink-700 active:bg-pink-800 px-4 py-2 rounded-xl shadow-md shadow-pink-500/20 transition-all text-center"
              >
                Aceptar Todas
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Preferences Modal */}
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
                  <Cookie className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    Preferencias de Privacidad
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Cumplimiento LOPDP Ecuador (Reg. Oficial Sup. 459)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                aria-label="Cerrar modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-1">
              {/* Strictly Necessary */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    Cookies Técnicas y Esenciales
                    <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">
                      Siempre activas
                    </span>
                  </span>
                  <div className="w-8 h-4 bg-emerald-500 rounded-full flex items-center justify-end px-0.5">
                    <div className="w-3 h-3 rounded-full bg-white shadow-xs" />
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                  Garantizan la navegación, seguridad en pagos con Payphone, funcionamiento del carrito de compras y autenticación de sesiones en Ecuador. No pueden desactivarse.
                </p>
              </div>

              {/* Analytics */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Cookies Analíticas y Rendimiento
                  </span>
                  <button
                    type="button"
                    onClick={() => setAnalyticsAllowed(!analyticsAllowed)}
                    className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
                      analyticsAllowed ? "bg-pink-600" : "bg-slate-300"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                        analyticsAllowed ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                  Nos ayudan a entender de forma anónima cómo navegan los usuarios para optimizar la velocidad y catálogo de repostería.
                </p>
              </div>

              {/* Marketing */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Cookies Publicitarias y Promocionales
                  </span>
                  <button
                    type="button"
                    onClick={() => setMarketingAllowed(!marketingAllowed)}
                    className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
                      marketingAllowed ? "bg-pink-600" : "bg-slate-300"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                        marketingAllowed ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                  Permiten mostrarte ofertas relevantes de moldes, toppers y bases personalizadas acordes a tus preferencias.
                </p>
              </div>

              <div className="p-3 bg-pink-50/70 rounded-xl border border-pink-100 flex items-start gap-2">
                <Info className="w-4 h-4 text-pink-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-pink-900 leading-tight">
                  Tus derechos ARSO (Acceso, Rectificación, Supresión y Oposición) están garantizados bajo la normativa ecuatoriana. Puedes modificar estas opciones en cualquier momento.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                onClick={() => setShowModal(false)}
                className="text-xs font-semibold text-slate-600 hover:text-slate-800 px-4 py-2 rounded-xl hover:bg-slate-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveCustom}
                className="text-xs font-bold text-white bg-slate-900 hover:bg-black px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                Guardar Configuración
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
