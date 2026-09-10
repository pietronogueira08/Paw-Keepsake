import type { Metadata } from 'next';
import { TrustHeroStrip } from '@/components/sections/TrustHeroStrip';
import { HeroCustomizer } from '@/components/sections/HeroCustomizer';
import { FeaturedCollection } from '@/components/sections/FeaturedCollection';
import { CraftsmanshipStory } from '@/components/sections/CraftsmanshipStory';
import { EmotionalReviewsWall } from '@/components/sections/EmotionalReviewsWall';
import { FaqAccordion } from '@/components/sections/FaqAccordion';
import { StickyMobileAddToCart } from '@/components/sections/StickyMobileAddToCart';

export const metadata: Metadata = {
  title: 'Custom Dog Memorial Canvas Art | Paw & Keepsake',
  description:
    "Transform your dog's memory into museum-grade watercolor art. Personalized with their name, breed, and dates. Printed and assembled in the USA. Free shipping on orders $50+.",
  openGraph: {
    title: 'Custom Dog Memorial Canvas Art | Paw & Keepsake',
    description: "Museum-grade custom dog memorial art personalized with your pet's name and breed.",
    images: [{ url: 'https://pawandkeepsake.com/og-image.jpg', width: 1200, height: 630 }],
  },
};

const productJsonLd = {
  '@context': 'https://schema.org/',
  '@type': 'Product',
  name: 'Custom Dog Memorial Canvas Art',
  image: ['https://pawandkeepsake.com/og-image.jpg'],
  description: "Museum-grade custom dog memorial canvas art, personalized with your pet's name, lifespan, and breed.",
  brand: { '@type': 'Brand', name: 'Paw & Keepsake' },
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '1420' },
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
  prefetch: [{ where: { href_matches: '/product/*' }, eagerness: 'moderate' }],
};

export default function HomePage() {
  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      {/* Speculation rules */}
      <script
        type="speculationrules"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(speculationRules) }}
      />

      <TrustHeroStrip />
      <main id="main-content">
        <HeroCustomizer />
        <FeaturedCollection />
        <CraftsmanshipStory />
        <EmotionalReviewsWall />
        <FaqAccordion />
      </main>
      <StickyMobileAddToCart />
    </>
  );
}
