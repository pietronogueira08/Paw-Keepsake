import type { Product } from '@/types/ecommerce';

// ─── Central Product Catalog ──────────────────────────────────────────────────

export const PRODUCTS: Product[] = [
  {
    id: 'museum-canvas',
    slug: 'museum-canvas',
    title: 'Museum Stretched Canvas',
    subtitle: 'Gallery-ready, pre-hung',
    basePrice: 48,
    images: [
      '/products/museum-canvas-1.jpg',
      '/products/museum-canvas-2.jpg',
      '/products/museum-canvas-3.jpg',
    ],
    category: 'wall-art',
    badge: 'Most Popular',
    description:
      "Your dog's watercolor portrait printed on 300 GSM archival cotton canvas, hand-stretched over a solid 1.5\" kiln-dried pine frame. Ships ready to hang with pre-installed museum-grade hardware.",
    features: [
      'Archival 300 GSM cotton canvas',
      '1.5" solid pine stretcher bars',
      'Gallery UV protective coating',
      'Pre-installed hanging hardware',
      'Acid-free, fade-resistant inks',
      'Printed & assembled in the USA',
    ],
    isCustomizable: true,
  },
  {
    id: 'framed-print',
    slug: 'framed-print',
    title: 'Framed Fine Art Print',
    subtitle: 'Solid wood frame, mat included',
    basePrice: 65,
    images: [
      '/products/framed-print-1.jpg',
      '/products/framed-print-2.jpg',
      '/products/framed-print-3.jpg',
    ],
    category: 'wall-art',
    badge: 'Editor\'s Pick',
    description:
      "A fine art giclée print mounted behind museum glass inside a hand-assembled solid wood frame with an archival white mat. Available in Natural Oak, Black Walnut, and White Gallery finishes.",
    features: [
      'Fine art giclée paper (300 GSM)',
      'Solid hardwood frame options',
      'Archival white mat included',
      'Museum-quality anti-glare glass',
      'Acid-free backing board',
      'Ready to hang — no assembly needed',
    ],
    isCustomizable: true,
  },
  {
    id: 'memorial-crewneck',
    slug: 'memorial-crewneck',
    title: 'Heritage Memorial Crewneck',
    subtitle: 'Comfort Colors garment-dyed',
    basePrice: 58,
    images: [
      '/products/crewneck-1.jpg',
      '/products/crewneck-2.jpg',
      '/products/crewneck-3.jpg',
    ],
    category: 'apparel',
    badge: 'New Arrival',
    description:
      "Wear your love every day. Your dog's watercolor portrait screen-printed on a premium Comfort Colors 1566 crewneck — the cult-favorite garment-dyed fleece known for its lived-in softness and rich pigment.",
    features: [
      'Comfort Colors 1566 crewneck',
      'Garment-dyed for unique character',
      '80% cotton / 20% polyester',
      'Custom watercolor breed portrait',
      'Pet name & dates embroidered inside',
      'Sizes S – 3XL',
    ],
    isCustomizable: true,
  },
  {
    id: 'memorial-tshirt',
    slug: 'memorial-tshirt',
    title: 'Comfort Colors Memorial Tee',
    subtitle: 'Lightweight garment-dyed cotton',
    basePrice: 38,
    images: [
      '/products/tshirt-1.jpg',
      '/products/tshirt-2.jpg',
      '/products/tshirt-3.jpg',
    ],
    category: 'apparel',
    badge: 'Best Value',
    description:
      "The everyday memorial tee that carries your dog's memory wherever you go. Screen-printed with their custom watercolor portrait on Comfort Colors 1717 — the softest, most coveted tee in the USA.",
    features: [
      'Comfort Colors 1717 tee',
      '100% ring-spun cotton',
      'Garment-dyed, washed soft',
      'Custom watercolor breed portrait',
      'Sizes S – 3XL',
      'Machine washable, colorfast',
    ],
    isCustomizable: true,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: Product['category']): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

export const APPAREL_COLORS: Record<string, { label: string; hex: string }> = {
  sand:          { label: 'Sand',          hex: '#D4B896' },
  'off-white':   { label: 'Off-White',     hex: '#F0EDE6' },
  'heather-grey':{ label: 'Heather Grey',  hex: '#9B9B9B' },
};

export const APPAREL_SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL'] as const;
