'use client';

import React, { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  mainImage: string;
  images?: string[];
  productName: string;
}

export function ProductGallery({ mainImage, images = [], productName }: ProductGalleryProps) {
  const allImages = [mainImage, ...images].filter(Boolean);
  const [selectedImage, setSelectedImage] = useState(allImages[0] || "/logo.jpg");

  return (
    <div className="flex flex-col gap-4">
      {/* Main Large View */}
      <div className="w-full aspect-square bg-slate-50 border border-slate-200/80 rounded-2xl overflow-hidden relative flex items-center justify-center p-8 group">
        <Image
          src={selectedImage}
          alt={productName}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          priority
        />
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(img)}
              aria-label={`Ver vista ${idx + 1} de ${productName}`}
              className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 p-1 bg-white transition-all ${
                selectedImage === img
                  ? "border-alina-600 ring-2 ring-alina-100"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="w-full h-full relative">
                <Image src={img} alt={`Vista ${idx + 1}`} fill sizes="80px" className="object-contain" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
