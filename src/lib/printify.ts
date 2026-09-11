/**
 * Paw & Keepsake — Printify API Client
 * Automatically creates print orders when Stripe payments succeed.
 */

const PRINTIFY_BASE_URL = 'https://api.printify.com/v1';

export const PRINTIFY_CONFIG = {
  shopId: process.env.PRINTIFY_SHOP_ID || '28881871',
  canvasProductId: process.env.PRINTIFY_CANVAS_PRODUCT_ID || '6aa481666de8ba75bb0c008d',
  tshirtProductId: process.env.PRINTIFY_TSHIRT_PRODUCT_ID || '6aa4834fd72c2d45ea019c86',
};

// Exact Variant IDs from user's Printify store
export const PRINTIFY_CANVAS_VARIANTS: Record<string, number> = {
  '8x12': 93707,  // 8" x 12" (Vertical) / 1.5" - Cost $19.38
  '12x16': 93709, // 12″ x 16″ (Vertical) / 1.5" - Cost $30.38
  '16x20': 93710, // 16" x 20" (Vertical) / 1.5" - Cost $38.59
  '16x24': 93711, // 16″ x 24″ (Vertical) / 1.5" - Cost $40.23
  // Fallbacks
  '8x10': 93707,
  '18x24': 93711,
  '24x36': 93711,
};

// T-shirt variant IDs (Next Level 6210 CVC Black / White)
export const PRINTIFY_TSHIRT_VARIANTS: Record<string, number> = {
  'S': 100246,
  'M': 100247,
  'L': 100248,
  'XL': 100249,
  '2XL': 100250,
  '3XL': 100251,
};

function getHeaders() {
  const token = process.env.PRINTIFY_API_TOKEN;
  if (!token) {
    throw new Error('PRINTIFY_API_TOKEN environment variable is missing');
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'User-Agent': 'PawAndKeepsake/1.0',
  };
}

export interface PrintifyShippingAddress {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  country: string;
  region: string; // State code e.g. "CA", "TX"
  address1: string;
  address2?: string;
  city: string;
  zip: string;
}

export interface CreatePrintifyOrderParams {
  externalId: string; // Stripe checkout session ID
  shippingAddress: PrintifyShippingAddress;
  items: Array<{
    productType: 'museum-canvas' | 'framed-print' | 'apparel';
    size: string;
    quantity: number;
    printFileUrl?: string;
    apparelSize?: string;
  }>;
  autoSubmit?: boolean; // If true, automatically sends order to production
}

/**
 * Upload an artwork image directly to Printify media library
 */
export async function uploadImageToPrintify(fileUrl: string, fileName: string): Promise<string> {
  const res = await fetch(`${PRINTIFY_BASE_URL}/uploads/images.json`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      file_name: fileName,
      url: fileUrl,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to upload image to Printify: ${err}`);
  }

  const data = (await res.json()) as { id: string };
  return data.id;
}

/**
 * Creates an order on Printify for fulfillment
 */
export async function createPrintifyOrder(params: CreatePrintifyOrderParams) {
  const { externalId, shippingAddress, items, autoSubmit = false } = params;
  const shopId = PRINTIFY_CONFIG.shopId;

  const lineItems = items.map((item) => {
    if (item.productType === 'apparel') {
      const variantId = PRINTIFY_TSHIRT_VARIANTS[item.apparelSize || 'L'] || PRINTIFY_TSHIRT_VARIANTS['L'];
      return {
        product_id: PRINTIFY_CONFIG.tshirtProductId,
        variant_id: variantId,
        quantity: item.quantity,
      };
    }

    const variantId = PRINTIFY_CANVAS_VARIANTS[item.size] || PRINTIFY_CANVAS_VARIANTS['12x16'];
    const lineItem: Record<string, unknown> = {
      product_id: PRINTIFY_CONFIG.canvasProductId,
      variant_id: variantId,
      quantity: item.quantity,
    };

    if (item.printFileUrl) {
      lineItem.print_areas = {
        front: item.printFileUrl,
      };
    }

    return lineItem;
  });

  const payload = {
    external_id: externalId,
    label: `Paw & Keepsake #${externalId.slice(-6).toUpperCase()}`,
    line_items: lineItems,
    shipping_method: 1, // Standard US shipping
    send_shipping_notification: true,
    address_to: {
      first_name: shippingAddress.first_name,
      last_name: shippingAddress.last_name,
      email: shippingAddress.email,
      phone: shippingAddress.phone || '',
      country: shippingAddress.country || 'US',
      region: shippingAddress.region,
      address1: shippingAddress.address1,
      address2: shippingAddress.address2 || '',
      city: shippingAddress.city,
      zip: shippingAddress.zip,
    },
  };

  console.info(`[Printify] Creating order for shop ${shopId}:`, JSON.stringify(payload, null, 2));

  const res = await fetch(`${PRINTIFY_BASE_URL}/shops/${shopId}/orders.json`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    console.error(`[Printify] Error creating order (${res.status}):`, errorBody);
    throw new Error(`Printify order creation failed: ${errorBody}`);
  }

  const orderResult = (await res.json()) as { id: string; status: string };
  console.info(`[Printify] ✅ Order successfully created with ID: ${orderResult.id}`);

  // Automatically submit to production if enabled
  if (autoSubmit && orderResult.id) {
    try {
      const sendRes = await fetch(`${PRINTIFY_BASE_URL}/shops/${shopId}/orders/${orderResult.id}/send_to_production.json`, {
        method: 'POST',
        headers: getHeaders(),
      });
      if (sendRes.ok) {
        console.info(`[Printify] 🚀 Order ${orderResult.id} sent directly to production!`);
      }
    } catch (e) {
      console.warn(`[Printify] Could not auto-send to production:`, e);
    }
  }

  return orderResult;
}

export interface InventoryStatus {
  canvas: Record<string, { available: boolean; variantId: number; title: string }>;
  tshirt: {
    available: boolean;
    sizes: Record<string, boolean>;
  };
  lastChecked: number;
}

let cachedInventory: InventoryStatus | null = null;
let cacheExpiry = 0;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds TTL

export function invalidateInventoryCache() {
  cachedInventory = null;
  cacheExpiry = 0;
}

/**
 * Fetch live availability directly from Printify's catalog for all active variants
 */
export async function getPrintifyInventory(forceRefresh = false): Promise<InventoryStatus> {
  const now = Date.now();
  if (!forceRefresh && cachedInventory && now < cacheExpiry) {
    return cachedInventory;
  }

  const shopId = PRINTIFY_CONFIG.shopId;

  // Default fallback if API fails
  const fallback: InventoryStatus = {
    canvas: {
      '8x12': { available: true, variantId: PRINTIFY_CANVAS_VARIANTS['8x12'], title: '8" x 12"' },
      '12x16': { available: true, variantId: PRINTIFY_CANVAS_VARIANTS['12x16'], title: '12" x 16"' },
      '16x20': { available: true, variantId: PRINTIFY_CANVAS_VARIANTS['16x20'], title: '16" x 20"' },
      '16x24': { available: true, variantId: PRINTIFY_CANVAS_VARIANTS['16x24'], title: '16" x 24"' },
    },
    tshirt: {
      available: true,
      sizes: { S: true, M: true, L: true, XL: true, '2XL': true, '3XL': true },
    },
    lastChecked: now,
  };

  try {
    const headers = getHeaders();

    // Fetch Canvas Product
    const canvasRes = await fetch(`${PRINTIFY_BASE_URL}/shops/${shopId}/products/${PRINTIFY_CONFIG.canvasProductId}.json`, {
      headers,
      next: { revalidate: 60 },
    });

    let canvasVariantsMap = fallback.canvas;

    if (canvasRes.ok) {
      const canvasData = (await canvasRes.json()) as {
        variants: Array<{ id: number; title: string; is_available: boolean; is_enabled: boolean }>;
      };

      const variantIdToAvailability = new Map<number, boolean>();
      canvasData.variants?.forEach((v) => {
        variantIdToAvailability.set(v.id, Boolean(v.is_available && v.is_enabled));
      });

      canvasVariantsMap = {
        '8x12': {
          available: variantIdToAvailability.get(PRINTIFY_CANVAS_VARIANTS['8x12']) ?? true,
          variantId: PRINTIFY_CANVAS_VARIANTS['8x12'],
          title: '8" x 12"',
        },
        '12x16': {
          available: variantIdToAvailability.get(PRINTIFY_CANVAS_VARIANTS['12x16']) ?? true,
          variantId: PRINTIFY_CANVAS_VARIANTS['12x16'],
          title: '12" x 16"',
        },
        '16x20': {
          available: variantIdToAvailability.get(PRINTIFY_CANVAS_VARIANTS['16x20']) ?? true,
          variantId: PRINTIFY_CANVAS_VARIANTS['16x20'],
          title: '16" x 20"',
        },
        '16x24': {
          available: variantIdToAvailability.get(PRINTIFY_CANVAS_VARIANTS['16x24']) ?? true,
          variantId: PRINTIFY_CANVAS_VARIANTS['16x24'],
          title: '16" x 24"',
        },
      };
    }

    // Fetch T-Shirt Product
    const tshirtRes = await fetch(`${PRINTIFY_BASE_URL}/shops/${shopId}/products/${PRINTIFY_CONFIG.tshirtProductId}.json`, {
      headers,
      next: { revalidate: 60 },
    });

    let tshirtStatus = fallback.tshirt;

    if (tshirtRes.ok) {
      const tshirtData = (await tshirtRes.json()) as {
        variants: Array<{ id: number; title: string; is_available: boolean; is_enabled: boolean }>;
      };

      const tshirtIdToAvailability = new Map<number, boolean>();
      tshirtData.variants?.forEach((v) => {
        tshirtIdToAvailability.set(v.id, Boolean(v.is_available && v.is_enabled));
      });

      const sizesMap: Record<string, boolean> = {};
      let atLeastOneAvailable = false;

      Object.entries(PRINTIFY_TSHIRT_VARIANTS).forEach(([sizeKey, varId]) => {
        const isAvail = tshirtIdToAvailability.get(varId) ?? true;
        sizesMap[sizeKey] = isAvail;
        if (isAvail) atLeastOneAvailable = true;
      });

      tshirtStatus = {
        available: atLeastOneAvailable,
        sizes: sizesMap,
      };
    }

    cachedInventory = {
      canvas: canvasVariantsMap,
      tshirt: tshirtStatus,
      lastChecked: now,
    };
    cacheExpiry = now + CACHE_TTL_MS;

    return cachedInventory;
  } catch (err) {
    console.warn('[Printify] Error fetching live inventory, falling back to cache:', err);
    return cachedInventory || fallback;
  }
}
