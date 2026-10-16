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
  Eye,
} from "lucide-react";

interface SubModel {
  image: string;
  title: string;
  tag: string;
  price?: string;
  link?: string;
}

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
  priceTag?: string;
  models: SubModel[];
}

const slides: SlideData[] = [
  {
    id: "ropa-termica",
    badge: "Línea Especializada Cuartos Fríos",
    titlePrefix: "Ropa Térmica para ",
    titleHighlight: "Temperaturas Extremas",
    description:
      "Aislamiento multicapa impermeable de alto rendimiento para frigoríficos, cuartos fríos y plantas de alimentos. Protección térmica certificada hasta -20°C.",
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
    mainImage: "/images/products/chompa-combinada-cinta.png",
    floatingBadge: "Aislamiento Certificado -20°C",
    priceTag: "Desde $48.00",
    models: [
      {
        image: "/images/products/chompa-combinada-cinta.png",
        title: "Chompa 3 Capas Reflectiva",
        tag: "Térmica Frío",
        price: "$48.00",
      },
      {
        image: "/images/products/chompa-combinada-cuartos-frios.png",
        title: "Chompa para Cuartos Fríos",
        tag: "Impermeable",
        price: "$45.00",
      },
      {
        image: "/images/products/chavera-azul-rey.png",
        title: "Chavera Thinsulate Azul",
        tag: "Thinsulate 150g",
        price: "$16.50",
      },
      {
        image: "/images/products/chavera-gris.png",
        title: "Chavera Térmica Gris",
        tag: "Ergonómica",
        price: "$16.50",
      },
    ],
  },
  {
    id: "ropa-ignifuga",
    badge: "Seguridad Industrial Certificada",
    titlePrefix: "Overoles & Ropa ",
    titleHighlight: "Ignífuga Retardante",
    description:
      "Confección especializada retardante al fuego con telas 100% algodón FR y costuras reforzadas de aramida para industria petrolera, eléctrica, soldadura y minería.",
    specs: [
      "Cumplimiento de norma NFPA 2112",
      "Cintas reflectivas 3M ignífugas de 2 pulgadas",
      "Costuras con hilo aramida resistente a chispas",
    ],
    primaryCtaText: "Ver Ropa Ignífuga",
    primaryCtaLink: "/catalogo?categoria=ropa-ignifuga",
    secondaryCtaText: "Ver Catálogo Completo",
    secondaryCtaLink: "/catalogo",
    mainImage: "/images/products/overol-ignifugo-cinta.jpg",
    floatingBadge: "Norma NFPA 2112",
    priceTag: "Desde $58.00",
    models: [
      {
        image: "/images/products/overol-ignifugo-cinta.jpg",
        title: "Overol con Cinta Reflectiva",
        tag: "Norma NFPA",
        price: "$58.00",
      },
      {
        image: "/images/products/overol-ignifugo-clasico.jpg",
        title: "Overol Ignífugo Petrolero",
        tag: "100% Algodón FR",
        price: "$52.00",
      },
      {
        image: "/images/products/pantalon-ignifugo-cinta.jpg",
        title: "Pantalón Ignífugo Reflectivo",
        tag: "Tela 8.5 oz",
        price: "$34.00",
      },
      {
        image: "/images/products/pantalon-ignifugo-safari.jpg",
        title: "Pantalón Ignífugo Safari",
        tag: "Bolsillos Cargo",
        price: "$36.00",
      },
    ],
  },
  {
    id: "ropa-industrial-jean",
    badge: "Resistencia Extrema · Línea Pesada",
    titlePrefix: "Ropa de Trabajo Jean ",
    titleHighlight: "100% Algodón Prelavado",
    description:
      "Pantalones, camisas denim y capuchas confeccionadas en denim pesado de 14 oz con triples costuras y remaches de refuerzo. Máxima durabilidad en obra y taller.",
    specs: [
      "Denim industrial de alta densidad 14 oz",
      "Triples costuras de seguridad en tiro y costados",
      "Modelos ergonómicos para hombre y dama",
    ],
    primaryCtaText: "Ver Ropa Jean Industrial",
    primaryCtaLink: "/catalogo?categoria=ropa-industrial-trabajo",
    secondaryCtaText: "Cotizar por WhatsApp",
    secondaryCtaLink:
      "https://wa.me/593993358701?text=%C2%A1Hola%20FYF%20Uniformes!%20Deseo%20cotizar%20ropa%20jean%20industrial%20de%20trabajo.",
    mainImage: "/images/products/pantalon-jean-hombre.png",
    floatingBadge: "Denim Pesado 14 oz",
    priceTag: "Desde $22.00",
    models: [
      {
        image: "/images/products/pantalon-jean-hombre.png",
        title: "Pantalón Jean Hombre 14 oz",
        tag: "Triple Costura",
        price: "$22.00",
      },
      {
        image: "/images/products/pantalon-jean-mujer.png",
        title: "Pantalón Jean Stretch Mujer",
        tag: "Denim Stretch",
        price: "$22.00",
      },
      {
        image: "/images/products/blusa-jean-cinta.png",
        title: "Blusa Jean con Cinta Reflectiva",
        tag: "Alta Visibilidad",
        price: "$24.50",
      },
      {
        image: "/images/products/capucha-jean.jpg",
        title: "Capucha Jean para Soldador",
        tag: "Protección Chispas",
        price: "$8.50",
      },
    ],
  },
  {
    id: "calzado-industrial",
    badge: "Calzado de Seguridad Dieléctrico",
    titlePrefix: "Botines de Seguridad & ",
    titleHighlight: "Calzado Industrial",
    description:
      "Botines ergonómicos dieléctricos certificados hasta 14.000 voltios. Punteras de composite libres de metal o acero, suelas de poliuretano antideslizante bidensidad.",
    specs: [
      "Aislamiento dieléctrico certificado a 14 kV",
      "Punteras de protección composite livianas",
      "Cuero legítimo hidrofugado resistente a hidrocarburos",
    ],
    primaryCtaText: "Ver Calzado Industrial",
    primaryCtaLink: "/catalogo?categoria=calzado-industrial",
    secondaryCtaText: "Consultar Tallas Disponibles",
    secondaryCtaLink:
      "https://wa.me/593993358701?text=%C2%A1Hola%20FYF%20Uniformes!%20Quisiera%20consultar%20disponibilidad%20de%20calzado%20industrial.",
    mainImage: "/images/products/botin-bompel-bt903cdtc.jpg",
    floatingBadge: "Dieléctrico 14 kV",
    priceTag: "Desde $42.00",
    models: [
      {
        image: "/images/products/botin-bompel-bt903cdtc.jpg",
        title: "Botín Bompel Dieléctrico",
        tag: "Puntera Composite",
        price: "$45.00",
      },
      {
        image: "/images/products/botin-bompel-4004-dama.jpg",
        title: "Botín Bompel 4004 Dama",
        tag: "Ergonómico Dama",
        price: "$42.00",
      },
      {
        image: "/images/products/botin-bompel-bt903cdhp.jpg",
        title: "Botín Bompel Nobuck HP",
        tag: "Nobuck Premium",
        price: "$46.00",
      },
      {
        image: "/images/products/botin-bompel-bt903elgi.jpg",
        title: "Botín Elástico sin Cordones",
        tag: "Calce Rápido",
        price: "$43.00",
      },
    ],
  },
  {
    id: "implementos-seguridad",
    badge: "Protección Personal Certificada",
    titlePrefix: "Implementos de Seguridad & ",
    titleHighlight: "EPP Certificado Delta Plus",
    description:
      "Careta de soldar termoformada con visor abatible, respiradores de media cara doble filtro, guantes de nitrilo resistente a químicos y guantes de poliuretano Plux.",
    specs: [
      "Protección respiratoria con filtros para vapores y partículas",
      "Guantes de alta destreza y agarre con certificación",
      "Equipos de marcas certificadas Delta Plus y Plux",
    ],
    primaryCtaText: "Ver Implementos de Seguridad",
    primaryCtaLink: "/catalogo?categoria=implementos-seguridad",
    secondaryCtaText: "Cotizar Dotación por Mayor",
    secondaryCtaLink:
      "https://wa.me/593993358701?text=%C2%A1Hola%20FYF%20Uniformes!%20Deseo%20cotizar%20implementos%20de%20seguridad%20industrial.",
    mainImage: "/images/products/mascara-soldar-screen.png",
    floatingBadge: "Certificación Delta Plus",
    priceTag: "Desde $2.20",
    models: [
      {
        image: "/images/products/mascara-soldar-screen.png",
        title: "Máscara para Soldar Screen",
        tag: "Visor Abatible",
        price: "$18.00",
      },
      {
        image: "/images/products/mascara-media-cara.png",
        title: "Máscara Media Cara 2 Filtros",
        tag: "Gases y Polvo",
        price: "$22.00",
      },
      {
        image: "/images/products/guantes-quimicos-nitrilo.png",
        title: "Guante Químico de Nitrilo",
        tag: "Grasas y Ácidos",
        price: "$4.80",
      },
      {
        image: "/images/products/guante-nylon-poliuretano.png",
        title: "Guante Nylon Poliuretano",
        tag: "Destreza Fina",
        price: "$2.20",
      },
    ],
  },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [activeThumb, setActiveThumb] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setActiveThumb(null);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveThumb(null);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 7000);
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

  // Selected image from thumbnail or fallback to slide mainImage
  const currentModel = activeThumb !== null && slide.models[activeThumb]
    ? slide.models[activeThumb]
    : null;

  const displayImage = currentModel ? currentModel.image : slide.mainImage;
  const displayTitle = currentModel ? currentModel.title : (slide.titlePrefix + slide.titleHighlight);
  const displayBadge = currentModel ? currentModel.tag : slide.floatingBadge;
  const displayPrice = currentModel ? currentModel.price : slide.priceTag;

  return (
    <section 
      aria-label="Destacados FYF Uniformes" 
      className="w-full bg-neutral-950 border-b border-neutral-800 relative overflow-hidden text-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Subtle background ambient light */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#FF841D]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-neutral-800/40 rounded-full blur-3xl pointer-events-none" />

      {/* Slide Content Container: 95% content width for reading balance */}
      <div className="mx-auto w-[95%] max-w-[1720px]">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center px-4 py-8 sm:py-12 lg:py-16 min-h-[520px] lg:min-h-[580px]">
          {/* Left Column: Information & Actions */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-5 sm:space-y-6">
            {/* Category / Badge Pill */}
            <div className="inline-flex items-center gap-2 self-start rounded-full bg-[#FF841D]/10 border border-[#FF841D]/30 px-3.5 py-1 text-xs font-semibold text-[#FF841D] tracking-wider uppercase">
              <span className="size-1.5 rounded-full bg-[#FF841D] animate-pulse" />
              <span>{slide.badge}</span>
            </div>

            {/* Title (High contrast, minimalist) */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-white leading-[1.18] transition-all duration-300">
              {slide.titlePrefix}
              <span className="text-[#FF841D] font-semibold">{slide.titleHighlight}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-neutral-300 font-normal leading-relaxed max-w-xl">
              {slide.description}
            </p>

            {/* Technical Highlights / Specs */}
            <ul className="space-y-2 pt-1 sm:pt-2">
              {slide.specs.map((spec, idx) => (
                <li key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-neutral-300 font-normal">
                  <span className="size-4.5 rounded-full bg-[#FF841D]/15 border border-[#FF841D]/40 flex items-center justify-center shrink-0">
                    <Check className="size-3 text-[#FF841D]" />
                  </span>
                  <span>{spec}</span>
                </li>
              ))}
            </ul>

            {/* Actions / Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2 sm:pt-4">
              <Link
                href={slide.primaryCtaLink}
                className="bg-[#FF841D] hover:bg-[#e57212] active:scale-[0.98] text-white font-medium px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
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
                  <ShieldCheck className="size-4 text-[#FF841D]" />
                )}
                <span>{slide.secondaryCtaText}</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Showcase Stage with Product Gallery */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center space-y-3.5 w-full">
            {/* Main Showcase Image Container - Full garment visibility (No cropping) */}
            <div className="relative aspect-4/3 sm:aspect-16/11 w-full rounded-2xl overflow-hidden bg-gradient-to-b from-neutral-900 via-neutral-900/90 to-neutral-950 border border-neutral-800 shadow-2xl p-5 flex items-center justify-center group">
              
              {/* Subtle radial stage spotlight */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent pointer-events-none" />

              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  key={displayImage}
                  src={displayImage}
                  alt={displayTitle}
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 480px"
                  className="object-contain p-2 transition-transform duration-500 group-hover:scale-105 drop-shadow-2xl"
                />
              </div>

              {/* Floating Top Badge */}
              <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 z-10 bg-neutral-950/85 backdrop-blur-md border border-neutral-700 px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-[#FF841D]" />
                <span className="text-[11px] sm:text-xs font-semibold text-white">
                  {displayBadge}
                </span>
              </div>

              {/* Floating Price Pill (Top Right) */}
              {displayPrice && (
                <div className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-10 bg-[#FF841D]/90 backdrop-blur-md px-3 py-1 rounded-xl shadow-lg text-[11px] sm:text-xs font-bold text-white">
                  {displayPrice}
                </div>
              )}

              {/* Bottom Image Caption */}
              <div className="absolute bottom-3 left-3 right-3 z-10 bg-neutral-950/80 backdrop-blur-md border border-neutral-800/80 px-3 py-1.5 rounded-xl flex items-center justify-between">
                <span className="text-xs font-medium text-white truncate pr-2">
                  {displayTitle}
                </span>
                <span className="text-[10px] text-neutral-400 font-mono shrink-0 flex items-center gap-1">
                  <Eye className="size-3 text-[#FF841D]" />
                  <span>FYF Oficial</span>
                </span>
              </div>
            </div>

            {/* Models Gallery Selector: 4 thumbnails for this category */}
            <div className="w-full">
              <div className="flex items-center justify-between px-1 mb-1.5 text-[11px]">
                <span className="font-semibold text-neutral-400">Modelos destacados de la línea:</span>
                <span className="text-[#FF841D] text-[10px] font-medium">Toca para previsualizar</span>
              </div>

              <div className="grid grid-cols-4 gap-2 w-full">
                {slide.models.map((mod, idx) => {
                  const isSelected = activeThumb === idx || (activeThumb === null && idx === 0);
                  return (
                    <button
                      key={mod.title}
                      type="button"
                      onClick={() => setActiveThumb(idx)}
                      onMouseEnter={() => setActiveThumb(idx)}
                      className={`relative aspect-square rounded-xl p-1.5 transition-all duration-200 border flex flex-col items-center justify-center overflow-hidden cursor-pointer ${
                        isSelected
                          ? "bg-neutral-800 border-[#FF841D] ring-2 ring-[#FF841D]/50 shadow-md scale-[1.03]"
                          : "bg-neutral-900/80 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/60 opacity-80 hover:opacity-100"
                      }`}
                      aria-label={`Ver modelo ${mod.title}`}
                    >
                      <div className="relative w-full h-full">
                        <Image
                          src={mod.image}
                          alt={mod.title}
                          fill
                          sizes="80px"
                          className="object-contain p-0.5"
                        />
                      </div>
                      <div className="absolute bottom-0 inset-x-0 bg-neutral-950/90 text-[9px] text-neutral-300 font-medium truncate px-1 py-0.5 text-center">
                        {mod.tag}
                      </div>
                    </button>
                  );
                })}
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
                onClick={() => {
                  setActiveThumb(null);
                  setCurrent(idx);
                }}
                aria-label={`Ir al slider ${idx + 1}: ${s.badge}`}
                className={`transition-all duration-300 rounded-full cursor-pointer flex items-center ${
                  current === idx
                    ? "w-8 sm:w-10 h-2 sm:h-2.5 bg-[#FF841D]"
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
