import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'KyDev',
  description:
    'Penyedia jasa pembuatan website company profile, landing page konversi tinggi, dan toko online profesional berdesain minimalis dan premium.',
  keywords: [
    'jasa pembuatan website',
    'landing page konversi',
    'company profile perusahaan',
    'web developer profesional',
    'kydev',
    'jasa web jakarta',
  ],
  authors: [{ name: 'KyDev Studio' }],
  openGraph: {
    title: 'KyDev — Jasa Pembuatan Website Profesional & Elegan',
    description:
      'Solusi website modern dengan desain elegan, loading cepat, dan integrasi WhatsApp instan.',
    type: 'website',
    locale: 'id_ID',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-canvas text-body antialiased flex flex-col selection:bg-accent selection:text-white">
        {children}
      </body>
    </html>
  );
}
