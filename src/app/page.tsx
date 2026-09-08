import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Advantages from '@/components/Advantages';
import PortfolioShowcase from '@/components/PortfolioShowcase';
import ProductCatalog from '@/components/ProductCatalog';
import Testimonials from '@/components/Testimonials';
import FAQSection from '@/components/FAQSection';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import {
  getSiteSettings,
  getVisibleProducts,
  getVisibleTestimonials,
  getVisibleFaqs,
  getVisibleServices,
  getVisiblePortfolios,
  getFeaturedPortfolio,
} from '@/lib/data';

// Keep page fast with Server Components & ISR
export const revalidate = 60;

export default async function HomePage() {
  const [settings, products, testimonials, faqs, services, portfolios, featuredProject] =
    await Promise.all([
      getSiteSettings(),
      getVisibleProducts(),
      getVisibleTestimonials(),
      getVisibleFaqs(),
      getVisibleServices(),
      getVisiblePortfolios(),
      getFeaturedPortfolio(),
    ]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Translucent Navigation */}
      <Navbar whatsappNumber={settings.whatsapp_number} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section Bersih di Tengah ala Apple */}
        <Hero
          tagline={settings.tagline || undefined}
          whatsappNumber={settings.whatsapp_number}
        />

        {/* Keunggulan Layanan KyDev */}
        <Advantages advantages={settings.advantages || undefined} />

        {/* Showcase Portofolio Produk Jadi (Kasir, Warkop, Laundry, Gym, Cafe) */}
        <PortfolioShowcase
          portfolios={portfolios}
          whatsappNumber={settings.whatsapp_number}
        />

        {/* Katalog Paket Jasa Pembuatan Website */}
        <ProductCatalog
          products={products}
          whatsappNumber={settings.whatsapp_number}
        />

        {/* Testimoni Klien & Social Proof */}
        <Testimonials testimonials={testimonials} />

        {/* Tanya Jawab (FAQ) Accordion */}
        <FAQSection faqs={faqs} />
      </main>

      {/* Footer */}
      <Footer services={services} settings={settings} />

      {/* Lead Generation Floating WhatsApp CTA */}
      <FloatingWhatsApp whatsappNumber={settings.whatsapp_number} />
    </div>
  );
}
