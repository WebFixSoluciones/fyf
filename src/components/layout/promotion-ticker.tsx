'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Megaphone, ChevronRight } from "lucide-react";
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
      text: "Personaliza tus uniformes con el logo de tu empresa por mayor",
      link: "/catalogo?categoria=uniformes-personalizados",
    },
    {
      text: "Fabricantes directos de uniformes corporativos, ropa térmica y calzado industrial",
      link: "/catalogo",
    },
    {
      text: "Envíos y despachos seguros a nivel nacional en todo el Ecuador",
      link: "/catalogo",
    },
  ];

  const notices = isControlled && customMessages && customMessages.length > 0
    ? customMessages.map((m) => ({
        text: m.text,
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

  return (
    <div className="w-full bg-black text-white text-[11px] sm:text-xs font-normal py-2 border-b border-neutral-900 transition-colors">
      <div className="mx-auto w-[95%] max-w-[1720px] px-4 flex items-center justify-center text-center">
        <Link
          href={activeNotice.link}
          className="inline-flex items-center gap-2 hover:text-[#FF841D] transition-colors text-neutral-200 group truncate max-w-full"
        >
          <Megaphone className="size-3.5 text-[#FF841D] shrink-0" />
          <span className="truncate">{activeNotice.text}</span>
          <ChevronRight className="size-3 text-neutral-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
        </Link>
      </div>
    </div>
  );
}
