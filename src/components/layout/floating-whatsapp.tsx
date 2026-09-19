'use client';

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function FloatingWhatsapp() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  // Don't display inside admin dashboard
  if (pathname?.startsWith("/admin")) return null;

  const phoneNumber = "593993358701";
  const defaultMessage = "¡Hola FYF Uniformes! Quisiera información y cotización sobre uniformes y ropa de trabajo.";

  const handleClick = () => {
    try {
      fetch("/api/analytics/whatsapp-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "floating_button",
          path: pathname,
        }),
      }).catch(() => {});
    } catch {}

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;
    window.open(url, "_blank");
  };

  return (
    <aside aria-label="Contacto directo por WhatsApp" className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Orange accent tag on top */}
      <div className="mr-3 -mb-1 z-10">
        <span className="inline-block w-8 h-1 bg-[#ea580c] rounded-full shadow-xs" />
      </div>

      <button
        type="button"
        onClick={handleClick}
        aria-label="¿Necesitas un producto? Chatea con un asesor por WhatsApp"
        className="group relative flex items-center gap-2.5 rounded-full bg-[#075e54] hover:bg-[#064d45] text-white px-4 py-2.5 shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-95"
      >
        <svg
          className="w-5 h-5 fill-current shrink-0 text-white"
          viewBox="0 0 24 24"
        >
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.072-2.182-.544-1.745-.722-2.883-2.493-2.97-2.609-.087-.116-.708-.942-.708-1.796 0-.855.449-1.277.608-1.45.16-.174.348-.217.464-.217.116 0 .232.001.333.006.107.005.25.04.391.378.145.348.493 1.202.536 1.29.043.087.072.188.014.304-.058.116-.087.188-.174.289l-.261.304c-.087.101-.179.209-.077.384.101.174.45 0.742.966 1.202.664.591 1.224.774 1.398.861.174.087.29.13.333.203.044.072.044.42-.1.825z" />
          <path d="M12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.435 5.178L2 22l4.981-1.398A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm.031 16.666c-1.353 0-2.628-.396-3.714-1.077l-.266-.164-2.766.726.738-2.695-.18-.287A7.625 7.625 0 014.375 12c0-4.223 3.435-7.658 7.656-7.658 4.22 0 7.655 3.435 7.656 7.658 0 4.223-3.435 7.666-7.656 7.666z" />
        </svg>

        <span className="text-xs sm:text-[13px] font-medium tracking-tight whitespace-nowrap">
          ¿Necesitas un producto?
        </span>
      </button>
    </aside>
  );
}
