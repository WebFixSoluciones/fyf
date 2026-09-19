import React from "react";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductCustomizer } from "@/components/product/product-customizer";
import { ProductGrid } from "@/components/catalog/product-grid";
import { PRODUCTS_DATA } from "@/lib/catalog-data";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { ComboBanner } from "@/components/home/combo-banner";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = PRODUCTS_DATA.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = PRODUCTS_DATA.filter(
    (candidate) => candidate.categorySlug === product.categorySlug && candidate.slug !== product.slug,
  ).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="mx-auto w-full max-w-[1720px] flex-1 px-3 sm:px-6 lg:px-8 py-3.5 sm:py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-500 mb-3 sm:mb-6 overflow-x-auto scrollbar-none whitespace-nowrap">
          <Link href="/" className="hover:text-slate-900 shrink-0">Inicio</Link>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          <Link href="/catalogo" className="hover:text-slate-900 shrink-0">Tienda</Link>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="text-slate-800 font-semibold truncate max-w-[160px] sm:max-w-xs">{product.name}</span>
        </nav>

        {/* 3-Column Modern E-Commerce Presentation (Gallery | Info & Config & Specs | Sticky Buy Box & Trust) */}
        <ProductCustomizer
          product={product as any}
          layout="three-column"
          gallerySlot={
            <ProductGallery
              mainImage={product.mainImage}
              images={product.images}
              productName={product.name}
            />
          }
        />
      </main>

      <section className="mx-auto w-full max-w-[1720px] px-3 sm:px-6 lg:px-8 pb-8 sm:pb-12">
        <ComboBanner />
      </section>

      {relatedProducts.length > 0 && (
        <section className="border-t border-slate-100 bg-slate-50/60 py-8 sm:py-12">
          <div className="mx-auto w-full max-w-[1720px] px-3 sm:px-6 lg:px-8">
            <div className="mb-7 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Línea de Productos</p>
                <h2 className="mt-1 font-bold text-2xl text-slate-950">Más productos relacionados</h2>
              </div>
              <Link href={`/catalogo?categoria=${product.categorySlug}`} className="hidden items-center gap-1 text-xs sm:text-sm font-bold text-slate-900 hover:text-amber-600 sm:flex transition-colors">
                <span>Ver categoría</span> <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
            <ProductGrid products={relatedProducts} />
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
