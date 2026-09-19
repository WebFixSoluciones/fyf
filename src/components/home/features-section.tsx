'use client';

import React from "react";
import { HardHat, ShieldCheck, Scissors, Fingerprint } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: HardHat,
      title: "Experiencia Comprobada",
      description:
        "Con 20 años en el mercado, hemos perfeccionado la fabricación de ropa de trabajo y accesorios de seguridad, adaptándonos a las necesidades de cada cliente.",
    },
    {
      icon: ShieldCheck,
      title: "Hecho en Ecuador",
      description:
        "Somos fabricantes ecuatorianos que cumplimos con los más altos estándares de calidad y seguridad internacionales.",
    },
    {
      icon: Scissors,
      title: "Personalización Total",
      description:
        "Ofrecemos soluciones a la medida, adaptadas a las necesidades específicas de tu empresa y sector.",
    },
    {
      icon: Fingerprint,
      title: "Compromiso y Calidad",
      description:
        "Nuestros productos están diseñados para proteger a tus colaboradores, cumpliendo con las normativas de seguridad laboral más exigentes.",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-black text-white py-14 sm:py-20 my-8">
      {/* Background overlay with subtle industrial feel */}
      <div 
        className="absolute inset-0 opacity-15 bg-cover bg-center mix-blend-overlay"
        style={{
          backgroundImage: `url('https://www.fyf.com.ec/wp-content/uploads/2025/04/uniformes-y-ropa-de-trabajo-en-ecuador.jpg')`
        }}
      />
      <div className="absolute inset-0 bg-black/90 backdrop-blur-[2px]" />

      <div className="relative mx-auto w-[95%] max-w-[1720px] px-4">
        {/* Title with left orange line matching Image 3 */}
        <div className="border-l-[3px] border-[#ff6600] pl-4 mb-10 sm:mb-14">
          <span className="block text-xl sm:text-2xl font-light tracking-tight text-neutral-300">
            Lo que nos hace
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white">
            DIFERENTES
          </h2>
        </div>

        {/* 4 Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {features.map((feature, idx) => {
            const IconComponent = feature.icon;
            return (
              <div key={idx} className="flex flex-col items-center text-center sm:items-start sm:text-left">
                {/* Minimalist line icon with circle */}
                <div className="size-12 rounded-full border border-neutral-800 flex items-center justify-center text-white mb-4 bg-neutral-900/60 backdrop-blur-xs">
                  <IconComponent className="size-6 stroke-[1.5] text-[#ff6600]" />
                </div>

                {/* Title */}
                <h3 className="text-base font-medium text-white tracking-tight mb-2">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-[13px] text-neutral-400 leading-relaxed font-normal">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
