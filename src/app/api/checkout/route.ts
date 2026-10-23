import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { z } from 'zod';
import {
  getLocaleConfig,
  getCanvasPrice,
  toStripeAmount,
  type SupportedCurrency,
} from '@/lib/locale';

export const runtime = 'nodejs';

const CartItemSchema = z.object({
  id: z.string(),
  productTitle: z.string(),
  productType: z.string(),
  breed: z.object({ name: z.string(), id: z.string() }).passthrough().nullable(),
  selectedCoat: z.string().optional(),
  petName: z.string(),
  dateRange: z.string(),
  quote: z.string(),
  size: z.string(),
  frameStyle: z.string().nullable(),
  color: z.string().optional(),
  quantity: z.number().min(1).max(20),
  unitPrice: z.number().positive(),
});

const CheckoutRequestSchema = z.object({
  items: z.array(CartItemSchema).min(1),
  hasOrderBump: z.boolean(),
  orderBumpType: z.enum(['keyring', 'mug']).optional(),
  orderBumpDetails: z
    .object({
      color: z.string().optional(),
      size: z.string().optional(),
      type: z.string().optional(),
    })
    .optional(),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = (await req.json()) as unknown;
    const validated = CheckoutRequestSchema.parse(body);

    // ── Locale / Currency Detection ──────────────────────────────────────────
    // Detect visitor country from Vercel header or cookie set by proxy.ts
    const countryHeader =
      req.headers.get('x-pk-country') ??
      req.cookies.get('pk-country')?.value ??
      'US';

    const localeConfig = getLocaleConfig(countryHeader);
    const currency: SupportedCurrency = localeConfig.currency;
    const isUK = currency === 'gbp';

    // ── Real-time inventory check from Printify ───────────────────────────────
    try {
      const { getPrintifyInventory } = await import('@/lib/printify');
      const inventory = await getPrintifyInventory();

      for (const item of validated.items) {
        const sizeStock = inventory.canvas[item.size];
        if (sizeStock && !sizeStock.available) {
          return NextResponse.json(
            {
              error: `The ${item.size}" canvas is temporarily out of stock at our print facility. Please choose a different size.`,
              outOfStockSize: item.size,
            },
            { status: 409 },
          );
        }
      }
    } catch (invErr) {
      // Don't block checkout completely if inventory check network fails
      console.warn('[checkout] Inventory check skipped due to error:', invErr);
    }

    // ── Build Line Items ──────────────────────────────────────────────────────
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      validated.items.map((item) => {
        const localizedPrice = getCanvasPrice(item.size, localeConfig);
        const unitAmount = toStripeAmount(localizedPrice || item.unitPrice);

        const features: string[] = [];
        if (item.breed?.name) features.push(item.breed.name);
        features.push(`Size: ${item.size}"`);
        if (item.selectedCoat) features.push(`Coat: ${item.selectedCoat}`);
        if (item.dateRange) features.push(item.dateRange);

        return {
          price_data: {
            currency,
            product_data: {
              name: `Custom Memorial Canvas — ${item.petName}`,
              description: features.join(' · '),
              metadata: {
                cart_item_id: item.id,
                product_type: item.productType || 'museum-canvas',
                breed_id: item.breed?.id || '',
                breed_name: item.breed?.name || '',
                selected_coat: item.selectedCoat || '',
                pet_name: item.petName,
                date_range: item.dateRange,
                quote: (item.quote || '').slice(0, 500),
                size: item.size,
                frame_style: item.frameStyle || '',
              },
            },
            unit_amount: unitAmount,
          },
          quantity: item.quantity,
        };
      });

    // ── Add Order Bump (Ceramic Mug) if selected ──────────────────────────────
    const firstPetName = validated.items[0]?.petName || 'Beloved Pet';
    let bumpTotal = 0;

    if (validated.hasOrderBump) {
      const bumpPrice = localeConfig.prices.mug;
      bumpTotal = bumpPrice;
      const unitAmount = toStripeAmount(bumpPrice);

      lineItems.push({
        price_data: {
          currency,
          product_data: {
            name: `Matching Memorial Ceramic Mug (11 oz) — ${firstPetName}`,
            description: `Glossy ceramic mug with black accent handle featuring ${firstPetName}'s custom watercolor portrait`,
            metadata: {
              product_type: 'ceramic-mug',
              pet_name: firstPetName,
              size: '11oz',
            },
          },
          unit_amount: unitAmount,
        },
        quantity: 1,
      });
    }

    // ── Calculate Shipping (Free if threshold met) ────────────────────────────
    const merchandiseSubtotal =
      validated.items.reduce(
        (sum, item) =>
          sum +
          (getCanvasPrice(item.size, localeConfig) || item.unitPrice) *
            (item.quantity || 1),
        0,
      ) + bumpTotal;

    const qualifiesForFreeShipping =
      merchandiseSubtotal >= localeConfig.freeShippingThreshold;

    const shippingOptions: Stripe.Checkout.SessionCreateParams.ShippingOption[] =
      qualifiesForFreeShipping
        ? [
            {
              shipping_rate_data: {
                type: 'fixed_amount',
                fixed_amount: { amount: 0, currency },
                display_name: isUK
                  ? `Free Tracked UK Delivery (Orders £${localeConfig.freeShippingThreshold}+)`
                  : `Free Insured USA Shipping (Orders $${localeConfig.freeShippingThreshold}+)`,
                delivery_estimate: {
                  minimum: { unit: 'business_day', value: 3 },
                  maximum: { unit: 'business_day', value: 5 },
                },
              },
            },
          ]
        : [
            {
              shipping_rate_data: {
                type: 'fixed_amount',
                fixed_amount: {
                  amount: toStripeAmount(localeConfig.shippingCost),
                  currency,
                },
                display_name: isUK
                  ? 'Standard Tracked UK Delivery'
                  : 'Standard Insured USA Shipping',
                delivery_estimate: {
                  minimum: { unit: 'business_day', value: 3 },
                  maximum: { unit: 'business_day', value: 5 },
                },
              },
            },
          ];

    // ── Create Stripe Checkout Session ────────────────────────────────────────
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      shipping_options: shippingOptions,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB'],
      },
      billing_address_collection: 'auto',
      phone_number_collection: { enabled: true },
      success_url: validated.successUrl,
      cancel_url: validated.cancelUrl,
      custom_text: {
        submit: {
          message: isUK
            ? 'Your tribute is prepared with care and fulfilled in the UK within 1–2 working days.'
            : 'Your tribute is prepared with care and shipped within 1–2 business days.',
        },
      },
      metadata: {
        source: 'paw-keepsake-web',
        item_count: String(validated.items.length),
        has_order_bump: String(validated.hasOrderBump),
        bump_type: validated.hasOrderBump ? 'mug' : '',
        canvas_size: validated.items[0]?.size || '12x16',
        pet_name: firstPetName,
        breed_name: validated.items[0]?.breed?.name || '',
        breed_id: validated.items[0]?.breed?.id || '',
        selected_coat: validated.items[0]?.selectedCoat || '',
        quote: (validated.items[0]?.quote || '').slice(0, 200),
        date_range: validated.items[0]?.dateRange || '',
        locale: localeConfig.locale,
        currency,
        country: countryHeader,
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.errors },
        { status: 400 },
      );
    }
    const message =
      error instanceof Error ? error.message : 'Failed to create checkout session';
    console.error('[checkout] Error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
