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
  // Filter products by category according to reference images
  const termicaProducts = PRODUCTS_DATA.filter((p) => p.categorySlug === "ropa-termica").slice(0, 5);
  const ignifugaProducts = PRODUCTS_DATA.filter((p) => p.categorySlug === "ropa-ignifuga").slice(0, 5);
  const jeanProducts = PRODUCTS_DATA.filter((p) => p.categorySlug === "ropa-industrial-trabajo").slice(0, 5);
  const calzadoProducts = PRODUCTS_DATA.filter((p) => p.categorySlug === "calzado-industrial").slice(0, 5);
  const seguridadProducts = PRODUCTS_DATA.filter((p) => p.categorySlug === "implementos-seguridad").slice(0, 5);

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-neutral-900 selection:bg-orange-100 selection:text-orange-900">
      <Navbar />

      <main className="flex-1 w-full">
        {/* 1. Categorías: Explora Nuestras Líneas de Uniformes y Ropa de Trabajo (Imagen 2) */}
        <CategoryGrid />

        {/* 2. Ropa Térmica (Imagen 1 & 2) */}
        <section className="mx-auto w-[95%] max-w-[1720px] px-4 py-8 sm:py-12">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-normal text-neutral-800 tracking-tight">
              Ropa <span className="font-semibold text-black">Térmica</span>
            </h2>
          </div>
          <ProductGrid products={termicaProducts} />
        </section>

        {/* 3. Ropa Ignifuga (Imagen 1) */}
        <section className="mx-auto w-[95%] max-w-[1720px] px-4 py-8 sm:py-12">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-normal text-neutral-800 tracking-tight">
              Ropa <span className="font-semibold text-black">Ignifuga</span>
            </h2>
          </div>
          <ProductGrid products={ignifugaProducts} />
        </section>

        {/* 4. Lo que nos hace DIFERENTES (Imagen 3) */}
        <FeaturesSection />

        {/* 5. Ropa Jean Industrial (Imagen 3) */}
        <section className="mx-auto w-[95%] max-w-[1720px] px-4 py-8 sm:py-12">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-normal text-neutral-800 tracking-tight">
              Ropa Jean <span className="font-semibold text-black">Industrial</span>
            </h2>
          </div>
          <ProductGrid products={jeanProducts} />
        </section>

        {/* 6. Calzado Industrial (Imagen 4) */}
        <section className="mx-auto w-[95%] max-w-[1720px] px-4 py-8 sm:py-12">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-normal text-neutral-800 tracking-tight">
              Calzado <span className="font-semibold text-black">Industrial</span>
            </h2>
          </div>
          <ProductGrid products={calzadoProducts} />
        </section>

        {/* 7. Implementos de Seguridad (Imagen 4) */}
        <section className="mx-auto w-[95%] max-w-[1720px] px-4 py-8 sm:py-12">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-normal text-neutral-800 tracking-tight">
              Implementos de <span className="font-semibold text-black">Seguridad</span>
            </h2>
          </div>
          <ProductGrid products={seguridadProducts} />
        </section>

        {/* 8. CONTÁCTANOS (Imagen 5) */}
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}
