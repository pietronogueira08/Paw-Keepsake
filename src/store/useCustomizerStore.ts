'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Breed, CanvasSize, ProductType, FrameStyle } from '@/types/ecommerce';

export type CustomizerStep = 1 | 2 | 3 | 4 | 5;

// Price table: productType → size → dollars
const PRICE_TABLE: Record<ProductType, Record<CanvasSize, number>> = {
  'museum-canvas':  { '8x10': 38, '12x16': 48, '18x24': 68, '24x36': 148 },
  'framed-print':   { '8x10': 52, '12x16': 65, '18x24': 89, '24x36': 185 },
};

function derivePrice(type: ProductType, size: CanvasSize): number {
  return PRICE_TABLE[type][size];
}

interface CustomizerStoreState {
  currentStep: CustomizerStep;
  productType: ProductType;
  breed: Breed | null;
  petName: string;
  dateRange: string;
  selectedQuoteId: string;
  customQuote: string;
  size: CanvasSize;
  frameStyle: FrameStyle;
  unitPrice: number;
  draftEmail: string;
}

interface CustomizerStoreActions {
  setStep: (step: CustomizerStep) => void;
  advanceStep: () => void;
  goBack: () => void;
  setProductType: (type: ProductType) => void;
  setBreed: (breed: Breed | null) => void;
  setPetName: (name: string) => void;
  setDateRange: (range: string) => void;
  setQuote: (quoteId: string, customText?: string) => void;
  setSize: (size: CanvasSize) => void;
  setFrameStyle: (style: FrameStyle) => void;
  setDraftEmail: (email: string) => void;
  reset: () => void;
  isStepComplete: (step: number) => boolean;
}

export type CustomizerStore = CustomizerStoreState & CustomizerStoreActions;

const DEFAULT_STATE: CustomizerStoreState = {
  currentStep: 1,
  productType: 'museum-canvas',
  breed: null,
  petName: '',
  dateRange: '',
  selectedQuoteId: 'q1',
  customQuote: '',
  size: '12x16',
  frameStyle: 'natural-oak',
  unitPrice: derivePrice('museum-canvas', '12x16'),
  draftEmail: '',
};

export const useCustomizerStore = create<CustomizerStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_STATE,

      setStep: (step) => set({ currentStep: step }),

      advanceStep: () =>
        set((s) => ({
          currentStep: Math.min(s.currentStep + 1, 5) as CustomizerStep,
        })),

      goBack: () =>
        set((s) => ({
          currentStep: Math.max(s.currentStep - 1, 1) as CustomizerStep,
        })),

      setProductType: (productType) =>
        set((s) => ({
          productType,
          unitPrice: derivePrice(productType, s.size),
        })),

      setBreed: (breed) => set({ breed }),

      setPetName: (petName) => set({ petName }),

      setDateRange: (dateRange) => set({ dateRange }),

      setQuote: (quoteId, customText) =>
        set({ selectedQuoteId: quoteId, customQuote: customText ?? '' }),

      setSize: (size) =>
        set((s) => ({ size, unitPrice: derivePrice(s.productType, size) })),

      setFrameStyle: (frameStyle) => set({ frameStyle }),

      setDraftEmail: (draftEmail) => set({ draftEmail }),

      reset: () => set({ ...DEFAULT_STATE }),

      isStepComplete: (step) => {
        const s = get();
        switch (step) {
          case 1: return true; // productType always set
          case 2: return s.breed !== null;
          case 3: return s.petName.trim().length >= 1;
          case 4: return true; // size always set
          case 5: return s.breed !== null && s.petName.trim().length >= 1;
          default: return false;
        }
      },
    }),
    {
      name: 'paw-customizer-draft',
      // Don't persist step — always start from 1
      partialize: (s) => ({
        productType: s.productType,
        breed: s.breed,
        petName: s.petName,
        dateRange: s.dateRange,
        selectedQuoteId: s.selectedQuoteId,
        customQuote: s.customQuote,
        size: s.size,
        frameStyle: s.frameStyle,
        unitPrice: s.unitPrice,
        draftEmail: s.draftEmail,
      }),
    }
  )
);

/** Convenience selector for building a CartItem snapshot */
export function selectCustomizerSnapshot(s: CustomizerStore) {
  return {
    productType: s.productType,
    breed: s.breed,
    petName: s.petName,
    dateRange: s.dateRange,
    customQuote: s.customQuote,
    size: s.size,
    frameStyle: s.frameStyle,
    unitPrice: s.unitPrice,
  };
}
