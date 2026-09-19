'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SatelliteCard {
  image: string;
  title: string;
  tag: string;
}

interface SlideData {
  id: string;
  eyebrow: string;
  title: string;
  highlight: string;
  body: string;
  cta: string;
  href: string;
  bgImage: string;
  heroProduct: {
    image: string;
    title: string;
    spec: string;
    badge: string;
  };
  satellites: SatelliteCard[];
  features: string[];
}

const slides: SlideData[] = [
  {
    id: "bases-mdf",
    eyebrow: "Bases de Alta Resistencia",
    title: "La presentación empieza en la ",
    highlight: "base perfecta.",
    body: "Bases MDF 3mm laminadas en blanco, wengue y crudo. Cortes láser exactos y personalizados con el logotipo de tu pastelería para pedidos que vendan solos.",
    cta: "Explorar Bases MDF",
    href: "/catalogo?categoria=bases-mdf",
    bgImage: "/images/slider/bg-bases.jpg",
    heroProduct: {
      image: "/images/products/bases-mdf/base-mdf-personalizada-logo.png",
      title: "Base MDF Personalizada con Logo",
      spec: "MDF 3mm · Acabado Blanco / Wengue",
      badge: "Grabado Láser de Marca",
    },
    satellites: [
      {
        image: "/images/products/bases-disenos/base-diseno-coleccion.png",
        title: "Bases con Ondas & Festón",
        tag: "Colección Diseño",
      },
      {
        image: "/images/products/minibases/minibase-cheesecake-rizada.png",
        title: "Minibases Cheesecake",
        tag: "Monoporción",
      },
      {
        image: "/images/products/bases-rectangulares/base-rectangular-mdf-personalizada.png",
        title: "Bases Rectangulares",
        tag: "Bajo Medida",
      },
    ],
    features: [
      "Corte Láser MDF 3mm",
      "Grabado de Logo (+ $0.20)",
      "Escala Mayorista desde $0.55",
    ],
  },
  {
    id: "toppers",
    eyebrow: "Toppers en Acrílico & Vinil",
    title: "Toppers con brillo, elegancia y ",
    highlight: "personalidad.",
    body: "Transforma cada celebración con toppers en acrílico espejo dorado, oro rosa y plateado. Más de 48 modelos exclusivos para cumpleaños, bodas, aniversarios y bautizos.",
    cta: "Ver Colección de Toppers",
    href: "/catalogo?categoria=toppers",
    bgImage: "/images/slider/bg-toppers.jpg",
    heroProduct: {
      image: "/images/products/toppers/topper-acrilico-espejo-dorado.png",
      title: "Topper Acrílico Espejo Dorado",
      spec: "Acrílico 2mm Alta Densidad · Reutilizable",
      badge: "Efecto Espejo Brillante",
    },
    satellites: [
      {
        image: "/images/products/toppers/topper-acrilico-oro-rosa.png",
        title: "Topper Oro Rosa Espejo",
        tag: "Bodas y Quinceaños",
      },
      {
        image: "/images/products/toppers/topper-mdf-vinil.png",
        title: "Topper Cumpleaños Vinil",
        tag: "Personalizado",
      },
      {
        image: "/images/products/apliques/aplique-acrilico-miniatura-4cm-6cm-01.png",
        title: "Mini Apliques Acrílicos",
        tag: "Detalles 4 a 6 cm",
      },
    ],
    features: [
      "Acrílico Espejo Premium",
      "Dorado · Oro Rosa · Plata",
      "+48 Diseños en Stock",
    ],
  },
  {
    id: "cajas",
    eyebrow: "Cajas de Acetato & Empaques",
    title: "Cajas transparentes que protegen y ",
    highlight: "enamoran.",
    body: "Cajas de acetato cristal rígido de visibilidad total 360° para tortas altas, mini cakes y cajas doradas para cupcakes con base reforzada para entregas seguras.",
    cta: "Explorar Cajas y Empaques",
    href: "/catalogo?categoria=cajas",
    bgImage: "/images/slider/bg-cajas.jpg",
    heroProduct: {
      image: "/images/products/cajas/caja-acetato-tapa-transparente.png",
      title: "Caja Acetato Cristal Visor 360°",
      spec: "Cuerpo Rígido Transparente + Base",
      badge: "Visibilidad Total",
    },
    satellites: [
      {
        image: "/images/products/cajas/caja-cupcakes-dorado-4-servicios.png",
        title: "Caja Cupcakes Dorada",
        tag: "4 Servicios",
      },
      {
        image: "/images/products/cajas/caja-acetato-tapa-blanca.png",
        title: "Caja Acetato Tapa Blanca",
        tag: "Tortas Altas",
      },
      {
        image: "/images/products/cajas/caja-mdf-kit-torta-porta-flores-30x30.png",
        title: "Kit Torta Porta Flores MDF",
        tag: "Edición Especial",
      },
    ],
    features: [
      "Acetato Rígido Cristal",
      "Protección de Transporte",
      "Formatos Altos y Cupcakes",
    ],
  },
  {
    id: "complementos",
    eyebrow: "Herramientas de Precisión",
    title: "Todo lo que necesitas en tu ",
    highlight: "taller pastelero.",
    body: "Boquillas grandes en acero inoxidable, mangas reposteras de silicona de grado alimenticio, peines texturizadores y espátulas de alta durabilidad para trabajar con máxima precisión.",
    cta: "Ver Herramientas y Utensilios",
    href: "/catalogo?categoria=complementos",
    bgImage: "/images/slider/bg-complementos.jpg",
    heroProduct: {
      image: "/images/products/complementos/set-boquillas-grandes-manga-pack10.png",
      title: "Set 10 Boquillas Grandes + Manga",
      spec: "Acero Inoxidable Grado Alimenticio",
      badge: "Set Profesional Taller",
    },
    satellites: [
      {
        image: "/images/products/complementos/set-moldes-figuras-pack12.png",
        title: "Moldes & Figuras Decorativas",
        tag: "Set 12 Piezas",
      },
      {
        image: "/images/products/complementos/esfera-decorativa-dorado-pack20.png",
        title: "Esferas Decorativas Cake",
        tag: "Pack 20 Unidades",
      },
      {
        image: "/images/products/complementos/cortador-acero-margarita-pack3.png",
        title: "Cortadores de Galletas",
        tag: "Pack 3 Piezas",
      },
    ],
    features: [
      "Acero Inoxidable Grado Alimenticio",
      "Kits Completos para Crema y Fondant",
      "Durabilidad y Precisión",
    ],
  },
];

export function HeroSlider() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeThumb, setActiveThumb] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const slide = slides[activeSlide];

  // Reset thumbnail selection when slide changes
  useEffect(() => {
    setActiveThumb(null);
  }, [activeSlide]);

  const currentSatellite = activeThumb !== null ? slide.satellites[activeThumb] : null;
  const displayItem = currentSatellite
    ? {
        image: currentSatellite.image,
        title: currentSatellite.title,
        spec: currentSatellite.tag,
        badge: currentSatellite.tag,
      }
    : slide.heroProduct;

  // Auto-play timer: 5 segundos continuos automáticos
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [activeSlide, isPaused]);

  const move = (direction: number) => {
    setActiveSlide((current) => (current + direction + slides.length) % slides.length);
  };

  return (
    <section
      className="relative overflow-hidden border-b border-alina-200/80 bg-gradient-to-br from-[#fff2f7] via-[#fdedf4] to-[#fce4ee]"
      aria-label="Promociones destacadas"
    >
      {/* Background Image Layer with crossfade between slides & ambient rosy glow */}
      <div className="absolute inset-0 z-0">
        {/* Ambient pink glow orbs with ~30% logo color opacity */}
        <div className="absolute -top-32 -left-32 size-[500px] rounded-full bg-alina-400/25 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-32 size-[600px] -translate-y-1/2 rounded-full bg-alina-300/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 left-1/3 size-[400px] rounded-full bg-alina-200/40 blur-3xl pointer-events-none" />

        {slides.map((s, idx) => (
          <Image
            key={s.id}
            src={s.bgImage}
            alt=""
            fill
            priority={idx === 0}
            sizes="100vw"
            className={cn(
              "object-cover object-right lg:object-center mix-blend-multiply transition-opacity duration-1000 pointer-events-none",
              activeSlide === idx ? "opacity-35" : "opacity-0"
            )}
          />
        ))}
        {/* Soft rosy gradient masks ensuring high text contrast while preserving the brand pink tint */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#fff2f7] via-[#fff2f7]/90 to-transparent lg:via-[#fff2f7]/85 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#fce4ee]/70 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Main Content Grid with 80% min width */}
      <div className="relative z-10 mx-auto grid w-[90%] min-w-[80%] max-w-[1720px] grid-cols-1 items-center gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:py-16">
        
        {/* Left Column: Copy & Actions */}
        <div key={slide.id} className="lg:col-span-6 space-y-6 animate-in fade-in slide-in-from-left-2 duration-500">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-alina-200 bg-white/95 px-3.5 py-1.5 text-xs font-bold text-alina-700 shadow-2xs backdrop-blur-sm">
            <Sparkles className="size-3.5 text-alina-500 shrink-0" aria-hidden="true" />
            <span>{slide.eyebrow}</span>
          </div>

          {/* Heading */}
          <div aria-live="polite">
            <h1 className="max-w-xl text-balance font-display text-4xl font-bold leading-[1.12] text-slate-950 sm:text-5xl lg:text-6xl tracking-tight">
              {slide.title}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-alina-600 via-rose-600 to-amber-600">
                {slide.highlight}
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-pretty text-sm sm:text-base leading-relaxed text-slate-600">
              {slide.body}
            </p>
          </div>

          {/* Features Checkpoints */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1">
            {slide.features.map((feat) => (
              <span
                key={feat}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white/90 border border-slate-200/80 px-2.5 py-1 rounded-lg shadow-2xs"
              >
                <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                <span>{feat}</span>
              </span>
            ))}
          </div>

          {/* Action CTAs */}
          <div
            className="flex flex-wrap items-center gap-3 pt-2"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <Link
              href={slide.href}
              className="inline-flex items-center gap-2 rounded-xl bg-alina-600 px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-alina-600/25 transition-all hover:bg-alina-700 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{slide.cta}</span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/catalogo"
              className="rounded-xl border border-slate-300 bg-white/80 px-5 py-3.5 text-sm font-bold text-slate-800 transition-colors hover:border-alina-300 hover:text-alina-700 backdrop-blur-xs"
            >
              Ver toda la tienda
            </Link>
          </div>

          {/* Slider Controls */}
          <div
            className="flex items-center gap-4 pt-4"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => move(-1)}
                aria-label="Promoción anterior"
                className="flex size-9 items-center justify-center rounded-full border border-slate-300 bg-white/90 text-slate-700 transition-all hover:border-alina-400 hover:text-alina-700 hover:scale-105 shadow-2xs cursor-pointer"
              >
                <ChevronLeft className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => move(1)}
                aria-label="Siguiente promoción"
                className="flex size-9 items-center justify-center rounded-full border border-slate-300 bg-white/90 text-slate-700 transition-all hover:border-alina-400 hover:text-alina-700 hover:scale-105 shadow-2xs cursor-pointer"
              >
                <ChevronRight className="size-4" aria-hidden="true" />
              </button>
            </div>

            {/* Slide indicators con barra de progreso de tiempo */}
            <div className="flex items-center gap-2" role="tablist" aria-label="Líneas de producto">
              {slides.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={activeSlide === index}
                  aria-label={`Ver diapositiva ${index + 1}: ${item.eyebrow}`}
                  onClick={() => setActiveSlide(index)}
                  className={cn(
                    "relative h-2 rounded-full overflow-hidden transition-all duration-300 cursor-pointer",
                    activeSlide === index
                      ? "w-10 bg-alina-200"
                      : "w-2.5 bg-slate-300 hover:bg-slate-400"
                  )}
                >
                  {activeSlide === index && !isPaused && (
                    <span
                      key={`progress-${activeSlide}`}
                      className="absolute inset-0 bg-alina-600 rounded-full animate-hero-progress"
                    />
                  )}
                  {activeSlide === index && isPaused && (
                    <span className="absolute inset-0 bg-alina-600 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            <span className="text-[11px] font-semibold text-slate-400">
              0{activeSlide + 1} / 0{slides.length}
            </span>
          </div>
        </div>

        {/* Right Column: Vitrina de Producto Destacado + Galería de Modelos (Sin solapamientos) */}
        <div
          key={`showcase-${slide.id}`}
          className="lg:col-span-6 relative flex items-center justify-center animate-in fade-in duration-500 w-full"
        >
          {/* Ambient soft glow aura */}
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-alina-400/20 via-pink-300/15 to-amber-200/20 blur-3xl pointer-events-none" />

          {/* Unified Clean Showcase Card */}
          <div className="relative z-10 w-full max-w-md sm:max-w-lg rounded-3xl border border-white/90 bg-white/95 p-4 sm:p-6 shadow-2xl shadow-pink-500/5 backdrop-blur-md transition-all duration-300">
            
            {/* Header: Badge & Category Indicator */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-alina-50 border border-alina-200/80 px-3 py-1 text-[11px] font-bold text-alina-700 shadow-2xs">
                <Sparkles className="size-3 text-alina-500" />
                <span>{displayItem.badge}</span>
              </div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                Línea {slide.eyebrow}
              </span>
            </div>

            {/* Central Large Product Image Stage */}
            <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full overflow-hidden rounded-2xl bg-gradient-to-b from-slate-50/80 to-white/60 flex items-center justify-center p-4 border border-slate-100/90 group">
              <Image
                src={displayItem.image}
                alt={displayItem.title}
                fill
                sizes="(max-width: 768px) 90vw, 480px"
                className="object-contain p-2 filter drop-shadow-md transition-transform duration-500 group-hover:scale-105"
                priority={activeSlide === 0}
              />
            </div>

            {/* Product Title & Spec */}
            <div className="mt-3.5 px-1">
              <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 leading-tight">
                {displayItem.title}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                {displayItem.spec}
              </p>
            </div>

            {/* Dock de Modelos y Variantes (3 Columnas simétricas, 0 solapamiento) */}
            <div className="mt-4 pt-3.5 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Modelos de la colección
                </span>
                <span className="text-[10px] text-alina-600 font-semibold">
                  Toca para previsualizar
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {slide.satellites.map((sat, idx) => {
                  const isSelected = activeThumb === idx;
                  return (
                    <button
                      key={sat.title}
                      type="button"
                      onMouseEnter={() => setActiveThumb(idx)}
                      onClick={() => setActiveThumb(activeThumb === idx ? null : idx)}
                      className={cn(
                        "flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-xl border text-left transition-all duration-200 cursor-pointer",
                        isSelected
                          ? "bg-alina-50/90 border-alina-300 ring-1 ring-alina-400 shadow-xs"
                          : "bg-slate-50/70 border-slate-200/80 hover:bg-white hover:border-alina-200 hover:shadow-xs"
                      )}
                    >
                      <div className="relative size-8 sm:size-10 rounded-lg bg-white border border-slate-100 overflow-hidden shrink-0 flex items-center justify-center p-0.5">
                        <Image
                          src={sat.image}
                          alt={sat.title}
                          width={40}
                          height={40}
                          className="object-contain size-full"
                        />
                      </div>
                      <div className="min-w-0 flex-1 pr-0.5">
                        <span className="text-[9px] font-bold text-alina-600 uppercase tracking-tight block truncate">
                          {sat.tag}
                        </span>
                        <p className="text-[10px] sm:text-[11px] font-semibold text-slate-800 leading-tight truncate">
                          {sat.title}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

