'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, OrderBumpItem } from '@/types/ecommerce';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DEFAULT_ORDER_BUMP: OrderBumpItem = {
  id: 'comfort-tshirt',
  name: 'Matching Comfort Colors T-Shirt',
  description:
    "Premium unisex tee with your pet's watercolor art printed on the chest",
  discountPercent: 35,
  originalPrice: 45,
  salePrice: 29,
};

// ---------------------------------------------------------------------------
// Store shape
// ---------------------------------------------------------------------------

interface CartStore {
  // State
  items: CartItem[];
  orderBump: OrderBumpItem | null;
  hasOrderBump: boolean;
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
  clearCart: () => void;

  // Derived (computed inline via getters — not stored)
  readonly subtotal: number;
  readonly itemCount: number;
  readonly freeShippingRemaining: number;
  readonly hasFreeShipping: boolean;
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
  const subtotal = items.reduce(
    (sum, item) => sum + (item.unitPrice || 0) * (item.quantity || 1),
    0,
  );
  const itemCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const hasFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const total = subtotal + (hasOrderBump && orderBump ? orderBump.salePrice : 0);

  return {
    subtotal,
    itemCount,
    freeShippingRemaining,
    hasFreeShipping,
    total,
  };
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // State
      items: [],
      orderBump: null,
      hasOrderBump: false,
      isOpen: false,
      subtotal: 0,
      itemCount: 0,
      freeShippingRemaining: FREE_SHIPPING_THRESHOLD,
      hasFreeShipping: false,
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

