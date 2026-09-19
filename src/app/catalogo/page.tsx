import React, { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CatalogView } from "@/components/catalog/catalog-view";
import { CATEGORIES_DATA, PRODUCTS_DATA } from "@/lib/catalog-data";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface CatalogoPageProps {
  searchParams: Promise<{ categoria?: string; busqueda?: string }>;
}

export default async function CatalogoPage({ searchParams }: CatalogoPageProps) {
  const { categoria, busqueda } = await searchParams;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 w-[90%] min-w-[80%] max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-slate-900 transition-colors">Inicio</Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <Link href="/catalogo" className="hover:text-slate-900 transition-colors">Tienda Completa</Link>
          {categoria && (
            <>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span className="text-slate-800 font-semibold capitalize">
                {CATEGORIES_DATA.find((c) => c.slug === categoria)?.name || categoria}
              </span>
            </>
          )}
        </nav>

        <Suspense fallback={<div className="py-20 text-center text-xs font-semibold text-slate-400">Cargando tienda...</div>}>
          <CatalogView
            products={PRODUCTS_DATA}
            categories={CATEGORIES_DATA}
            initialCategory={categoria}
            initialSearch={busqueda}
          />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

