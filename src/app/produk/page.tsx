import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import ProductCatalog from '@/components/ProductCatalog';
import { getSiteSettings, getVisibleProducts, getVisibleServices } from '@/lib/data';

export const revalidate = 60;

export default async function ProdukPage() {
  const [settings, products, services] = await Promise.all([
    getSiteSettings(),
    getVisibleProducts(),
    getVisibleServices(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar whatsappNumber={settings.whatsapp_number} />

      <main className="flex-1 py-8">
        <div className="apple-container pt-4 pb-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        <ProductCatalog
          products={products}
          whatsappNumber={settings.whatsapp_number}
          isStandalonePage={true}
        />
      </main>

      <Footer services={services} settings={settings} />
      <FloatingWhatsApp whatsappNumber={settings.whatsapp_number} />
    </div>
  );
}
