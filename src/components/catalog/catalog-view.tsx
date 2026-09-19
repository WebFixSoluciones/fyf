'use client';

import React, { useState, useMemo, useEffect, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { 
  SlidersHorizontal, 
  X, 
  RotateCcw, 
  ArrowUpDown, 
  Package
} from "lucide-react";
import { 
  CatalogSidebar, 
  FilterState, 
  SUBCATEGORIES_CONFIG, 
  PRICE_RANGES 
} from "./catalog-sidebar";
import { ProductGrid } from "./product-grid";
import { QuickViewModal } from "./quick-view-modal";
import { SeedCategory, SeedProduct, CATEGORIES_DATA } from "@/lib/catalog-data";

interface CatalogViewProps {
  products: SeedProduct[];
  categories: SeedCategory[];
  initialCategory?: string;
  initialSearch?: string;
}

export function CatalogView({
  products,
  categories,
  initialCategory,
  initialSearch,
}: CatalogViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Mobile drawer state
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Filter state initialized from props & searchParams
  const [filters, setFilters] = useState<FilterState>({
    categoria: initialCategory || searchParams.get("categoria") || undefined,
    subcategoria: searchParams.get("subcategoria") || undefined,
    precioRango: searchParams.get("precioRango") || "all",
    conLogo: searchParams.get("conLogo") === "true",
    aMedida: searchParams.get("aMedida") === "true",
    busqueda: initialSearch || searchParams.get("busqueda") || "",
    orden: searchParams.get("orden") || "relevancia",
  });

  // Calculate product lowest unit price helper
  const getMinPrice = (p: SeedProduct) => {
    if (!p.variants || p.variants.length === 0) return 0;
    return Math.min(...p.variants.map((v) => Number(v.unitPrice)));
  };

  // Sync state when URL params change externally (e.g. browser back/forward)
  useEffect(() => {
    const cat = searchParams.get("categoria") || undefined;
    const sub = searchParams.get("subcategoria") || undefined;
    const precio = searchParams.get("precioRango") || "all";
    const logo = searchParams.get("conLogo") === "true";
    const medida = searchParams.get("aMedida") === "true";
    const q = searchParams.get("busqueda") || "";
    const ord = searchParams.get("orden") || "relevancia";

    setFilters({
      categoria: cat,
      subcategoria: sub,
      precioRango: precio,
      conLogo: logo,
      aMedida: medida,
      busqueda: q,
      orden: ord,
    });
  }, [searchParams]);

  // Update URL search parameters when filters change
  const updateUrl = (newFilters: FilterState) => {
    const params = new URLSearchParams();
    if (newFilters.categoria) params.set("categoria", newFilters.categoria);
    if (newFilters.subcategoria) params.set("subcategoria", newFilters.subcategoria);
    if (newFilters.precioRango && newFilters.precioRango !== "all") {
      params.set("precioRango", newFilters.precioRango);
    }
    if (newFilters.conLogo) params.set("conLogo", "true");
    if (newFilters.aMedida) params.set("aMedida", "true");
    if (newFilters.busqueda && newFilters.busqueda.trim()) {
      params.set("busqueda", newFilters.busqueda.trim());
    }
    if (newFilters.orden && newFilters.orden !== "relevancia") {
      params.set("orden", newFilters.orden);
    }

    const query = params.toString();
    const targetUrl = query ? `${pathname}?${query}` : pathname;
    
    startTransition(() => {
      router.replace(targetUrl, { scroll: false });
    });
  };

  const handleFilterChange = (partial: Partial<FilterState>) => {
    const updated = { ...filters, ...partial };
    setFilters(updated);
    updateUrl(updated);
  };

  const handleResetFilters = () => {
    const resetState: FilterState = {
      categoria: undefined,
      subcategoria: undefined,
      precioRango: "all",
      conLogo: false,
      aMedida: false,
      busqueda: "",
      orden: "relevancia",
    };
    setFilters(resetState);
    updateUrl(resetState);
  };

  // Filtered & Sorted Products computation
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Category Filter
      if (filters.categoria && p.categorySlug !== filters.categoria) {
        return false;
      }

      // 2. Subcategory Filter
      if (filters.categoria && filters.subcategoria) {
        const config = SUBCATEGORIES_CONFIG[filters.categoria];
        const currentSub = config?.find((s) => s.id === filters.subcategoria);
        if (currentSub) {
          const textToSearch = `${p.slug} ${p.name} ${p.description} ${p.variants.map((v) => `${v.shape} ${v.sizeLabel}`).join(" ")}`.toLowerCase();
          const matches = currentSub.matchTerms.some((term) => textToSearch.includes(term.toLowerCase()));
          if (!matches) return false;
        }
      }

      // 3. Price Range Filter
      if (filters.precioRango && filters.precioRango !== "all") {
        const minPrice = getMinPrice(p);
        if (filters.precioRango === "under-1" && minPrice >= 1.0) return false;
        if (filters.precioRango === "1-to-3" && (minPrice < 1.0 || minPrice > 3.0)) return false;
        if (filters.precioRango === "3-to-6" && (minPrice < 3.0 || minPrice > 6.0)) return false;
        if (filters.precioRango === "over-6" && minPrice <= 6.0) return false;
      }

      // 4. Feature Filters
      if (filters.conLogo && !p.hasLogoOption) return false;
      if (filters.aMedida && !p.allowCustomSize) return false;

      // 5. Search Query
      if (filters.busqueda && filters.busqueda.trim()) {
        const q = filters.busqueda.toLowerCase().trim();
        const matchesQuery =
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      return true;
    });
  }, [products, filters]);

  // Sorting
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (filters.orden === "precio-menor") {
      list.sort((a, b) => getMinPrice(a) - getMinPrice(b));
    } else if (filters.orden === "precio-mayor") {
      list.sort((a, b) => getMinPrice(b) - getMinPrice(a));
    } else if (filters.orden === "nombre") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [filteredProducts, filters.orden]);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      counts[p.categorySlug] = (counts[p.categorySlug] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Active filters count & list for pill badges
  const activeFilters = useMemo(() => {
    const items: Array<{ key: keyof FilterState; label: string; value: any }> = [];

    if (filters.categoria) {
      const cat = categories.find((c) => c.slug === filters.categoria);
      items.push({
        key: "categoria",
        label: cat ? cat.name : filters.categoria,
        value: undefined,
      });
    }

    if (filters.categoria && filters.subcategoria) {
      const subConfig = SUBCATEGORIES_CONFIG[filters.categoria]?.find((s) => s.id === filters.subcategoria);
      items.push({
        key: "subcategoria",
        label: subConfig ? subConfig.label : filters.subcategoria,
        value: undefined,
      });
    }

    if (filters.precioRango && filters.precioRango !== "all") {
      const pConfig = PRICE_RANGES.find((r) => r.id === filters.precioRango);
      items.push({
        key: "precioRango",
        label: pConfig ? pConfig.label : filters.precioRango,
        value: "all",
      });
    }

    if (filters.conLogo) {
      items.push({
        key: "conLogo",
        label: "Con Grabado de Logo",
        value: undefined,
      });
    }

    if (filters.aMedida) {
      items.push({
        key: "aMedida",
        label: "Fabricación a Medida",
        value: undefined,
      });
    }

    if (filters.busqueda && filters.busqueda.trim()) {
      items.push({
        key: "busqueda",
        label: `"${filters.busqueda.trim()}"`,
        value: "",
      });
    }

    return items;
  }, [filters, categories]);

  const currentCategory = categories.find((c) => c.slug === filters.categoria);

  return (
    <div className="w-full">
      {/* HEADER PRINCIPAL DE TIENDA COMPLETA */}
      <div className="mb-6 border-b border-slate-200/80 pb-4">
        <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <h1 className="font-display font-semibold text-lg sm:text-xl text-neutral-900 tracking-tight shrink-0">
            {currentCategory ? currentCategory.name : "Catálogo & Tienda de Uniformes"}
          </h1>
          <span className="hidden sm:inline text-neutral-300 font-normal select-none">—</span>
          <p className="text-xs sm:text-sm text-neutral-500 font-normal leading-relaxed">
            {currentCategory
              ? currentCategory.description
              : "Catálogo oficial de uniformes corporativos, ropa de trabajo, ropa térmica para cuartos fríos, overoles ignífugos y calzado industrial en Ecuador."}
          </p>
        </div>
      </div>

      {/* BARRA DE CONTROL PARA MÓVILES (BOTÓN FILTRAR + ORDENAR) */}
      <div className="lg:hidden flex items-center justify-between gap-3 mb-6 p-3 rounded-xl bg-neutral-50 border border-neutral-200">
        <button
          type="button"
          onClick={() => setIsMobileDrawerOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-white border border-neutral-300 px-3.5 py-2 text-xs font-semibold text-neutral-800 shadow-2xs hover:bg-neutral-50 transition-colors"
        >
          <SlidersHorizontal className="size-4 text-[#FF841D]" />
          <span>Filtros y Categorías</span>
          {activeFilters.length > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-[#FF841D] text-[10px] font-bold text-white">
              {activeFilters.length}
            </span>
          )}
        </button>

        {/* Selector de orden en móvil */}
        <div className="flex items-center gap-1 text-xs">
          <select
            value={filters.orden || "relevancia"}
            onChange={(e) => handleFilterChange({ orden: e.target.value })}
            className="rounded-lg border border-neutral-300 bg-white py-2 px-2.5 text-xs font-medium text-neutral-800 focus:outline-none focus:border-[#FF841D] shadow-2xs"
          >
            <option value="relevancia">Relevancia</option>
            <option value="precio-menor">Menor Precio</option>
            <option value="precio-mayor">Mayor Precio</option>
            <option value="nombre">Nombre A-Z</option>
          </select>
        </div>
      </div>

      {/* LAYOUT PRINCIPAL: BARRA LATERAL (AMPLIADA) + PRODUCTOS (COLUMNA DERECHA) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start">
        {/* BARRA LATERAL EN ESCRITORIO (MÁS ANCHA: 4 COLS EN LG, 3 COLS EN XL/2XL) */}
        <div className="hidden lg:block lg:col-span-4 xl:col-span-3 2xl:col-span-3 lg:sticky lg:top-24">
          <div className="rounded-2xl border border-neutral-200/90 bg-white p-4 sm:p-5 shadow-xs">
            <CatalogSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              totalProductsCount={products.length}
              filteredProductsCount={sortedProducts.length}
              categoryCounts={categoryCounts}
            />
          </div>
        </div>

        {/* COLUMNA DERECHA: BARRA SUPERIOR DE RESULTADOS + PRODUCTOS */}
        <div className="lg:col-span-8 xl:col-span-9 2xl:col-span-9 space-y-6">
          {/* Barra Superior de Control de la Cuadrícula */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 rounded-2xl border border-neutral-200/80 bg-neutral-50/60">
            <div className="text-xs font-medium text-neutral-600">
              Mostrando <strong className="text-neutral-900 font-semibold">{sortedProducts.length}</strong> de{" "}
              {products.length} productos
            </div>

            {/* Selector de Ordenamiento */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-neutral-600">
              <span className="flex items-center gap-1 font-medium text-neutral-700">
                <ArrowUpDown className="size-3.5 text-neutral-500" />
                Ordenar por:
              </span>
              <select
                value={filters.orden || "relevancia"}
                onChange={(e) => handleFilterChange({ orden: e.target.value })}
                className="rounded-xl border border-neutral-300 bg-white py-1.5 px-3 text-xs font-medium text-neutral-800 focus:outline-none focus:border-[#FF841D] shadow-2xs cursor-pointer"
              >
                <option value="relevancia">Más destacados</option>
                <option value="precio-menor">Menor precio primero</option>
                <option value="precio-mayor">Mayor precio primero</option>
                <option value="nombre">Nombre A-Z</option>
              </select>
            </div>
          </div>

          {/* CHIPS DE FILTROS ACTIVOS */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-medium text-slate-500 uppercase mr-1">
                Filtros activos:
              </span>
              {activeFilters.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleFilterChange({ [chip.key]: chip.value })}
                  className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 hover:bg-orange-50 border border-slate-200 hover:border-orange-200 px-3 py-1 text-xs font-medium text-slate-800 hover:text-[#FF841D] transition-colors group shadow-2xs"
                >
                  <span>{chip.label}</span>
                  <X className="size-3 text-slate-400 group-hover:text-[#FF841D]" />
                </button>
              ))}

              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-bold text-alina-600 hover:text-alina-800 ml-1 underline decoration-dotted transition-colors"
              >
                Limpiar todo
              </button>
            </div>
          )}

          {/* CUADRÍCULA DE PRODUCTOS */}
          {sortedProducts.length > 0 ? (
            <ProductGrid products={sortedProducts} />
          ) : (
            <div className="text-center py-20 bg-slate-50/70 rounded-3xl border border-slate-200/80 p-8 space-y-4">
              <div className="mx-auto size-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-2xs">
                <Package className="size-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  No se encontraron productos con estos filtros
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
                  Intenta cambiar el rango de precio, desmarcar subcategorías o limpiar el buscador para ver más artículos.
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 transition-colors shadow-sm"
              >
                <RotateCcw className="size-3.5" />
                <span>Restablecer Filtros</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MODAL / DRAWER LATERAL DESLIZABLE PARA MÓVILES */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileDrawerOpen(false)}
          />

          {/* Drawer Sheet */}
          <div className="relative ml-0 flex h-full w-full max-w-sm flex-col overflow-y-auto bg-white p-5 shadow-2xl z-10">
            <CatalogSidebar
              filters={filters}
              onFilterChange={(p) => {
                handleFilterChange(p);
                // On mobile, if choosing a category or price, we can keep the drawer open or let user close it
              }}
              onResetFilters={() => {
                handleResetFilters();
              }}
              totalProductsCount={products.length}
              filteredProductsCount={sortedProducts.length}
              categoryCounts={categoryCounts}
              onCloseMobile={() => setIsMobileDrawerOpen(false)}
            />

            <div className="mt-8 pt-4 border-t border-neutral-200">
              <button
                type="button"
                onClick={() => setIsMobileDrawerOpen(false)}
                className="w-full rounded-xl bg-black hover:bg-neutral-900 py-3 text-center text-xs font-semibold text-white shadow-md transition-colors"
              >
                Ver {sortedProducts.length} Resultados
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      <QuickViewModal />
    </div>
  );
}
