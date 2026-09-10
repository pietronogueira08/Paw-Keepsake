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

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // State
      items: [],
      orderBump: null,
      hasOrderBump: false,
      isOpen: false,

      // Actions
      addItem: (item: CartItem) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i,
              ),
            };
          }
          return { items: [...state.items, item] };
        }),

      removeItem: (id: string) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      updateQuantity: (id: string, quantity: number) =>
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((i) => i.id !== id) };
          }
          return {
            items: state.items.map((i) =>
              i.id === id ? { ...i, quantity } : i,
            ),
          };
        }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addOrderBump: () =>
        set({ orderBump: DEFAULT_ORDER_BUMP, hasOrderBump: true }),

      removeOrderBump: () => set({ orderBump: null, hasOrderBump: false }),

      clearCart: () =>
        set({
          items: [],
          orderBump: null,
          hasOrderBump: false,
          isOpen: false,
        }),

      // Derived getters — computed on every access, never persisted
      get subtotal(): number {
        return get().items.reduce(
          (sum, item) => sum + item.unitPrice * item.quantity,
          0,
        );
      },

      get itemCount(): number {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      get freeShippingRemaining(): number {
        const remaining = FREE_SHIPPING_THRESHOLD - get().subtotal;
        return remaining > 0 ? remaining : 0;
      },

      get hasFreeShipping(): boolean {
        return get().subtotal >= FREE_SHIPPING_THRESHOLD;
      },

      get total(): number {
        const { subtotal, orderBump, hasOrderBump } = get();
        return subtotal + (hasOrderBump && orderBump ? orderBump.salePrice : 0);
      },
    }),
    {
      name: 'paw-cart',
      // Exclude isOpen so the drawer always starts closed after a page refresh.
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => key !== 'isOpen'),
        ) as Omit<CartStore, 'isOpen'>,
    },
  ),
);
