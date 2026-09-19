'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Truck, Tag, Sparkles, CreditCard, Gift, ChevronRight } from "lucide-react";
import { NavbarPromotionItem } from "@/lib/promotions-store";

const DEFAULT_MESSAGES: NavbarPromotionItem[] = [
  {
    id: "d1",
    icon: "truck",
    text: "Envíos a todo el Ecuador por Servientrega y LaarCourier",
    linkUrl: "/rastreo",
  },
  {
    id: "d2",
    icon: "tag",
    text: "Por la compra de la docena obtén precios mayoristas de fábrica",
    linkUrl: "/catalogo",
  },
  {
    id: "d3",
    icon: "sparkles",
    text: "Personaliza tus bases MDF con el logo de tu pastelería (+ $0.20)",
    linkUrl: "/catalogo?categoria=bases-mdf",
  },
  {
    id: "d4",
    icon: "credit-card",
    text: "Pagos 100% seguros con tarjetas de crédito / débito y WhatsApp",
    linkUrl: "/checkout",
  },
];

interface PromotionTickerProps {
  customMessages?: NavbarPromotionItem[];
  customInterval?: number;
  customEnabled?: boolean;
}

export function PromotionTicker({
  customMessages,
  customInterval,
  customEnabled,
}: PromotionTickerProps = {}) {
  const isControlled = customMessages !== undefined;
  const [messages, setMessages] = useState<NavbarPromotionItem[]>(customMessages || DEFAULT_MESSAGES);
  const [enabled, setEnabled] = useState(customEnabled ?? true);
  const [intervalSec, setIntervalSec] = useState(customInterval ?? 4);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Si se pasan props controladas (ej. vista previa en admin)
  useEffect(() => {
    if (isControlled) {
      if (customMessages) setMessages(customMessages);
      if (customEnabled !== undefined) setEnabled(customEnabled);
      if (customInterval !== undefined) setIntervalSec(customInterval);
    }
  }, [isControlled, customMessages, customInterval, customEnabled]);

  // Si no está controlado, sincronizar con localStorage y API
  useEffect(() => {
    if (isControlled) return;

    // 1. Carga inmediata desde almacenamiento local
    try {
      const cached = localStorage.getItem("alina_promotions_config");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.ticker) {
          if (parsed.ticker.messages?.length > 0) {
            setMessages(parsed.ticker.messages);
          }
          if (parsed.ticker.enabled !== undefined) {
            setEnabled(parsed.ticker.enabled);
          }
          if (parsed.ticker.intervalSeconds) {
            setIntervalSec(parsed.ticker.intervalSeconds);
          }
        }
      }
    } catch (e) {}

    // 2. Consulta a la API en vivo
    fetch(`/api/admin/promotions?t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.promotions?.ticker) {
          if (data.promotions.ticker.messages?.length > 0) {
            setMessages(data.promotions.ticker.messages);
          }
          setEnabled(data.promotions.ticker.enabled ?? true);
          if (data.promotions.ticker.intervalSeconds) {
            setIntervalSec(data.promotions.ticker.intervalSeconds);
          }
          try {
            localStorage.setItem("alina_promotions_config", JSON.stringify(data.promotions));
          } catch (e) {}
        }
      })
      .catch(() => {});

    // 3. Escuchar evento en vivo
    const handleUpdate = (e: any) => {
      const ticker = e.detail?.ticker;
      if (ticker) {
        if (ticker.messages?.length > 0) {
          setMessages(ticker.messages);
        }
        if (ticker.enabled !== undefined) {
          setEnabled(ticker.enabled);
        }
        if (ticker.intervalSeconds) {
          setIntervalSec(ticker.intervalSeconds);
        }
      }
    };

    window.addEventListener("alina_promotions_updated", handleUpdate);
    return () => {
      window.removeEventListener("alina_promotions_updated", handleUpdate);
    };
  }, [isControlled]);

  useEffect(() => {
    if (!enabled || messages.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, intervalSec * 1000);

    return () => clearInterval(interval);
  }, [enabled, messages.length, intervalSec, isPaused]);

  if (!enabled || messages.length === 0) {
    return null;
  }

  const currentMsg = messages[currentIndex] || messages[0];

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "truck":
        return <Truck className="size-3.5 text-emerald-400 shrink-0" />;
      case "tag":
        return <Tag className="size-3.5 text-amber-400 shrink-0" />;
      case "sparkles":
        return <Sparkles className="size-3.5 text-pink-400 shrink-0" />;
      case "credit-card":
        return <CreditCard className="size-3.5 text-blue-400 shrink-0" />;
      case "gift":
        return <Gift className="size-3.5 text-purple-400 shrink-0" />;
      default:
        return <Sparkles className="size-3.5 text-emerald-400 shrink-0" />;
    }
  };

  const content = (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="flex items-center justify-center gap-2 text-neutral-200 text-xs py-0.5 px-2 hover:text-white transition-all cursor-pointer group"
    >
      {renderIcon(currentMsg.icon)}
      <span className="font-medium tracking-tight truncate max-w-[300px] sm:max-w-lg md:max-w-2xl lg:max-w-4xl transition-all duration-300">
        {currentMsg.text}
      </span>
      {currentMsg.linkUrl && (
        <ChevronRight className="size-3 text-neutral-400 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
      )}
    </div>
  );

  if (currentMsg.linkUrl) {
    return (
      <Link href={currentMsg.linkUrl} className="inline-flex items-center justify-center">
        {content}
      </Link>
    );
  }

  return content;
}
