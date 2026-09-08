import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Check, Clock, Shield } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import { getProductById, getSiteSettings, getVisibleServices } from '@/lib/data';
import { formatWhatsAppUrl, getProductConsultationMessage } from '@/lib/whatsapp';

export const revalidate = 60;

interface PageProps {
  params: {
    id: string;
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const product = await getProductById(params.id);
  const [settings, services] = await Promise.all([
    getSiteSettings(),
    getVisibleServices(),
  ]);

  if (!product) {
    notFound();
  }

  const waUrl = formatWhatsAppUrl(
    settings.whatsapp_number,
    getProductConsultationMessage(product.name)
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar whatsappNumber={settings.whatsapp_number} />

      <main className="flex-1 py-12 md:py-16">
        <div className="apple-container max-w-[840px]">
          {/* Back link */}
          <div className="mb-8">
            <Link
              href="/#produk"
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Katalog</span>
            </Link>
          </div>

          {/* Product Header Card */}
          <div className="bg-surface rounded-[16px] border border-black/[0.06] p-6 sm:p-10 mb-10">
            {product.image_url && (
              <div className="relative w-full h-[240px] sm:h-[340px] rounded-[12px] overflow-hidden bg-white mb-8">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <div className="space-y-4">
              <span className="text-[12px] font-semibold text-accent uppercase tracking-wider block">
                Paket Layanan KyDev
              </span>
              <h1 className="font-display text-[28px] sm:text-[36px] font-semibold text-primary leading-tight">
                {product.name}
              </h1>

              {/* Price badge */}
              <div className="pt-1">
                {product.show_price && product.price ? (
                  <div className="inline-block py-1.5 px-4 rounded-[8px] bg-white border border-black/[0.06] text-primary font-semibold text-[20px]">
                    Rp {Number(product.price).toLocaleString('id-ID')}
                    <span className="text-xs font-normal text-muted ml-1">/ project</span>
                  </div>
                ) : (
                  <div className="inline-block py-1.5 px-4 rounded-[8px] bg-white border border-black/[0.06] text-accent font-medium text-[15px]">
                    Custom Quote (Sesuai Kebutuhan)
                  </div>
                )}
              </div>

              <p className="text-[16px] text-body leading-relaxed pt-2">
                {product.full_description || product.short_description}
              </p>
            </div>

            {/* Features list */}
            {product.features && product.features.length > 0 && (
              <div className="mt-8 pt-6 border-t border-black/[0.08]">
                <h2 className="text-[14px] font-semibold text-primary uppercase tracking-wider mb-4">
                  Fasilitas & Fitur Termasuk:
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-[14px] text-body">
                      <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Extra assurance */}
            <div className="mt-8 pt-6 border-t border-black/[0.08] flex flex-wrap gap-6 text-[13px] text-muted">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent" />
                <span>Pengerjaan Cepat (3–7 Hari)</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-accent" />
                <span>Garansi Perbaikan & Video Tutorial</span>
              </div>
            </div>

            {/* CTA action */}
            <div className="mt-8 pt-6 flex flex-col sm:flex-row items-center gap-4">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 text-[14px] font-semibold text-white bg-[#0B0F19] hover:bg-black active:scale-[0.98] rounded-full transition-all"
              >
                <span>Pilih Paket Ini</span>
              </a>

              <Link
                href="/#produk"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-[15px] font-medium text-muted hover:text-primary transition-colors"
              >
                Lihat Paket Lainnya
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer services={services} settings={settings} />
      <FloatingWhatsApp whatsappNumber={settings.whatsapp_number} />
    </div>
  );
}
