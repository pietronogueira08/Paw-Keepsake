'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, OrderBumpItem } from '@/types/ecommerce';
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DEFAULT_ORDER_BUMP: OrderBumpItem = {
  id: 'memorial-keyring',
  name: 'Matching Memorial Keepsake Keyring',
  description:
    "Polished stainless steel medallion keyring featuring your pet's custom watercolor portrait",
  discountPercent: 31,
  originalPrice: 29,
  salePrice: 19.9,
};

export type OrderBumpColor = 'silver' | 'black' | 'grey' | 'white';
export type OrderBumpSize = 'One Size' | 'S' | 'M' | 'L' | 'XL' | '2XL';

// ---------------------------------------------------------------------------
// Store shape
// ---------------------------------------------------------------------------

interface CartStore {
  // State
  items: CartItem[];
  orderBump: OrderBumpItem | null;
  hasOrderBump: boolean;
  orderBumpColor: OrderBumpColor;
  orderBumpSize: OrderBumpSize;
  isOpen: boolean;

  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  addOrderBump: () => void;
  removeOrderBump: () => void;
  setOrderBumpColor: (color: OrderBumpColor) => void;
  setOrderBumpSize: (size: OrderBumpSize) => void;
  clearCart: () => void;

  // Derived (computed inline via getters — not stored)
  readonly subtotal: number;
  readonly itemCount: number;
  readonly freeShippingRemaining: number;
  readonly hasFreeShipping: boolean;
  readonly shippingFee: number;
  readonly total: number;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

function computeTotals(
  items: CartItem[],
  hasOrderBump: boolean,
  orderBump: OrderBumpItem | null,
) {
  const itemsSubtotal = items.reduce(
    (sum, item) => sum + (item.unitPrice || 0) * (item.quantity || 1),
    0,
  );
  const bumpPrice = hasOrderBump && orderBump ? orderBump.salePrice : 0;
  const merchandiseTotal = itemsSubtotal + bumpPrice;
  const itemCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0) + (hasOrderBump ? 1 : 0);
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - merchandiseTotal);
  const hasFreeShipping = merchandiseTotal >= FREE_SHIPPING_THRESHOLD;
  const shippingFee = items.length > 0 ? (hasFreeShipping ? 0 : STANDARD_SHIPPING_FEE) : 0;
  const total = merchandiseTotal + shippingFee;

  return {
    subtotal: itemsSubtotal,
    itemCount,
    freeShippingRemaining,
    hasFreeShipping,
    shippingFee,
    total: Math.round(total * 100) / 100,
  };
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // State
      items: [],
      orderBump: null,
      hasOrderBump: false,
      orderBumpColor: 'silver',
      orderBumpSize: 'One Size',
      isOpen: false,
      subtotal: 0,
      itemCount: 0,
      freeShippingRemaining: FREE_SHIPPING_THRESHOLD,
      hasFreeShipping: false,
      shippingFee: 0,
      total: 0,

      // Actions
      addItem: (item: CartItem) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          const nextItems = existing
            ? state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i,
              )
            : [...state.items, item];

          return {
            items: nextItems,
            ...computeTotals(nextItems, state.hasOrderBump, state.orderBump),
          };
        }),

      removeItem: (id: string) =>
        set((state) => {
          const nextItems = state.items.filter((i) => i.id !== id);
          return {
            items: nextItems,
            ...computeTotals(nextItems, state.hasOrderBump, state.orderBump),
          };
        }),

      updateQuantity: (id: string, quantity: number) =>
        set((state) => {
          const nextItems =
            quantity <= 0
              ? state.items.filter((i) => i.id !== id)
              : state.items.map((i) =>
                  i.id === id ? { ...i, quantity } : i,
                );
          return {
            items: nextItems,
            ...computeTotals(nextItems, state.hasOrderBump, state.orderBump),
          };
        }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addOrderBump: () =>
        set((state) => ({
          orderBump: DEFAULT_ORDER_BUMP,
          hasOrderBump: true,
          ...computeTotals(state.items, true, DEFAULT_ORDER_BUMP),
        })),

      removeOrderBump: () =>
        set((state) => ({
          orderBump: null,
          hasOrderBump: false,
          ...computeTotals(state.items, false, null),
        })),

      setOrderBumpColor: (orderBumpColor: OrderBumpColor) => set({ orderBumpColor }),

      setOrderBumpSize: (orderBumpSize: OrderBumpSize) => set({ orderBumpSize }),

      clearCart: () =>
        set({
          items: [],
          orderBump: null,
          hasOrderBump: false,
          isOpen: false,
          subtotal: 0,
          itemCount: 0,
          freeShippingRemaining: FREE_SHIPPING_THRESHOLD,
          hasFreeShipping: false,
          shippingFee: 0,
          total: 0,
        }),
    }),
    {
      name: 'paw-cart',
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => key !== 'isOpen'),
        ) as Omit<CartStore, 'isOpen'>,
      onRehydrateStorage: () => (state) => {
        if (state) {
          const totals = computeTotals(
            state.items || [],
            Boolean(state.hasOrderBump),
            state.orderBump || null,
          );
          Object.assign(state, totals);
        }
      },
    },
  ),
);

