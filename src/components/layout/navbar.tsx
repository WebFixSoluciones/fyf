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
  MessageCircle,
} from "lucide-react";
import { CATEGORIES_DATA, PRODUCTS_DATA } from "@/lib/catalog-data";
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
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Corporate Bar */}
      <PromotionTicker />

      {/* Main Navbar */}
      <div className="mx-auto w-[92%] max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 sm:h-20 items-center justify-between gap-4">
          {/* Logo FYF */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-full overflow-hidden border border-slate-200 shadow-xs bg-white shrink-0 group-hover:scale-105 transition-transform duration-200">
                <Image
                  src="/logo.jpg"
                  alt="FYF Uniformes"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-base sm:text-lg font-black tracking-tight text-slate-950 uppercase leading-none font-sans">
                  FYF UNIFORMES
                </span>
                <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-slate-500 uppercase mt-1">
                  Ropa de Trabajo
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            <Link
              href="/"
              className="text-xs sm:text-[13px] font-semibold text-slate-700 hover:text-slate-950 transition-colors uppercase tracking-wider"
            >
              Inicio
            </Link>

            {/* Categories Dropdown */}
            <div className="relative" ref={megaMenuRef}>
              <button
                type="button"
                onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                className="flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold text-slate-700 hover:text-slate-950 transition-colors uppercase tracking-wider"
              >
                <span>Líneas de Trabajo</span>
                <ChevronDown className={`size-3.5 transition-transform duration-200 ${megaMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {megaMenuOpen && (
                <div className="absolute top-full left-0 mt-3 w-80 rounded-2xl bg-white border border-slate-200 shadow-xl p-3 grid grid-cols-1 gap-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {CATEGORIES_DATA.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/catalogo?categoria=${cat.slug}`}
                      onClick={() => setMegaMenuOpen(false)}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-slate-950 transition-colors"
                    >
                      <div className="relative size-9 rounded-lg overflow-hidden bg-slate-100 border border-slate-100 shrink-0">
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
              href="/catalogo"
              className="text-xs sm:text-[13px] font-semibold text-slate-700 hover:text-slate-950 transition-colors uppercase tracking-wider"
            >
              Catálogo
            </Link>

            <Link
              href="/#contacto"
              className="text-xs sm:text-[13px] font-semibold text-slate-700 hover:text-slate-950 transition-colors uppercase tracking-wider"
            >
              Contacto
            </Link>
          </nav>

          {/* Search Bar & Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 flex-1 max-w-xs sm:max-w-md justify-end">
            {/* Search Input Container */}
            <div className="relative w-full max-w-[240px] sm:max-w-xs" ref={searchContainerRef}>
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setIsSearchFocused(true);
                  }}
                  onFocus={() => setIsSearchFocused(true)}
                  className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-full pl-9 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 transition-colors"
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

            {/* WhatsApp Direct Quote Button (Matching fyf.com.ec) */}
            <a
              href="https://wa.me/593993358701?text=Hola%2C%20solicito%20asesor%C3%ADa%20comercial%20para%20uniformes%20FYF"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold px-3.5 py-2 rounded-full shadow-xs transition-all hover:scale-[1.02] active:scale-95 shrink-0"
            >
              <MessageCircle className="size-3.5 fill-current" />
              <span>ASESORÍA</span>
            </a>

            {/* Cart / Quotation Bag Trigger */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label="Abrir Cotizador / Carrito"
              className="relative p-2 rounded-full hover:bg-slate-100 text-slate-700 hover:text-slate-950 transition-colors shrink-0"
            >
              <ShoppingBag className="size-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-black size-4 rounded-full flex items-center justify-center shadow-xs">
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
              <div className="grid grid-cols-1 gap-2 pl-1">
                {CATEGORIES_DATA.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/catalogo?categoria=${cat.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-black py-1 uppercase tracking-wider"
                  >
                    <div className="relative size-6 rounded-md overflow-hidden bg-slate-100 shrink-0">
                      <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                    </div>
                    <span>{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/#contacto"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-bold text-slate-900 py-1 pt-3 border-t border-slate-100"
            >
              Contacto
            </Link>

            <a
              href="https://wa.me/593993358701?text=Hola%2C%20solicito%20asesor%C3%ADa%20comercial%20para%20uniformes%20FYF"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold text-xs py-3 rounded-xl shadow-xs"
            >
              <MessageCircle className="size-4 fill-current" />
              <span>ASESORÍA COMERCIAL WHATSAPP</span>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
