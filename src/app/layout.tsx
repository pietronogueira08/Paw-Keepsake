import type { Metadata } from 'next';
import { Fraunces, Plus_Jakarta_Sans } from 'next/font/google';
import { Toaster } from 'sonner';
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
    default: 'Custom Dog Memorial Canvas Art | Paw & Keepsake',
  },
  description:
    'Transform your dog\'s memory into museum-grade watercolor art. Personalized with their name, breed, and dates. Printed and assembled in the USA. Free shipping on orders $50+.',
  keywords: [
    'custom dog memorial art',
    'pet memorial canvas',
    'dog watercolor portrait',
    'personalized dog art',
    'pet loss gift',
    'dog memorial gift',
  ],
  openGraph: {
    title: 'Custom Dog Memorial Canvas Art | Paw & Keepsake',
    description:
      'Museum-grade custom dog memorial art personalized with your pet\'s name and breed. Crafted with care, delivered to your door.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Paw & Keepsake Memorial Canvas' }],
    type: 'website',
    locale: 'en_US',
    siteName: 'Paw & Keepsake',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Custom Dog Memorial Canvas Art | Paw & Keepsake',
    description: 'Museum-grade custom dog memorial art personalized with your pet\'s name and breed.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${jakarta.variable} h-full`}
    >
      <body className="min-h-full bg-background text-foreground font-jakarta antialiased">
        {children}
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
