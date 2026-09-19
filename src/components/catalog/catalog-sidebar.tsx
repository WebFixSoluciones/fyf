'use client';

import React from "react";
import { 
  ChevronRight, 
  Check, 
  X, 
  MessageCircle, 
  RotateCcw, 
  ShieldCheck
} from "lucide-react";
import { CATEGORIES_DATA } from "@/lib/catalog-data";
import { cn } from "@/lib/utils";

export interface FilterState {
  categoria?: string;
  subcategoria?: string;
  precioRango?: string;
  conLogo?: boolean;
  aMedida?: boolean;
  busqueda?: string;
  orden?: string;
}

interface CatalogSidebarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  totalProductsCount: number;
  filteredProductsCount: number;
  categoryCounts: Record<string, number>;
  className?: string;
  onCloseMobile?: () => void;
}

// Subcategorías configuradas para cada línea de FYF Uniformes
export const SUBCATEGORIES_CONFIG: Record<string, Array<{ id: string; label: string; matchTerms: string[] }>> = {
  "ropa-termica": [
    { id: "chompas", label: "Chompas Térmicas 3 Capas", matchTerms: ["chompa"] },
    { id: "chaveras", label: "Chaveras y Pasamontañas", matchTerms: ["chavera"] },
  ],
  "ropa-ignifuga": [
    { id: "overoles", label: "Overoles Ignífugos", matchTerms: ["overol"] },
    { id: "pantalones-ign", label: "Pantalones Ignífugos", matchTerms: ["pantalon", "pantalón"] },
  ],
  "ropa-industrial-trabajo": [
    { id: "jeans", label: "Pantalones Jean Trabajo", matchTerms: ["pantalon", "pantalón", "jean"] },
    { id: "blusas", label: "Blusas Denim Clasicas", matchTerms: ["blusa", "camisa"] },
    { id: "capuchas", label: "Capuchas Industriales", matchTerms: ["capucha"] },
  ],
  "calzado-industrial": [
    { id: "bompel", label: "Calzado Bompel", matchTerms: ["bompel", "botin", "botín"] },
  ],
  "implementos-seguridad": [
    { id: "mascaras", label: "Máscaras y Protección Facial", matchTerms: ["mascara", "máscara"] },
    { id: "guantes", label: "Guantes de Nitrilo y Poliuretano", matchTerms: ["guante", "guantes"] },
  ],
};

// Rangos de precio para prendas y equipos industriales
export const PRICE_RANGES = [
  { id: "all", label: "Todos los precios" },
  { id: "under-10", label: "Hasta $10.00", desc: "Guantes y capuchas" },
  { id: "10-to-25", label: "$10.00 — $25.00", desc: "Jeans, blusas y gorros" },
  { id: "25-to-45", label: "$25.00 — $45.00", desc: "Botines y pantalones ignífugos" },
  { id: "over-45", label: "Más de $45.00", desc: "Chompas térmicas y overoles" },
];

export function CatalogSidebar({
  filters,
  onFilterChange,
  onResetFilters,
  totalProductsCount,
  filteredProductsCount,
  categoryCounts,
  className = "",
  onCloseMobile,
}: CatalogSidebarProps) {
  const activeFiltersCount = [
    Boolean(filters.categoria),
    Boolean(filters.subcategoria),
    Boolean(filters.precioRango && filters.precioRango !== "all"),
    Boolean(filters.busqueda),
  ].filter(Boolean).length;

  const currentCategorySubcategories = filters.categoria 
    ? SUBCATEGORIES_CONFIG[filters.categoria] || [] 
    : [];

  return (
    <aside className={cn("flex flex-col gap-5 text-neutral-800 font-sans", className)}>
      {/* Reset button only if filters are active */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center justify-end pb-1 border-b border-neutral-100">
          <button
            onClick={onResetFilters}
            type="button"
            className="text-xs font-medium text-[#FF841D] hover:underline flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Limpiar filtros</span>
          </button>
        </div>
      )}

      {/* Categorías Principales (Sin título redundante) */}
      <div className="space-y-1">
        <button
          type="button"
          onClick={() => onFilterChange({ categoria: undefined, subcategoria: undefined })}
          className={cn(
            "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-left transition-all",
            !filters.categoria
              ? "bg-black text-white font-semibold shadow-xs"
              : "text-neutral-700 hover:bg-neutral-100"
          )}
        >
          <span>Todas las Líneas</span>
          <span className={cn("text-[11px]", !filters.categoria ? "text-[#FF841D] font-semibold" : "text-neutral-400")}>
            {totalProductsCount}
          </span>
        </button>

        {CATEGORIES_DATA.map((cat) => {
          const isSelected = filters.categoria === cat.slug;
          const count = categoryCounts[cat.slug] || 0;

          return (
            <button
              key={cat.slug}
              type="button"
              onClick={() => onFilterChange({ categoria: cat.slug, subcategoria: undefined })}
              className={cn(
                "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-left transition-all",
                isSelected
                  ? "bg-black text-white font-semibold shadow-xs"
                  : "text-neutral-700 hover:bg-neutral-100"
              )}
            >
              <span className="truncate pr-2">{cat.name}</span>
              <span className={cn("text-[11px]", isSelected ? "text-[#FF841D] font-semibold" : "text-neutral-400")}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Subcategorías dinámicas si una categoría está seleccionada */}
      {currentCategorySubcategories.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-neutral-100">
          <h3 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">
            Tipo de Prenda
          </h3>
          <div className="space-y-1">
            {currentCategorySubcategories.map((sub) => {
              const isSelected = filters.subcategoria === sub.id;
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => onFilterChange({ subcategoria: isSelected ? undefined : sub.id })}
                  className={cn(
                    "w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-left transition-colors",
                    isSelected
                      ? "bg-orange-50 text-orange-950 font-medium border border-orange-200"
                      : "text-neutral-600 hover:bg-neutral-50"
                  )}
                >
                  <span className="truncate">{sub.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#FF841D] shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Rangos de Precio (Sin título redundante) */}
      <div className="space-y-1 pt-3 border-t border-neutral-100">
        {PRICE_RANGES.map((range) => {
          const isSelected = (filters.precioRango || "all") === range.id;
          return (
            <button
              key={range.id}
              type="button"
              onClick={() => onFilterChange({ precioRango: range.id })}
              className={cn(
                "w-full flex flex-col text-left px-3.5 py-2 rounded-xl transition-colors text-xs",
                isSelected
                  ? "bg-neutral-100 text-neutral-950 font-semibold"
                  : "text-neutral-600 hover:bg-neutral-50"
              )}
            >
              <span>{range.label}</span>
              {range.desc && <span className="text-[10px] text-neutral-400 font-normal">{range.desc}</span>}
            </button>
          );
        })}
      </div>

      {/* Corporate Quotation Box */}
      <div className="mt-auto pt-4 border-t border-neutral-200">
        <div className="rounded-2xl bg-neutral-50 border border-neutral-200/80 p-4 text-center">
          <ShieldCheck className="size-6 text-[#FF841D] mx-auto mb-2" />
          <h4 className="text-xs font-semibold text-neutral-900 uppercase">¿Cotización al por Mayor?</h4>
          <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">
            Atendemos requerimientos corporativos e industriales con confección y bordado a medida.
          </p>
          <a
            href="https://wa.me/593993358701?text=Hola%20FYF%20Uniformes,%20deseo%20una%20cotización%20corporativa"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center justify-center gap-1.5 w-full rounded-xl bg-black hover:bg-neutral-900 text-white px-3 py-2 text-xs font-medium transition-colors"
          >
            <MessageCircle className="size-3.5" />
            <span>Consultar Asesor</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
