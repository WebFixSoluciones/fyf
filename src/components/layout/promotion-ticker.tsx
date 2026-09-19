'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, MapPin, Truck, Clock, ShieldCheck, Tag, Sparkles, CreditCard, Gift } from "lucide-react";
import { NavbarPromotionItem } from "@/lib/promotions-store";

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
  const [currentIdx, setCurrentIdx] = useState(0);

  const defaultNotices = [
    {
      text: "Fabricantes directos de uniformes corporativos e industriales en Ecuador",
      icon: ShieldCheck,
      link: "/catalogo",
    },
    {
      text: "Cotizaciones inmediatas y pedidos a nivel nacional: +593 99 335 8701",
      icon: Phone,
      link: "https://wa.me/593993358701?text=Hola%2C%20deseo%20cotizar%20uniformes",
    },
    {
      text: "Envíos seguros a todo el país | Ropa térmica, ignífuga y calzado certificado",
      icon: Truck,
      link: "/catalogo",
    },
  ];

  const notices = isControlled && customMessages && customMessages.length > 0
    ? customMessages.map((m) => ({
        text: m.text,
        icon: m.icon === "truck" ? Truck : m.icon === "tag" ? Tag : m.icon === "credit-card" ? CreditCard : Sparkles,
        link: m.linkUrl || "/catalogo",
      }))
    : defaultNotices;

  useEffect(() => {
    if (notices.length <= 1) return;
    const intervalTime = (customInterval || 5) * 1000;
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % notices.length);
    }, intervalTime);
    return () => clearInterval(timer);
  }, [notices.length, customInterval]);

  if (customEnabled === false) return null;

  const activeNotice = notices[currentIdx] || notices[0];
  const IconComp = activeNotice.icon;

  return (
    <div className="w-full bg-black text-neutral-300 border-b border-neutral-800 text-[11px] font-normal transition-colors">
      <div className="mx-auto w-[95%] max-w-[1720px] px-4 py-1.5 flex items-center justify-between gap-4">
        {/* Left: Contact info */}
        <div className="hidden md:flex items-center gap-5 text-neutral-400">
          <a
            href="https://wa.me/593993358701"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Phone className="size-3 text-[#ff6600]" />
            <span>+593 99 335 8701</span>
          </a>
          <span className="text-neutral-800">|</span>
          <div className="flex items-center gap-1.5">
            <MapPin className="size-3 text-[#ff6600]" />
            <span>Quito, Ecuador</span>
          </div>
          <span className="text-neutral-800">|</span>
          <div className="flex items-center gap-1.5">
            <Clock className="size-3 text-neutral-400" />
            <span>Lun - Vie 08:00 - 18:00</span>
          </div>
        </div>

        {/* Center: Dynamic Announcement */}
        <div className="flex-1 flex items-center justify-center text-center">
          <Link
            href={activeNotice.link}
            className="inline-flex items-center gap-2 hover:text-[#ff6600] transition-colors truncate max-w-[320px] sm:max-w-md md:max-w-lg"
          >
            <IconComp className="size-3 text-[#ff6600] shrink-0" />
            <span className="truncate">{activeNotice.text}</span>
          </Link>
        </div>

        {/* Right: Quick actions */}
        <div className="hidden sm:flex items-center gap-4 text-neutral-400">
          <Link href="/catalogo" className="hover:text-white transition-colors">
            Catálogo 2026
          </Link>
          <span className="text-neutral-800">|</span>
          <a
            href="https://wa.me/593993358701?text=Hola%2C%20solicito%20asesor%C3%ADa%20comercial"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#ff6600] font-medium hover:underline"
          >
            Asesoría Online
          </a>
        </div>
      </div>
    </div>
  );
}
