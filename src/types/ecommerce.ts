// ============================================================
// Paw & Keepsake — Canonical Type Definitions
// ============================================================

export type ProductType = 'museum-canvas' | 'framed-print';
export type ApparelProductType = 'memorial-crewneck' | 'memorial-tshirt';
export type AnyProductType = ProductType | ApparelProductType;

export type CanvasSize = '8x12' | '12x16' | '16x20' | '16x24' | '8x10' | '18x24' | '24x36';
export type ApparelSize = 'S' | 'M' | 'L' | 'XL' | '2XL' | '3XL';

export type FrameStyle = 'none' | 'natural-oak' | 'black-walnut' | 'white-gallery';
export type ApparelColor = 'sand' | 'off-white' | 'heather-grey';

export interface BreedCoat {
  label: string;
  slug: string;
  image: string;
}

export interface Breed {
  id: string;
  name: string;
  slug: string;
  popularRank: number | null;
  svgPath: string;
  category: 'sporting' | 'hound' | 'working' | 'terrier' | 'toy' | 'non-sporting' | 'herding' | 'mixed';
  image?: string;
  coats?: BreedCoat[];
}

export interface MemorialQuote {
  id: string;
  text: string;
  author?: string;
}

export interface SizeVariant {
  size: CanvasSize;
  label: string;
  popularityLabel?: string;
  /** CRO badge shown on the size card (e.g. "Most Loved by Families") */
  croBadge?: string;
  prices: {
    'museum-canvas': number;
    'framed-print': number;
  };
  dimensionsCm: string;
}

export interface CustomizerState {
  currentStep: 1 | 2 | 3 | 4 | 5;
  productType: ProductType;
  breed: Breed | null;
  selectedCoat?: string | null;
  petName: string;
  dateRange: string;
  selectedQuoteId: string;
  customQuote: string;
  size: CanvasSize;
  frameStyle: FrameStyle;
  unitPrice: number;
}

// ─── Unified CartItem (canvas + apparel) ─────────────────────────────────────

export interface CartItem {
  id: string;
  /** Human-readable product name for cart display */
  productTitle: string;
  productType: AnyProductType;
  /** null for off-the-shelf apparel without breed personalization */
  breed: Breed | null;
  selectedCoat?: string;
  petName: string;
  dateRange: string;
  quote: string;
  /** CanvasSize for wall art; ApparelSize for apparel */
  size: CanvasSize | ApparelSize;
  /** null for apparel */
  frameStyle: FrameStyle | null;
  /** Apparel color — undefined for wall art */
  color?: ApparelColor;
  quantity: number;
  unitPrice: number;
}

export interface OrderBumpItem {
  id: 'comfort-tshirt';
  name: string;
  description: string;
  discountPercent: number;
  originalPrice: number;
  salePrice: number;
}

export interface PrintFilePayload {
  breed: Breed;
  petName: string;
  dateRange: string;
  quote: string;
  size: CanvasSize;
  productType: ProductType;
  frameStyle: FrameStyle;
}

export interface SaveDraftRequest {
  email: string;
  petName: string;
  breedName: string;
  dateRange: string;
  quote: string;
  size: CanvasSize;
  productType: ProductType;
}

export interface SaveDraftResponse {
  success: boolean;
  message?: string;
}

export interface ReviewPhoto {
  id: string;
  authorName: string;
  location: string;
  rating: 5 | 4;
  body: string;
  petName: string;
  breed: string;
  productType: ProductType;
  size: CanvasSize;
  verifiedPurchase: boolean;
  datePosted: string;
}

// ─── Catalog Product ──────────────────────────────────────────────────────────

export interface Product {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  basePrice: number;
  /** Relative paths — replace with real CDN URLs before launch */
  images: string[];
  category: 'wall-art' | 'apparel';
  badge: string;
  description: string;
  features: string[];
  isCustomizable: boolean;
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export type AnalyticsEventName =
  | 'ViewContent'
  | 'CustomizeProduct'
  | 'AddToCart'
  | 'InitiateCheckout'
  | 'Purchase'
  | 'SaveDraft';

export interface AnalyticsEventProperties {
  breed?: string;
  productType?: AnyProductType;
  petName?: string;
  value?: number;
  currency?: 'USD';
  items?: Array<{ id: string; name: string; price: number; quantity: number }>;
  transactionId?: string;
}
