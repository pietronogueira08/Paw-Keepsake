import type { Metadata } from 'next';
import Image from 'next/image';
import { Fraunces, Plus_Jakarta_Sans } from 'next/font/google';
import { Toaster } from 'sonner';
import { Header } from '@/components/layout/Header';
import { CartSlideOver } from '@/components/cart/CartSlideOver';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://pawandkeepsake.com'),
  title: {
    template: '%s | Paw & Keepsake',
    default: 'Custom Dog Memorial Art | Paw & Keepsake',
  },
  description:
    "Transform your dog's memory into museum-grade watercolor art. Personalized with their name, breed, and dates. Printed and assembled in the USA. Free shipping on orders $50+.",
  keywords: [
    'custom dog memorial art',
    'pet memorial canvas',
    'dog watercolor portrait',
    'personalized dog art',
    'pet loss gift',
    'dog memorial gift',
  ],
  openGraph: {
    title: 'Custom Dog Memorial Art | Paw & Keepsake',
    description:
      "Museum-grade custom dog memorial art personalized with your pet's name and breed.",
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Paw & Keepsake Memorial Canvas' }],
    type: 'website',
    locale: 'en_US',
    siteName: 'Paw & Keepsake',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Custom Dog Memorial Art | Paw & Keepsake',
    description: "Museum-grade custom dog memorial art personalized with your pet's name and breed.",
    images: ['/og-image.jpg'],
  },
  robots: { index: true, follow: true },
};

// ─── Shared Footer ────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-foreground text-white/80 py-12 mt-auto">
      <div className="section-container">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <Image
                src="/images/logo-mark.webp"
                alt="Paw & Keepsake"
                width={28}
                height={28}
                className="w-7 h-7 object-contain brightness-0 invert opacity-90"
              />
              <h3 className="font-fraunces text-lg text-white font-light">Paw & Keepsake</h3>
            </div>
            <p className="text-sm leading-relaxed text-white/60 font-jakarta">
              Artisan digital studio transforming the memory of beloved dogs into museum-quality art.
            </p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-white/40 font-jakarta mb-3">Shop</h4>
            <ul className="flex flex-col gap-2 text-sm font-jakarta">
              <li><a href="/shop" className="hover:text-white transition-colors">All Keepsakes</a></li>
              <li><a href="/our-story" className="hover:text-white transition-colors">Our Story</a></li>
              <li><a href="/product/museum-canvas" className="hover:text-white transition-colors">Museum Canvas</a></li>
              <li><a href="/product/framed-print" className="hover:text-white transition-colors">Framed Print</a></li>
              <li><a href="/product/memorial-crewneck" className="hover:text-white transition-colors">Memorial Apparel</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-white/40 font-jakarta mb-3">Orders & Legal</h4>
            <ul className="flex flex-col gap-2 text-sm font-jakarta">
              <li><a href="/shipping" className="hover:text-white transition-colors">Shipping & Delivery</a></li>
              <li><a href="/refund" className="hover:text-white transition-colors">Refund & Replacement</a></li>
              <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-white/40 font-jakarta mb-3">Support</h4>
            <ul className="flex flex-col gap-2 text-sm font-jakarta">
              <li><a href="mailto:hello@pawandkeepsake.com" className="hover:text-white transition-colors">hello@pawandkeepsake.com</a></li>
              <li><span className="text-white/50">Response within 12 hours</span></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40 font-jakarta">
          <p>© {new Date().getFullYear()} Paw & Keepsake. All rights reserved.</p>
          <p>Printed & Assembled in the USA 🇺🇸</p>
        </div>
      </div>
    </footer>
  );
}

// ─── Root Layout ──────────────────────────────────────────────────────────────

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${jakarta.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-background text-foreground font-jakarta antialiased">
        <Header />
        <div className="flex-1">
          {children}
        </div>
        <Footer />
        <CartSlideOver />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#FFFFFF',
              border: '1px solid #EBE6DE',
              color: '#242424',
              fontFamily: 'var(--font-jakarta)',
              borderRadius: '10px',
            },
          }}
        />
      </body>
    </html>
  );
}
