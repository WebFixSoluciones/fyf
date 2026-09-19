'use client';

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { X, Sparkles, ArrowRight } from "lucide-react";
import { PopupPromotion } from "@/lib/promotions-store";

interface HomePromotionModalProps {
  preview?: boolean;
  previewConfig?: PopupPromotion;
  onClosePreview?: () => void;
}

export function HomePromotionModal({
  preview = false,
  previewConfig,
  onClosePreview,
}: HomePromotionModalProps) {
  const [popup, setPopup] = useState<PopupPromotion | null>(previewConfig || null);
  const [isOpen, setIsOpen] = useState(preview);
  const [dontShowToday, setDontShowToday] = useState(false);

  const applyConfig = useCallback((cfg: PopupPromotion) => {
    setPopup(cfg);
    if (preview) return;

    if (!cfg.enabled) {
      setIsOpen(false);
      return;
    }

    const dismissedTimestamp = localStorage.getItem("alina_home_popup_dismissed");
    const dismissedTime = dismissedTimestamp ? parseInt(dismissedTimestamp, 10) : 0;
    const updateTime = cfg.updatedAt ? new Date(cfg.updatedAt).getTime() : 0;

    // Si la promoción fue actualizada después de que el usuario la descartó, mostrar nuevamente
    const isNewer = updateTime > dismissedTime;
    const isRecentlyDismissed = !isNewer && dismissedTime > 0 && Date.now() - dismissedTime < 24 * 60 * 60 * 1000;

    if (!isRecentlyDismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [preview]);

  useEffect(() => {
    if (preview) {
      if (previewConfig) {
        setPopup(previewConfig);
        setIsOpen(true);
      }
      return;
    }

    // 1. Cargar inmediatamente desde cache local si existe
    try {
      const cached = localStorage.getItem("alina_promotions_config");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.popup) {
          applyConfig(parsed.popup);
        }
      }
    } catch (e) {
      // Ignorar error de parsing local
    }

    // 2. Sincronizar con el servidor en segundo plano
    fetch(`/api/admin/promotions?t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.promotions?.popup) {
          applyConfig(data.promotions.popup);
          try {
            localStorage.setItem("alina_promotions_config", JSON.stringify(data.promotions));
          } catch (e) {}
        }
      })
      .catch(() => {});

    // 3. Escuchar evento en vivo de actualización desde el panel admin
    const handleUpdate = (e: any) => {
      const updated = e.detail?.popup;
      if (updated) {
        applyConfig(updated);
      }
    };

    window.addEventListener("alina_promotions_updated", handleUpdate);
    return () => {
      window.removeEventListener("alina_promotions_updated", handleUpdate);
    };
  }, [preview, previewConfig, applyConfig]);

  const handleClose = () => {
    if (preview) {
      onClosePreview?.();
      setIsOpen(false);
      return;
    }

    if (dontShowToday) {
      localStorage.setItem("alina_home_popup_dismissed", Date.now().toString());
    }
    setIsOpen(false);
  };

  if (!isOpen || !popup || (!preview && !popup.enabled)) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 text-center space-y-4 animate-in zoom-in-95 duration-200">
        {/* Botón Cerrar */}
        <button
          onClick={handleClose}
          className="absolute top-3.5 right-3.5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Cerrar ventana promocional"
        >
          <X className="size-5" />
        </button>

        {/* Badge */}
        {popup.badge && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider text-alina-700 bg-alina-50 border border-alina-200">
            <Sparkles className="size-3 text-alina-600" />
            <span>{popup.badge}</span>
          </div>
        )}

        {/* Imagen del Anuncio */}
        {popup.imageUrl && (
          <div className="relative h-36 sm:h-44 w-full bg-slate-50 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-100 p-2">
            {/* Usamos etiqueta <img> para soportar datos base64, URLs externas y locales sin riesgo de excepciones en next/image */}
            <img
              src={popup.imageUrl}
              alt={popup.title || "Promoción Alina Shop"}
              className="max-h-full max-w-full object-contain p-2 hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                // Si la imagen falla al cargar, ocultar contenedor de imagen limpiamente
                (e.currentTarget.parentElement as HTMLElement)?.classList.add("hidden");
              }}
            />
          </div>
        )}

        {/* Textos */}
        <div>
          <h2 className="font-display font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight leading-snug">
            {popup.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            {popup.description}
          </p>
        </div>

        {/* Botón CTA */}
        <div className="pt-2 space-y-3">
          <Link
            href={popup.buttonUrl || "/catalogo"}
            onClick={handleClose}
            className="w-full bg-alina-600 hover:bg-alina-700 text-white font-display font-bold py-3.5 px-5 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-98"
          >
            <span>{popup.buttonText || "Aprovechar Oferta"}</span>
            <ArrowRight className="size-4" />
          </Link>

          {/* Opción No volver a mostrar (solo visible en tienda real) */}
          {!preview && (
            <label className="flex items-center justify-center gap-2 cursor-pointer text-[11px] text-slate-500 hover:text-slate-800 transition-colors select-none">
              <input
                type="checkbox"
                checked={dontShowToday}
                onChange={(e) => setDontShowToday(e.target.checked)}
                className="size-3.5 rounded text-alina-600 focus:ring-alina-500"
              />
              <span>No volver a mostrar hoy</span>
            </label>
          )}

          {preview && (
            <div className="text-[11px] text-alina-600 font-bold bg-alina-50 rounded-lg py-1 px-2">
              🧪 Modo Vista Previa de Prueba (Admin)
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
