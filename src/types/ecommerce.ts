// ============================================================
// Paw & Keepsake — Canonical Type Definitions
// ============================================================

export type ProductType = 'museum-canvas' | 'framed-print';

export type CanvasSize = '8x10' | '12x16' | '18x24' | '24x36';

export type FrameStyle = 'none' | 'natural-oak' | 'black-walnut' | 'white-gallery';

export interface Breed {
  id: string;
  name: string;
  slug: string;
  popularRank: number | null;
  svgPath: string;
  category: 'sporting' | 'hound' | 'working' | 'terrier' | 'toy' | 'non-sporting' | 'herding' | 'mixed';
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
  petName: string;
  dateRange: string;
  selectedQuoteId: string;
  customQuote: string;
  size: CanvasSize;
  frameStyle: FrameStyle;
  unitPrice: number;
}

export interface CartItem {
  id: string;
  productType: ProductType;
  breed: Breed;
  petName: string;
  dateRange: string;
  quote: string;
  size: CanvasSize;
  frameStyle: FrameStyle;
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

export type AnalyticsEventName =
  | 'ViewContent'
  | 'CustomizeProduct'
  | 'AddToCart'
  | 'InitiateCheckout'
  | 'Purchase'
  | 'SaveDraft';

export interface AnalyticsEventProperties {
  breed?: string;
  productType?: ProductType;
  petName?: string;
  value?: number;
  currency?: 'USD';
  items?: Array<{ id: string; name: string; price: number; quantity: number }>;
  transactionId?: string;
}
