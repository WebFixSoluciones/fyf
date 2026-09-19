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
  Store,
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
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        {/* Top Corporate Bar */}
        <PromotionTicker />

        {/* Main Navbar: 85% width */}
        <div className="mx-auto w-[85%] max-w-[1500px]">
          <div className="flex h-18 sm:h-20 items-center justify-between gap-4 lg:gap-8">
            {/* 1. Left: Logo FYF (Clicking goes to Home) */}
            <div className="flex items-center shrink-0">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-slate-200 shadow-xs bg-white shrink-0 group-hover:scale-105 transition-transform duration-200">
                  <Image
                    src="/logo.jpg"
                    alt="FYF Uniformes"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-base sm:text-lg font-semibold tracking-tight text-slate-950 uppercase leading-none font-sans">
                    FYF UNIFORMES
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-medium tracking-wider text-slate-500 uppercase mt-1">
                    Ropa de Trabajo
                  </span>
                </div>
              </Link>
            </div>

            {/* 2. Center: Centered Navigation (Categorías + Tienda) and Search */}
            <div className="hidden lg:flex items-center justify-center gap-6 flex-1 max-w-2xl mx-auto">
              {/* Categorías Dropdown Button */}
              <div className="relative" ref={megaMenuRef}>
                <button
                  type="button"
                  onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-[13px] font-medium text-slate-800 hover:text-black hover:bg-slate-100/80 border border-slate-200/80 transition-all"
                  aria-label="Ver Categorías"
                >
                  <LayoutGrid className="size-4 text-[#ff6600] shrink-0" />
                  <span>Categorías</span>
                  <ChevronDown className={`size-3.5 text-slate-500 transition-transform duration-200 ${megaMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {megaMenuOpen && (
                  <div className="absolute top-full left-0 mt-3 w-80 rounded-2xl bg-white border border-slate-200 shadow-xl p-3 grid grid-cols-1 gap-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-2 py-1 text-[11px] font-medium text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                      Todas las Categorías
                    </div>
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
                        <span className="text-xs font-medium uppercase tracking-wider text-slate-800">
                          {cat.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Tienda Link */}
              <Link
                href="/catalogo"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-[13px] font-medium text-slate-800 hover:text-black hover:bg-slate-100/80 border border-slate-200/80 transition-all"
              >
                <Store className="size-4 text-[#ff6600] shrink-0" />
                <span>Tienda</span>
              </Link>

              {/* Centered Search Bar */}
              <div className="relative flex-1" ref={searchContainerRef}>
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    placeholder="Buscar en la tienda..."
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setIsSearchFocused(true);
                    }}
                    onFocus={() => setIsSearchFocused(true)}
                    className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-300 rounded-full pl-9 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#ff6600] focus:ring-1 focus:ring-[#ff6600] transition-colors"
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
                            <span className="text-[10px] font-medium text-[#ff6600] uppercase tracking-wider block">
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
                        className="text-xs font-medium text-slate-800 hover:text-black flex items-center justify-center gap-1 w-full"
                      >
                        <span>Ver todos los resultados en Tienda</span>
                        <ArrowRight className="size-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Right: Action Icons (Login Icon + Cart Icon + Mobile Menu) */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Mobile Search Trigger Icon */}
              <div className="lg:hidden relative w-36 sm:w-48">
                <form onSubmit={handleSearchSubmit}>
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-full pl-8 pr-3 py-1.5 text-xs"
                  />
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-slate-400" />
                </form>
              </div>

              {/* ShoppingBag / Cart Trigger Icon */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                aria-label="Abrir Carrito"
                className="relative p-2.5 rounded-full hover:bg-slate-100 text-slate-700 hover:text-slate-950 transition-colors shrink-0"
              >
                <ShoppingBag className="size-5" />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 bg-[#ff6600] text-white text-[10px] font-semibold size-4 rounded-full flex items-center justify-center shadow-xs">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* User / Login Trigger (ONLY THE ICON, opens login modal) */}
              <button
                type="button"
                onClick={() => setLoginModalOpen(true)}
                aria-label="Iniciar Sesión"
                className="p-2.5 rounded-full hover:bg-slate-100 text-slate-700 hover:text-[#ff6600] transition-colors shrink-0"
                title="Mi Cuenta / Iniciar Sesión"
              >
                <User className="size-5" />
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
                href="/catalogo"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-sm font-medium text-slate-900 py-1"
              >
                <Store className="size-4 text-[#ff6600]" />
                <span>Tienda Completa</span>
              </Link>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-2">
                  Categorías
                </span>
                <div className="grid grid-cols-1 gap-2 pl-1">
                  {CATEGORIES_DATA.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/catalogo?categoria=${cat.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 text-xs font-normal text-slate-700 hover:text-black py-1 uppercase tracking-wider"
                    >
                      <div className="relative size-6 rounded-md overflow-hidden bg-slate-100 shrink-0">
                        <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                      </div>
                      <span>{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setLoginModalOpen(true);
                }}
                className="mt-3 flex items-center justify-center gap-2 bg-slate-900 text-white font-medium text-xs py-3 rounded-xl shadow-xs"
              >
                <User className="size-4" />
                <span>Ingresar a Mi Cuenta</span>
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Login Popup Modal */}
      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </>
  );
}
