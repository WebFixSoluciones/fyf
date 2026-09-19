'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { PRODUCTS_DATA, CATEGORIES_DATA, SeedProduct } from "@/lib/catalog-data";
import { formatCurrency } from "@/lib/utils";
import {
  Package,
  Search,
  Plus,
  Edit2,
  UploadCloud,
  Check,
  X,
  Sparkles,
  Sliders,
  DollarSign,
  FileText,
  Layers,
  Trash2
} from "lucide-react";

const STORAGE_KEY = "fyf_admin_products_override";

export default function AdminProductsPage() {
  const [products, setProducts] = useState(PRODUCTS_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Load persisted overrides from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
        }
      }
    } catch (e) {
      console.error("Error loading products from storage", e);
    }
  }, []);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.categorySlug?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.material?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const updated = products.map((p) =>
      p.sku === selectedProduct.sku ? selectedProduct : p
    );
    setProducts(updated);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("Error saving to localStorage", err);
    }

    setSelectedProduct(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedProduct) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/blob/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        setSelectedProduct({ ...selectedProduct, mainImage: data.url });
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <main className="p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-alina-600" />
            <span>Productos de la Tienda & Precios</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Modifica descripciones, especificaciones, variantes de medidas, precios mayoristas y fotografías del catálogo
          </p>
        </div>

        <button
          onClick={() => {
            const newSku = `FYF-${Date.now().toString().slice(-4)}`;
            const newProd: SeedProduct = {
              sku: newSku,
              name: "Nueva Prenda / Uniforme de Trabajo",
              slug: newSku.toLowerCase(),
              description: "Descripción técnica de la nueva prenda de trabajo o equipo industrial...",
              material: "Denim / Algodón Industrial",
              categorySlug: "ropa-industrial-trabajo",
              categoryTag: "ROPA INDUSTRIAL DE TRABAJO",
              mainImage: "/logo.jpg",
              hasLogoOption: true,
              allowCustomSize: true,
              variants: [
                { sizeLabel: "M", unitPrice: 25.00, dozenPrice: 22.00, wholesalePrice: 19.50 },
              ],
            };
            const updated = [newProd, ...products];
            setProducts(updated);
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            } catch {}
            setSelectedProduct(newProd);
          }}
          className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nuevo Producto</span>
        </button>
      </div>

      {/* Search bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, SKU, categoría..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-alina-600 font-medium"
          />
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Mostrando <strong className="text-slate-900">{filtered.length}</strong> de {products.length} productos registrados
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((prod) => {
          const categoryName = CATEGORIES_DATA.find((c) => c.slug === prod.categorySlug)?.name || prod.categorySlug;
          return (
            <div
              key={prod.sku}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:border-alina-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-4 items-start mb-3">
                  <div className="w-16 h-16 bg-slate-50 rounded-xl border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center relative">
                    <Image src={prod.mainImage || "/logo.jpg"} alt={prod.name} fill className="object-contain p-1" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">{prod.sku}</span>
                      <span className="text-[9px] font-bold text-alina-700 bg-alina-50 border border-alina-100 px-1.5 py-0.2 rounded">
                        {categoryName}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-sm text-slate-900 truncate mt-0.5">{prod.name}</h3>
                    <div className="text-[11px] text-slate-500 font-medium">{prod.material}</div>
                  </div>
                </div>

                {/* Descripción previa */}
                {prod.description && (
                  <p className="text-[11px] text-slate-500 line-clamp-2 mb-3 leading-relaxed bg-slate-50/70 p-2 rounded-lg border border-slate-100">
                    {prod.description}
                  </p>
                )}

                <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 space-y-1.5 mb-4 border border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Variantes / Medidas:</span>
                    <strong className="text-slate-900">{prod.variants?.length || 0} medidas</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Grabado de Logo:</span>
                    <strong className={prod.hasLogoOption ? "text-emerald-700 font-semibold" : "text-slate-400"}>
                      {prod.hasLogoOption ? `Disponible (+$${prod.logoPriceExtra?.toFixed(2) || "0.20"})` : "No disponible"}
                    </strong>
                  </div>
                  {prod.variants?.[0] && (
                    <div className="flex justify-between pt-1 border-t border-slate-200/60 text-[11px]">
                      <span className="text-slate-500">Precio base (PVP / Mayor):</span>
                      <span className="font-bold text-slate-800">
                        {formatCurrency(prod.variants[0].unitPrice)} / <span className="text-emerald-700">{formatCurrency(prod.variants[0].wholesalePrice)}</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => setSelectedProduct({ ...prod })}
                className="w-full bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-800 text-xs font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Editar Producto, Descripción & Precios</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal Editor de Producto Completo */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto border border-slate-100 space-y-5 my-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-alina-600 bg-alina-50 px-2 py-0.5 rounded-md">
                  SKU: {selectedProduct.sku}
                </span>
                <h2 className="font-display font-bold text-lg text-slate-900 mt-1">
                  Editar Producto
                </h2>
                <p className="text-xs text-slate-500">
                  Actualiza el título, descripción detallada, categoría y escala de precios
                </p>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              
              {/* 1. Nombre del Producto */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  required
                  value={selectedProduct.name}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-alina-600 font-medium"
                  placeholder="Ej. Base de Torta MDF 3mm — Forma Redonda Clásica"
                />
              </div>

              {/* 2. CASILLA DE DESCRIPCIÓN (Requerimiento Principal del Usuario) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-alina-600" />
                    <span>Descripción del Producto</span>
                  </label>
                  <span className="text-[10px] text-slate-400">
                    Visible en la tienda y en la ficha del producto
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={selectedProduct.description || ""}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
                  placeholder="Detalla las características del producto, materiales, acabados, usos en pastelería y recomendaciones para el cliente..."
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-alina-600 font-normal leading-relaxed resize-y"
                />
              </div>

              {/* 3. Categoría, Material y Grabado de Logotipo */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Categoría
                  </label>
                  <select
                    value={selectedProduct.categorySlug || "bases-mdf"}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, categorySlug: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-alina-600 bg-white"
                  >
                    {CATEGORIES_DATA.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Material
                  </label>
                  <input
                    type="text"
                    value={selectedProduct.material || ""}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, material: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-alina-600"
                    placeholder="Ej. MDF 3mm laminado"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Costo Grabado Logo ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={selectedProduct.logoPriceExtra ?? 0.20}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, logoPriceExtra: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-alina-600"
                  />
                </div>
              </div>

              {/* 4. Subida de Imagen a Vercel Blob */}
              <div className="border border-dashed border-slate-300 rounded-2xl p-4 bg-slate-50 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 overflow-hidden relative shrink-0 flex items-center justify-center">
                  <Image
                    src={selectedProduct.mainImage || "/logo.jpg"}
                    alt="Preview"
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold text-slate-800 block mb-0.5">
                    {uploadingImage ? "Subiendo archivo a Vercel Blob..." : "Foto Principal del Producto"}
                  </span>
                  <p className="text-[11px] text-slate-500 mb-2">
                    JPG, PNG o WEBP de alta calidad
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-slate-900 file:text-white file:font-semibold file:text-xs cursor-pointer"
                  />
                </div>
              </div>

              {/* 5. Editor de Variantes y Precios (PVP, Docena, Mayorista) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-alina-600" />
                    <span>Variantes de Medidas y Escala de Precios</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [
                        ...(selectedProduct.variants || []),
                        { sizeLabel: "25 cm", unitPrice: 1.0, dozenPrice: 0.85, wholesalePrice: 0.70 },
                      ];
                      setSelectedProduct({ ...selectedProduct, variants: updated });
                    }}
                    className="text-[11px] font-bold text-alina-600 hover:text-alina-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Agregar Medida</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedProduct.variants?.map((v: any, idx: number) => (
                    <div key={idx} className="flex flex-wrap sm:flex-nowrap items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                      <div className="flex-1 min-w-[110px]">
                        <span className="text-[10px] text-slate-400 block mb-0.5">Medida:</span>
                        <input
                          type="text"
                          value={v.sizeLabel}
                          onChange={(e) => {
                            const updated = [...selectedProduct.variants];
                            updated[idx].sizeLabel = e.target.value;
                            setSelectedProduct({ ...selectedProduct, variants: updated });
                          }}
                          className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white font-medium text-xs"
                          placeholder="Ej. 20 cm"
                        />
                      </div>
                      <div className="w-20">
                        <span className="text-[10px] text-slate-400 block mb-0.5">PVP Unit:</span>
                        <input
                          type="number"
                          step="0.01"
                          value={v.unitPrice}
                          onChange={(e) => {
                            const updated = [...selectedProduct.variants];
                            updated[idx].unitPrice = parseFloat(e.target.value) || 0;
                            setSelectedProduct({ ...selectedProduct, variants: updated });
                          }}
                          className="w-full border border-slate-300 rounded-lg px-2 py-1.5 bg-white text-xs font-semibold"
                        />
                      </div>
                      <div className="w-20">
                        <span className="text-[10px] text-slate-400 block mb-0.5">Docena:</span>
                        <input
                          type="number"
                          step="0.01"
                          value={v.dozenPrice}
                          onChange={(e) => {
                            const updated = [...selectedProduct.variants];
                            updated[idx].dozenPrice = parseFloat(e.target.value) || 0;
                            setSelectedProduct({ ...selectedProduct, variants: updated });
                          }}
                          className="w-full border border-slate-300 rounded-lg px-2 py-1.5 bg-white text-xs font-semibold text-alina-700"
                        />
                      </div>
                      <div className="w-20">
                        <span className="text-[10px] text-slate-400 block mb-0.5">Mayorista:</span>
                        <input
                          type="number"
                          step="0.01"
                          value={v.wholesalePrice}
                          onChange={(e) => {
                            const updated = [...selectedProduct.variants];
                            updated[idx].wholesalePrice = parseFloat(e.target.value) || 0;
                            setSelectedProduct({ ...selectedProduct, variants: updated });
                          }}
                          className="w-full border border-slate-300 rounded-lg px-2 py-1.5 bg-white text-xs font-semibold text-emerald-700"
                        />
                      </div>
                      {selectedProduct.variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = selectedProduct.variants.filter((_: any, i: number) => i !== idx);
                            setSelectedProduct({ ...selectedProduct, variants: updated });
                          }}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg mt-3 sm:mt-0 transition-colors"
                          title="Eliminar esta medida"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="flex-1 bg-white border border-slate-200 text-slate-700 text-xs font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-slate-900 text-white text-xs font-bold py-2.5 rounded-xl hover:bg-black transition-colors shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Guardar Cambios</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </main>
  );
}
