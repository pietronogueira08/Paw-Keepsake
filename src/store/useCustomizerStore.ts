'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Breed } from '@/types/ecommerce';

export type PackageTier = 'entry' | 'gallery' | 'heritage';

// Price table for packages
const PACKAGE_PRICES: Record<PackageTier, number> = {
  entry: 48,
  gallery: 68,
  heritage: 88,
};

interface CustomizerStoreState {
  breed: Breed | null;
  petName: string;
  dateRange: string;
  selectedPackage: PackageTier;
  previewLoading: boolean;
  unitPrice: number;
}

interface CustomizerStoreActions {
  setBreed: (breed: Breed | null) => void;
  setPetName: (name: string) => void;
  setDateRange: (range: string) => void;
  setPackage: (pkg: PackageTier) => void;
  setPreviewLoading: (loading: boolean) => void;
  reset: () => void;
}

export type CustomizerStore = CustomizerStoreState & CustomizerStoreActions;

const DEFAULT_STATE: CustomizerStoreState = {
  breed: null,
  petName: '',
  dateRange: '',
  selectedPackage: 'gallery', // Decoy/Most Loved default
  previewLoading: false,
  unitPrice: PACKAGE_PRICES.gallery,
};

export const useCustomizerStore = create<CustomizerStore>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,

      setBreed: (breed) => {
        set({ previewLoading: true });
        // Simulate a slight delay to avoid abrupt jumps, as requested:
        // "previewLoading que pode ter um delay mínimo de 200-300ms só para a transição visual não parecer um "pulo" abrupto"
        setTimeout(() => set({ breed, previewLoading: false }), 250);
      },

      setPetName: (petName) => set({ petName }),

      setDateRange: (dateRange) => set({ dateRange }),

      setPackage: (pkg) =>
        set({ selectedPackage: pkg, unitPrice: PACKAGE_PRICES[pkg] }),

      setPreviewLoading: (loading) => set({ previewLoading: loading }),

      reset: () => set({ ...DEFAULT_STATE }),
    }),
    {
      name: 'paw-customizer-draft',
      partialize: (s) => ({
        breed: s.breed,
        petName: s.petName,
        dateRange: s.dateRange,
        selectedPackage: s.selectedPackage,
        unitPrice: s.unitPrice,
      }),
    }
  )
);
