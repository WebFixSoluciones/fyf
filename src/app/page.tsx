'use client';

import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ProductGrid } from "@/components/catalog/product-grid";
import { CategoryGrid } from "@/components/home/category-grid";
import { FeaturesSection } from "@/components/home/features-section";
import { ContactSection } from "@/components/home/contact-section";
import { PRODUCTS_DATA } from "@/lib/catalog-data";

export default function HomePage() {
  // Filter products by category according to images 1-4
  const termicaProducts = PRODUCTS_DATA.filter((p) => p.categorySlug === "ropa-termica").slice(0, 5);
  const ignifugaProducts = PRODUCTS_DATA.filter((p) => p.categorySlug === "ropa-ignifuga").slice(0, 5);
  const jeanProducts = PRODUCTS_DATA.filter((p) => p.categorySlug === "ropa-industrial-trabajo").slice(0, 5);
  const calzadoProducts = PRODUCTS_DATA.filter((p) => p.categorySlug === "calzado-industrial").slice(0, 5);
  const seguridadProducts = PRODUCTS_DATA.filter((p) => p.categorySlug === "implementos-seguridad").slice(0, 5);

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-slate-900 selection:bg-amber-100 selection:text-amber-900">
      <Navbar />

      <main className="flex-1 w-full">
        {/* 1. Explora Nuestras Líneas de Uniformes y Ropa de Trabajo (Imagen 2) */}
        <CategoryGrid />

        {/* 3. Ropa Térmica (Imagen 1 & 2) */}
        <section className="mx-auto w-[92%] max-w-[1440px] px-4 py-8 sm:py-12">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-normal text-slate-900 tracking-tight">
              Ropa <strong className="font-bold text-slate-950">Térmica</strong>
            </h2>
          </div>
          <ProductGrid products={termicaProducts} />
        </section>

        {/* 4. Ropa Ignifuga (Imagen 1) */}
        <section className="mx-auto w-[92%] max-w-[1440px] px-4 py-8 sm:py-12">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-normal text-slate-900 tracking-tight">
              Ropa <strong className="font-bold text-slate-950">Ignifuga</strong>
            </h2>
          </div>
          <ProductGrid products={ignifugaProducts} />
        </section>

        {/* 5. Lo que nos hace DIFERENTES (Imagen 3) */}
        <FeaturesSection />

        {/* 6. Ropa Jean Industrial (Imagen 3) */}
        <section className="mx-auto w-[92%] max-w-[1440px] px-4 py-8 sm:py-12">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-normal text-slate-900 tracking-tight">
              Ropa Jean <strong className="font-bold text-slate-950">Industrial</strong>
            </h2>
          </div>
          <ProductGrid products={jeanProducts} />
        </section>

        {/* 7. Calzado Industrial (Imagen 4) */}
        <section className="mx-auto w-[92%] max-w-[1440px] px-4 py-8 sm:py-12">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-normal text-slate-900 tracking-tight">
              Calzado <strong className="font-bold text-slate-950">Industrial</strong>
            </h2>
          </div>
          <ProductGrid products={calzadoProducts} />
        </section>

        {/* 8. Implementos de Seguridad (Imagen 4) */}
        <section className="mx-auto w-[92%] max-w-[1440px] px-4 py-8 sm:py-12">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-normal text-slate-900 tracking-tight">
              Implementos de <strong className="font-bold text-slate-950">Seguridad</strong>
            </h2>
          </div>
          <ProductGrid products={seguridadProducts} />
        </section>

        {/* 9. CONTÁCTANOS (Imagen 5) */}
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}
