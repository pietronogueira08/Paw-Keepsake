import { writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';

function write(file, content) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content, 'utf8');
  console.log('  wrote:', file);
}

// ─── src/types/ecommerce.ts ───────────────────────────────────────────────────
write('src/types/ecommerce.ts', `export interface Breed {
  id: string;
  name: string;
  svgPath: string;
  popular: boolean;
  group: string;
}

export type ProductType = 'canvas' | 'print';
export type SizeSku = '8x10' | '11x14' | '12x16' | '16x20' | '18x24' | '24x30';

export interface SizeOption {
  sku: SizeSku;
  label: string;
  dimensions: string;
  canvasPrice: number;
  printPrice: number;
  badge?: 'Most Popular' | 'Best Value';
}

export interface QuoteOption {
  id: string;
  text: string;
  isCustom?: boolean;
}

export interface CustomizerState {
  breed: Breed | null;
  petName: string;
  dateRange: string;
  selectedQuoteId: string;
  customQuoteText: string;
  productType: ProductType;
  selectedSize: SizeSku;
}

export interface CartItem {
  id: string;
  customizerSnapshot: CustomizerState;
  quantity: number;
  unitPrice: number;
}

export interface SaveDraftRequest {
  email: string;
  customizerState: CustomizerState;
}

export interface SaveDraftResponse {
  success: boolean;
  draftId?: string;
  message?: string;
}
`);

console.log('Done');
