'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Check } from 'lucide-react';
import { Product } from '@/lib/types';
import { formatWhatsAppUrl, getProductConsultationMessage } from '@/lib/whatsapp';
import ProductModal from './ProductModal';

interface ProductCatalogProps {
  products: Product[];
  whatsappNumber?: string;
  isStandalonePage?: boolean;
}

export default function ProductCatalog({
  products,
  whatsappNumber = '6281234567890',
  isStandalonePage = false,
}: ProductCatalogProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <section
      id="produk"
      className={`py-16 md:py-24 ${isStandalonePage ? 'bg-canvas' : 'bg-canvas'}`}
    >
      <div className="apple-container">
        {/* Header */}
        <div className="text-center max-w-[680px] mx-auto mb-14">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-accent block mb-2">
            Paket Pembuatan Website
          </span>
          <h2 className="font-display text-[28px] sm:text-[36px] font-semibold text-primary tracking-tight leading-tight">
            Pilihan paket lengkap sesuai skala bisnis Anda.
          </h2>
          <p className="text-[15px] text-muted mt-3">
            Transparan, siap pakai tanpa biaya tersembunyi. Klik produk untuk melihat rincian fasilitas dan konsultasi via WhatsApp.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((product) => {
            const pImages = product.images && Array.isArray(product.images) && product.images.length > 0
              ? product.images.filter(Boolean)
              : (product.image_url ? [product.image_url] : []);
            const coverImage = pImages[0] || product.image_url;

            const waUrl = formatWhatsAppUrl(
              whatsappNumber,
              getProductConsultationMessage(product.name)
            );

            return (
              <div
                key={product.id}
                className="group relative flex flex-col justify-between rounded-[14px] bg-surface border border-black/[0.04] hover:border-black/[0.12] transition-all p-6 sm:p-7"
              >
                <div>
                  {/* Image thumbnail if present */}
                  {coverImage && (
                    <div
                      onClick={() => setSelectedProduct(product)}
                      className="relative w-full h-[180px] sm:h-[220px] rounded-[10px] overflow-hidden bg-neutral-2/40 mb-6 group-hover:scale-[1.01] transition-transform cursor-pointer"
                    >
                      <Image
                        src={coverImage}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Header & Pricing */}
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3">
                    <h3 className="font-display text-[20px] font-semibold text-primary">
                      {product.name}
                    </h3>
                    {product.show_price && product.price ? (
                      <span className="text-[15px] font-semibold text-primary shrink-0">
                        Rp {Number(product.price).toLocaleString('id-ID')}
                      </span>
                    ) : (
                      <span className="text-[13px] font-medium text-accent shrink-0">
                        Custom Quote
                      </span>
                    )}
                  </div>

                  {/* Short Description */}
                  <p className="text-[14px] text-muted leading-relaxed mb-5">
                    {product.short_description}
                  </p>

                  {/* Features mini preview */}
                  {product.features && product.features.length > 0 && (
                    <ul className="space-y-2 mb-6 pt-4 border-t border-black/[0.05]">
                      {product.features.slice(0, 4).map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-[13px] text-muted">
                          <Check className="w-3.5 h-3.5 text-accent shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                      {product.features.length > 4 && (
                        <li className="text-[12px] text-accent font-medium pl-5.5">
                          + {product.features.length - 4} fasilitas lainnya
                        </li>
                      )}
                    </ul>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-black/[0.05] flex items-center justify-between gap-3">
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="text-[13px] font-medium text-primary hover:text-accent inline-flex items-center gap-1 transition-colors"
                  >
                    <span>Detail Lengkap</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-4 py-1.5 text-[13px] font-semibold text-white bg-[#0B0F19] hover:bg-black active:scale-[0.97] rounded-full transition-all shadow-xs"
                  >
                    <span>Pilih Paket</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal View */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          whatsappNumber={whatsappNumber}
        />
      )}
    </section>
  );
}
