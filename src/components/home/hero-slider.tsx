'use client';

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Check,
  MessageCircle,
  Sparkles,
} from "lucide-react";

interface SlideData {
  id: string;
  badge: string;
  titlePrefix: string;
  titleHighlight: string;
  description: string;
  specs: string[];
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  mainImage: string;
  floatingBadge: string;
  subProduct: {
    image: string;
    title: string;
    tag: string;
  };
}

const slides: SlideData[] = [
  {
    id: "ropa-termica",
    badge: "Línea Especializada",
    titlePrefix: "Ropa Térmica para ",
    titleHighlight: "Cuartos Fríos",
    description:
      "Aislamiento multicapa de alto rendimiento para frigoríficos y ambientes de temperaturas bajo cero. Protección extrema, confort y durabilidad.",
    specs: [
      "Aislamiento térmico 3 capas impermeable",
      "Resistencia certificada hasta -20°C",
      "Bandas reflectivas de alta visibilidad",
    ],
    primaryCtaText: "Explorar Ropa Térmica",
    primaryCtaLink: "/catalogo?categoria=ropa-termica",
    secondaryCtaText: "Cotizar por WhatsApp",
    secondaryCtaLink:
      "https://wa.me/593993358701?text=%C2%A1Hola%20FYF%20Uniformes!%20Quisiera%20cotizar%20ropa%20t%C3%A9rmica%20para%20cuartos%20fr%C3%ADos.",
    mainImage: "/images/categories/ropa-termica.jpg",
    floatingBadge: "Aislamiento Certificado -20°C",
    subProduct: {
      image: "/images/products/chavera-azul-rey.png",
      title: "Chavera Térmico Thinsulate",
      tag: "Frío Extremo",
    },
  },
  {
    id: "ropa-ignifuga",
    badge: "Seguridad Industrial Certificada",
    titlePrefix: "Overoles & Ropa ",
    titleHighlight: "Ignífuga Certificada",
    description:
      "Confección especializada retardante al fuego con telas 100% algodón FR y costuras reforzadas de aramida para industria petrolera, eléctrica y minera.",
    specs: [
      "Cumplimiento de norma NFPA 2112",
      "Cintas reflectivas 3M retardantes a la flama",
      "Costuras de alta resistencia mecánica",
    ],
    primaryCtaText: "Ver Ropa Ignífuga",
    primaryCtaLink: "/catalogo?categoria=ropa-ignifuga",
    secondaryCtaText: "Ver Catálogo Completo",
    secondaryCtaLink: "/catalogo",
    mainImage: "/images/categories/ropa-ignifuga.jpg",
    floatingBadge: "Norma NFPA 2112",
    subProduct: {
      image: "/images/products/overol-ignifugo-clasico.jpg",
      title: "Overol Ignífugo Petrolero",
      tag: "100% Algodón FR",
    },
  },
  {
    id: "uniformes-calzado",
    badge: "Confección y Dotación",
    titlePrefix: "Uniformes Corporativos & ",
    titleHighlight: "Calzado de Seguridad",
    description:
      "Diseño y confección a la medida con bordado de tu marca corporativa, junto a botines de seguridad dieléctricos con puntera de protección.",
    specs: [
      "Bordado computarizado de alta definición",
      "Calzado dieléctrico con puntera composite",
      "Venta por unidad y escala mayorista",
    ],
    primaryCtaText: "Cotizar Dotación Corporativa",
    primaryCtaLink: "/catalogo?categoria=uniformes-personalizados",
    secondaryCtaText: "Ver Calzado Industrial",
    secondaryCtaLink: "/catalogo?categoria=calzado-industrial",
    mainImage: "/images/categories/calzado-industrial.jpg",
    floatingBadge: "+20 Años de Confección",
    subProduct: {
      image: "/images/products/botin-bompel-bt903cdtc.jpg",
      title: "Botín Bompel Dieléctrico",
      tag: "Puntera Composite",
    },
  },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [nextSlide, isPaused]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevSlide, nextSlide]);

  const slide = slides[current];

  return (
    <section 
      aria-label="Destacados FYF Uniformes" 
      className="w-full bg-neutral-950 border-b border-neutral-800 relative overflow-hidden text-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Subtle background ambient light */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#ff6600]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-neutral-800/40 rounded-full blur-3xl pointer-events-none" />

      {/* Slide Content Container: 95% content width for reading balance */}
      <div className="mx-auto w-[95%] max-w-[1720px]">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center px-4 py-8 sm:py-12 lg:py-16 min-h-[500px] lg:min-h-[560px]">
          {/* Left Column: Information & Actions */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-5 sm:space-y-6">
            {/* Category / Badge Pill */}
            <div className="inline-flex items-center gap-2 self-start rounded-full bg-[#ff6600]/10 border border-[#ff6600]/30 px-3.5 py-1 text-xs font-semibold text-[#ff6600] tracking-wider uppercase">
              <span className="size-1.5 rounded-full bg-[#ff6600] animate-pulse" />
              <span>{slide.badge}</span>
            </div>

            {/* Title (High contrast, minimalist Inter) */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-white leading-[1.18] transition-all duration-300">
              {slide.titlePrefix}
              <span className="text-[#ff6600] font-semibold">{slide.titleHighlight}</span>
            </h1>

            {/* Minimalist Subtitle */}
            <p className="text-sm sm:text-base text-neutral-300 font-normal leading-relaxed max-w-xl">
              {slide.description}
            </p>

            {/* Technical Highlights / Specs */}
            <ul className="space-y-2 pt-1 sm:pt-2">
              {slide.specs.map((spec, idx) => (
                <li key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-neutral-300 font-normal">
                  <span className="size-4.5 rounded-full bg-[#ff6600]/15 border border-[#ff6600]/40 flex items-center justify-center shrink-0">
                    <Check className="size-3 text-[#ff6600]" />
                  </span>
                  <span>{spec}</span>
                </li>
              ))}
            </ul>

            {/* Actions / Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2 sm:pt-4">
              <Link
                href={slide.primaryCtaLink}
                className="bg-[#ff6600] hover:bg-[#ea580c] active:scale-[0.98] text-white font-medium px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
              >
                <span>{slide.primaryCtaText}</span>
                <ArrowRight className="size-4" />
              </Link>

              <Link
                href={slide.secondaryCtaLink}
                target={slide.secondaryCtaLink.startsWith("http") ? "_blank" : "_self"}
                rel={slide.secondaryCtaLink.startsWith("http") ? "noopener noreferrer" : undefined}
                className="bg-neutral-900/90 hover:bg-neutral-800 active:scale-[0.98] text-neutral-200 hover:text-white font-medium px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl border border-neutral-700 hover:border-neutral-600 transition-all text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
              >
                {slide.secondaryCtaLink.includes("wa.me") ? (
                  <MessageCircle className="size-4 text-[#25D366]" />
                ) : (
                  <ShieldCheck className="size-4 text-[#ff6600]" />
                )}
                <span>{slide.secondaryCtaText}</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Showcase Card */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Main Showcase Image Container */}
            <div className="relative aspect-4/3 sm:aspect-16/11 w-full rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl group">
              <Image
                key={slide.id}
                src={slide.mainImage}
                alt={slide.titlePrefix + slide.titleHighlight}
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 40vw"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

              {/* Floating Top Badge */}
              <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 z-10 bg-neutral-950/85 backdrop-blur-md border border-neutral-700 px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-[#ff6600]" />
                <span className="text-[11px] sm:text-xs font-semibold text-white">
                  {slide.floatingBadge}
                </span>
              </div>

              {/* Floating Mini Satellite Card (Bottom Right) */}
              <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-10 max-w-[210px] bg-neutral-950/90 backdrop-blur-md border border-neutral-700/80 p-2.5 rounded-xl shadow-xl flex items-center gap-2.5">
                <div className="size-11 rounded-lg overflow-hidden relative shrink-0 bg-neutral-900 border border-neutral-800">
                  <Image
                    src={slide.subProduct.image}
                    alt={slide.subProduct.title}
                    fill
                    sizes="44px"
                    className="object-contain p-0.5"
                  />
                </div>
                <div className="min-w-0 pr-1">
                  <span className="block text-[9px] font-bold text-[#ff6600] uppercase tracking-wider truncate">
                    {slide.subProduct.tag}
                  </span>
                  <p className="text-[11px] font-medium text-white truncate leading-tight mt-0.5">
                    {slide.subProduct.title}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Controls Bar: Full width border with 95% inner layout */}
      <div className="relative z-10 border-t border-neutral-800/80 bg-neutral-950/80 backdrop-blur-xs py-3.5">
        <div className="mx-auto w-[95%] max-w-[1720px] px-4 flex items-center justify-between">
          {/* Slide Indicator Buttons */}
          <div className="flex items-center gap-2">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrent(idx)}
                aria-label={`Ir al slider ${idx + 1}: ${s.badge}`}
                className={`transition-all duration-300 rounded-full cursor-pointer flex items-center ${
                  current === idx
                    ? "w-8 sm:w-10 h-2 sm:h-2.5 bg-[#ff6600]"
                    : "w-2 sm:w-2.5 h-2 sm:h-2.5 bg-neutral-700 hover:bg-neutral-500"
                }`}
              />
            ))}
            <span className="ml-2.5 text-xs font-mono text-neutral-400 select-none">
              0{current + 1} <span className="text-neutral-600">/ 0{slides.length}</span>
            </span>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Slider anterior"
              className="size-9 rounded-xl border border-neutral-800 bg-neutral-900/80 hover:bg-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
            >
              <ChevronLeft className="size-4.5" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Slider siguiente"
              className="size-9 rounded-xl border border-neutral-800 bg-neutral-900/80 hover:bg-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
            >
              <ChevronRight className="size-4.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
