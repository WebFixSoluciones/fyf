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
  User,
  LayoutGrid,
  MapPin,
  Store,
  Sparkles,
} from "lucide-react";
import { CATEGORIES_DATA, PRODUCTS_DATA } from "@/lib/catalog-data";
import { PromotionTicker } from "@/components/layout/promotion-ticker";
import { LoginModal } from "@/components/auth/login-modal";

export function Navbar() {
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
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
        p.description.toLowerCase().includes(trimmed) ||
        p.sku.toLowerCase().includes(trimmed)
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
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        {/* Top Corporate Announcement Bar */}
        <PromotionTicker />

        {/* Main Navbar Row: 95% width container */}
        <div className="mx-auto w-[95%] max-w-[1720px]">
          <div className="flex h-18 sm:h-20 items-center justify-between gap-3 sm:gap-6">
            {/* 1. Left: Logo FYF + "Todos nuestros productos ⌵" */}
            <div className="flex items-center gap-3 sm:gap-5 shrink-0">
              {/* Logo (links to Home) */}
              <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
                <div className="relative size-11 sm:size-12 rounded-full overflow-hidden border border-slate-200 shadow-xs bg-white shrink-0 group-hover:scale-105 transition-transform duration-200">
                  <Image
                    src="/logo.jpg"
                    alt="FYF Uniformes"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="hidden sm:flex flex-col justify-center">
                  <span className="text-base sm:text-lg font-semibold tracking-tight text-slate-950 uppercase leading-none font-sans">
                    FYF UNIFORMES
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-medium tracking-wider text-slate-500 uppercase mt-1">
                    Ropa de Trabajo
                  </span>
                </div>
              </Link>

              {/* "Categorías ⌵" Mega Menu Button */}
              <div className="hidden md:block relative" ref={megaMenuRef}>
                <button
                  type="button"
                  onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                  className="flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-slate-100/80 hover:bg-slate-200/70 border border-slate-200/80 text-xs sm:text-[13px] font-medium text-slate-900 transition-all cursor-pointer"
                  aria-label="Categorías"
                >
                  <LayoutGrid className="size-4 text-[#FF841D] shrink-0" />
                  <span>Categorías</span>
                  <ChevronDown
                    className={`size-3.5 text-slate-500 transition-transform duration-200 ${
                      megaMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Mega Menu Dropdown */}
                {megaMenuOpen && (
                  <div className="absolute top-full left-0 mt-2.5 w-[680px] lg:w-[820px] rounded-3xl bg-white border border-slate-200 shadow-2xl p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-100">
                      <h3 className="font-semibold text-sm text-slate-950">
                        Categorías de Productos
                      </h3>
                      <Link
                        href="/catalogo"
                        onClick={() => setMegaMenuOpen(false)}
                        className="text-xs font-semibold text-[#FF841D] hover:text-[#e57212] flex items-center gap-1 transition-colors"
                      >
                        <span>Ver Toda la Tienda</span>
                        <ArrowRight className="size-3.5" />
                      </Link>
                    </div>

                    {/* Grid of Categories */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {CATEGORIES_DATA.map((cat) => (
                        <Link
                          key={cat.slug}
                          href={`/catalogo?categoria=${cat.slug}`}
                          onClick={() => setMegaMenuOpen(false)}
                          className="flex items-center gap-3 p-2.5 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50/60 hover:bg-slate-100/80 transition-all group"
                        >
                          <div className="relative size-11 rounded-xl overflow-hidden bg-white border border-slate-200 shrink-0">
                            <Image
                              src={cat.image}
                              alt={cat.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-900 group-hover:text-[#FF841D] transition-colors block leading-snug">
                              {cat.name}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* Bottom Help / Wholesale Bar inside Mega Menu */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between bg-orange-50/70 rounded-2xl px-4 py-2.5 border border-orange-100">
                      <div className="flex items-center gap-2">
                        <Sparkles className="size-4 text-[#FF841D] shrink-0" />
                        <span className="text-xs text-slate-800 font-medium">
                          ¿Cotizaciones al por mayor o confección con bordado corporativo?
                        </span>
                      </div>
                      <a
                        href="https://wa.me/593993358701?text=%C2%A1Hola%20FYF%20Uniformes!%20Quisiera%20cotizar%20un%20pedido%20corporativo%20por%20mayor."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-[#FF841D] hover:underline flex items-center gap-1 shrink-0"
                      >
                        <span>Contactar Asesor</span>
                        <ArrowRight className="size-3" />
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* "Tienda" Button */}
              <Link
                href="/catalogo"
                className="hidden md:flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-slate-100/80 hover:bg-slate-200/70 border border-slate-200/80 text-xs sm:text-[13px] font-medium text-slate-900 transition-all cursor-pointer shrink-0"
                aria-label="Tienda"
              >
                <Store className="size-4 text-[#FF841D] shrink-0" />
                <span>Tienda</span>
              </Link>
            </div>

            {/* 2. Center: Wide Search Bar */}
            <div
              className="hidden md:flex items-center flex-1 max-w-2xl mx-3 lg:mx-6 relative"
              ref={searchContainerRef}
            >
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <div className="relative flex items-center w-full bg-slate-50 hover:bg-slate-100/70 focus-within:bg-white border border-slate-200/90 focus-within:border-[#FF841D] rounded-2xl transition-all focus-within:ring-2 focus-within:ring-[#FF841D]/10 overflow-hidden">
                  <Search className="size-4 text-slate-400 ml-4 shrink-0 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Buscar uniformes, overoles, ropa térmica, calzado, sku..."
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setIsSearchFocused(true);
                    }}
                    onFocus={() => setIsSearchFocused(true)}
                    className="w-full bg-transparent border-none pl-3 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
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
                          <Image
                            src={item.mainImage}
                            alt={item.name}
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-medium text-[#FF841D] uppercase tracking-wider block">
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
                      className="text-xs font-medium text-slate-800 hover:text-black flex items-center justify-center gap-1 w-full cursor-pointer"
                    >
                      <span>Ver todos los resultados en Tienda</span>
                      <ArrowRight className="size-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Right Actions: [Ingresar] [Rastreo] [Carrito] */}
            <div className="flex items-center gap-3 sm:gap-5 lg:gap-6 shrink-0">
              {/* Ingresar (Icon + Text) */}
              <button
                type="button"
                onClick={() => setLoginModalOpen(true)}
                className="hidden sm:flex items-center gap-2 text-slate-700 hover:text-slate-950 text-xs sm:text-[13px] font-medium transition-colors cursor-pointer group px-2 py-1.5 rounded-xl hover:bg-slate-50"
                title="Mi Cuenta / Iniciar Sesión"
              >
                <User className="size-5 text-slate-600 group-hover:text-[#FF841D] transition-colors shrink-0" />
                <span>Ingresar</span>
              </button>

              {/* Rastreo (Icon + Text) */}
              <Link
                href="/rastreo"
                className="hidden sm:flex items-center gap-2 text-slate-700 hover:text-slate-950 text-xs sm:text-[13px] font-medium transition-colors group px-2 py-1.5 rounded-xl hover:bg-slate-50"
                title="Rastreo de Pedidos"
              >
                <MapPin className="size-5 text-slate-600 group-hover:text-[#FF841D] transition-colors shrink-0" />
                <span>Rastreo</span>
              </Link>

              {/* ShoppingBag / Cart Trigger Icon */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                aria-label="Abrir Carrito"
                className="relative p-2 rounded-xl text-slate-800 hover:text-black hover:bg-slate-100/80 transition-colors cursor-pointer"
              >
                <ShoppingBag className="size-5.5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#FF841D] text-white text-[10px] font-bold size-4.5 rounded-full flex items-center justify-center shadow-xs">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Abrir Menú"
                className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Row (visible on small screens below md) */}
          <div className="md:hidden pb-3 pt-1">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative flex items-center w-full bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                <Search className="size-4 text-slate-400 ml-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Buscar uniformes, calzado, sku..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-transparent border-none pl-2.5 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
            </form>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-5 py-5 space-y-4 animate-in slide-in-from-top-2 duration-150">
            <nav className="flex flex-col gap-3">
              {/* Quick links */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setLoginModalOpen(true);
                  }}
                  className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-medium hover:bg-slate-200"
                >
                  <User className="size-4 text-[#FF841D]" />
                  <span>Ingresar</span>
                </button>

                <Link
                  href="/rastreo"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-medium hover:bg-slate-200"
                >
                  <MapPin className="size-4 text-[#FF841D]" />
                  <span>Rastreo</span>
                </Link>
              </div>

              {/* Categorías */}
              <div className="pt-3 border-t border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Líneas de Trabajo
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {CATEGORIES_DATA.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/catalogo?categoria=${cat.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-1.5 rounded-lg text-xs font-normal text-slate-800 hover:bg-slate-50 uppercase tracking-wider"
                    >
                      <div className="relative size-7 rounded-md overflow-hidden bg-slate-100 shrink-0">
                        <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                      </div>
                      <span>{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                href="/catalogo"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 bg-black hover:bg-neutral-900 text-white font-medium text-xs py-3 rounded-xl shadow-xs transition-colors"
              >
                <Store className="size-4 text-[#FF841D]" />
                <span>Ver Tienda Completa</span>
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Login Popup Modal */}
      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </>
  );
}
