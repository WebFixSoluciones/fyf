'use client';

import React, { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Phone,
  Layers,
} from "lucide-react";
import { CATEGORIES_DATA, PRODUCTS_DATA, SeedProduct } from "@/lib/catalog-data";
import { formatCurrency } from "@/lib/utils";
import { PromotionTicker } from "@/components/layout/promotion-ticker";

export function Navbar() {
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
        setMegaMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter search results
  const searchResults = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed || trimmed.length < 2) return [];

    return PRODUCTS_DATA.filter((p) => {
      return (
        p.name.toLowerCase().includes(trimmed) ||
        (p.categoryTag?.toLowerCase() || "").includes(trimmed) ||
        p.description.toLowerCase().includes(trimmed)
      );
    }).slice(0, 6);
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsSearchFocused(false);
      router.push(`/catalogo?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      {/* Top Banner / Ticker */}
      <PromotionTicker />

      {/* Main Navbar */}
      <div className="mx-auto w-[92%] max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between gap-4">
          {/* Logo FYF */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center text-white font-black text-lg tracking-tighter">
                <span className="text-amber-500 font-extrabold text-xl">F</span>
                <span className="text-white font-light text-xs">&</span>
                <span className="text-amber-500 font-extrabold text-xl">F</span>
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-black tracking-wider text-slate-950 leading-none uppercase">
                  FYF UNIFORMES
                </span>
                <span className="text-[10px] font-medium tracking-widest text-slate-500 uppercase mt-0.5">
                  Ropa de Trabajo
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            <Link
              href="/"
              className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-950 transition-colors"
            >
              Inicio
            </Link>

            <Link
              href="/catalogo"
              className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-950 transition-colors"
            >
              Catálogo
            </Link>

            {/* Categories Dropdown */}
            <div className="relative" ref={megaMenuRef}>
              <button
                type="button"
                onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-950 transition-colors"
              >
                <span>Líneas de Trabajo</span>
                <ChevronDown className={`size-3.5 transition-transform duration-200 ${megaMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {megaMenuOpen && (
                <div className="absolute top-full left-0 mt-3 w-80 rounded-2xl bg-white border border-slate-200/90 shadow-xl p-3 grid grid-cols-1 gap-1 animate-in fade-in slide-in-from-top-2 duration-150">
                  {CATEGORIES_DATA.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/catalogo?categoria=${cat.slug}`}
                      onClick={() => setMegaMenuOpen(false)}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-slate-950 transition-colors"
                    >
                      <div className="relative size-8 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                        <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                        {cat.name}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/#contacto"
              className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-950 transition-colors"
            >
              Contactos
            </Link>
          </nav>

          {/* Search Bar & Actions */}
          <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-xs sm:max-w-sm justify-end">
            {/* Search Input Container */}
            <div className="relative w-full" ref={searchContainerRef}>
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Buscar uniformes, botas, térmicos..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setIsSearchFocused(true);
                  }}
                  onFocus={() => setIsSearchFocused(true)}
                  className="w-full bg-slate-50/80 hover:bg-slate-100/80 focus:bg-white border border-slate-200/90 rounded-full pl-9 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 transition-colors"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none" />
              </form>

              {/* Autocomplete Dropdown */}
              {isSearchFocused && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in duration-100">
                  <div className="p-2 space-y-1">
                    {searchResults.map((item) => (
                      <Link
                        key={item.slug}
                        href={`/producto/${item.slug}`}
                        onClick={() => {
                          setIsSearchFocused(false);
                          setQuery("");
                        }}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        <div className="relative size-10 rounded-lg overflow-hidden bg-white border border-slate-100 shrink-0">
                          <Image src={item.mainImage} alt={item.name} fill className="object-contain p-1" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                            {item.categoryTag || "FYF Uniformes"}
                          </span>
                          <p className="text-xs font-medium text-slate-900 truncate">
                            {item.name}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-slate-100 p-2 text-center bg-slate-50">
                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="text-xs font-bold text-slate-800 hover:text-black flex items-center justify-center gap-1 w-full"
                    >
                      <span>Ver todos los resultados</span>
                      <ArrowRight className="size-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Cart / Quotation Bag Trigger */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label="Abrir Cotizador / Carrito"
              className="relative p-2.5 rounded-full hover:bg-slate-100 text-slate-700 hover:text-slate-950 transition-colors shrink-0"
            >
              <ShoppingBag className="size-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-extrabold size-4 rounded-full flex items-center justify-center shadow-xs">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Abrir Menú"
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-6 py-6 space-y-4 animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col gap-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-bold text-slate-900 py-1"
            >
              Inicio
            </Link>
            <Link
              href="/catalogo"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-bold text-slate-900 py-1"
            >
              Catálogo Completo
            </Link>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Líneas de Trabajo
              </span>
              <div className="grid grid-cols-1 gap-1.5 pl-2">
                {CATEGORIES_DATA.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/catalogo?categoria=${cat.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs font-semibold text-slate-700 hover:text-black py-1 uppercase tracking-wider"
                  >
                    • {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/#contacto"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-bold text-slate-900 py-1 pt-3 border-t border-slate-100"
            >
              Contactos
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
