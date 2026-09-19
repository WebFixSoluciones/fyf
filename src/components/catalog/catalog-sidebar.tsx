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
    <aside className={cn("flex flex-col gap-6 text-slate-800 font-sans", className)}>
      {/* Header with Title & Reset */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-200">
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Filtros de Catálogo</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {filteredProductsCount} de {totalProductsCount} productos
          </p>
        </div>

        {activeFiltersCount > 0 && (
          <button
            onClick={onResetFilters}
            type="button"
            className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Limpiar</span>
          </button>
        )}
      </div>

      {/* Categorías Principales */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Líneas de Trabajo
        </h3>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => onFilterChange({ categoria: undefined, subcategoria: undefined })}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors",
              !filters.categoria
                ? "bg-slate-900 text-white font-bold"
                : "text-slate-700 hover:bg-slate-100"
            )}
          >
            <span>Todas las Líneas</span>
            <span className={cn("text-[10px]", !filters.categoria ? "text-amber-400" : "text-slate-400")}>
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
                  "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors",
                  isSelected
                    ? "bg-slate-900 text-white font-bold"
                    : "text-slate-700 hover:bg-slate-100"
                )}
              >
                <span className="truncate pr-2">{cat.name}</span>
                <span className={cn("text-[10px]", isSelected ? "text-amber-400" : "text-slate-400")}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subcategorías dinámicas si una categoría está seleccionada */}
      {currentCategorySubcategories.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
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
                    "w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs text-left transition-colors",
                    isSelected
                      ? "bg-amber-50 text-amber-900 font-bold border border-amber-200"
                      : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <span className="truncate">{sub.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Rangos de Precio */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Rango Estimado
        </h3>
        <div className="space-y-1">
          {PRICE_RANGES.map((range) => {
            const isSelected = (filters.precioRango || "all") === range.id;
            return (
              <button
                key={range.id}
                type="button"
                onClick={() => onFilterChange({ precioRango: range.id })}
                className={cn(
                  "w-full flex flex-col text-left px-3 py-1.5 rounded-lg transition-colors text-xs",
                  isSelected
                    ? "bg-slate-100 text-slate-950 font-bold"
                    : "text-slate-600 hover:bg-slate-50"
                )}
              >
                <span>{range.label}</span>
                {range.desc && <span className="text-[10px] text-slate-400 font-normal">{range.desc}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Corporate Quotation Box */}
      <div className="mt-auto pt-4 border-t border-slate-200">
        <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4 text-center">
          <ShieldCheck className="size-6 text-amber-600 mx-auto mb-2" />
          <h4 className="text-xs font-bold text-slate-900 uppercase">¿Cotización al por Mayor?</h4>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
            Atendemos requerimientos corporativos e industriales con bordado personalizado.
          </p>
          <a
            href="https://wa.me/593993358701?text=Hola%20FYF%20Uniformes,%20deseo%20una%20cotización%20corporativa"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center justify-center gap-1.5 w-full rounded-xl bg-slate-900 hover:bg-black text-white px-3 py-2 text-xs font-bold transition-colors"
          >
            <MessageCircle className="size-3.5" />
            <span>Consultar Asesor</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
