import type { Metadata } from 'next';
import { TrustHeroStrip } from '@/components/sections/TrustHeroStrip';
import { HeroCustomizer } from '@/components/sections/HeroCustomizer';
import { CraftsmanshipStory } from '@/components/sections/CraftsmanshipStory';
import { EmotionalReviewsWall } from '@/components/sections/EmotionalReviewsWall';
import { StickyMobileAddToCart } from '@/components/sections/StickyMobileAddToCart';

export const metadata: Metadata = {
  title: 'Custom Dog Memorial Canvas Art | Paw & Keepsake',
  description:
    'Transform your dog\'s memory into museum-grade watercolor art. Personalized with their name, breed, and dates. Printed and assembled in the USA. Free shipping on orders $50+.',
  openGraph: {
    title: 'Custom Dog Memorial Canvas Art | Paw & Keepsake',
    description: 'Museum-grade custom dog memorial art personalized with your pet\'s name and breed.',
    images: [{ url: 'https://pawandkeepsake.com/og-image.jpg', width: 1200, height: 630 }],
  },
};

const productJsonLd = {
  '@context': 'https://schema.org/',
  '@type': 'Product',
  name: 'Custom Dog Memorial Canvas Art',
  image: ['https://pawandkeepsake.com/og-image.jpg'],
  description:
    'Museum-grade custom dog memorial canvas art, personalized with your pet\'s name, lifespan, and breed.',
  brand: { '@type': 'Brand', name: 'Paw & Keepsake' },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '1420',
  },
  offers: {
    '@type': 'Offer',
    priceCurrency: 'USD',
    price: '68.00',
    lowPrice: '48.00',
    highPrice: '185.00',
    availability: 'https://schema.org/InStock',
    itemCondition: 'https://schema.org/NewCondition',
    seller: { '@type': 'Organization', name: 'Paw & Keepsake' },
    shippingDetails: {
      '@type': 'OfferShippingDetails',
      deliveryTime: {
        '@type': 'ShippingDeliveryTime',
        businessDays: { '@type': 'QuantitativeValue', minValue: 4, maxValue: 6 },
      },
      shippingDestination: { '@type': 'DefinedRegion', addressCountry: ['US', 'CA'] },
    },
  },
};

const speculationRules = {
  prefetch: [
    {
      where: { href_matches: '/product/*' },
      eagerness: 'moderate',
    },
  ],
};

export default function HomePage() {
  return (
    <>
      {/* Schema.org Product JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      {/* Speculation rules for product page prefetch */}
      <script
        type="speculationrules"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(speculationRules) }}
      />

      <TrustHeroStrip />
      <main id="main-content">
        <HeroCustomizer />
        <CraftsmanshipStory />
        <EmotionalReviewsWall />
      </main>
      <StickyMobileAddToCart />

      {/* Footer */}
      <footer className="bg-foreground text-white/80 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            <div>
              <h3 className="font-fraunces text-lg text-white font-light mb-3">Paw & Keepsake</h3>
              <p className="text-sm leading-relaxed text-white/60 font-jakarta">
                Artisan digital studio transforming the memory of beloved dogs into museum-quality art.
              </p>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-widest text-white/40 font-jakarta mb-3">Orders</h4>
              <ul className="flex flex-col gap-2 text-sm font-jakarta">
                <li><a href="mailto:hello@pawandkeepsake.com" className="hover:text-white transition-colors">Track Your Order</a></li>
                <li><a href="/shipping" className="hover:text-white transition-colors">Shipping & Delivery</a></li>
                <li><a href="/refund" className="hover:text-white transition-colors">Refund & Replacement</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-widest text-white/40 font-jakarta mb-3">Legal</h4>
              <ul className="flex flex-col gap-2 text-sm font-jakarta">
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
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
    </>
  );
}
