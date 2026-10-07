import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getLocaleConfig, getCanvasPrice, toStripeAmount, type SupportedCurrency } from '@/lib/locale';

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
    // Read the country from the header set by proxy.ts (Vercel geo-detection).
    // Falls back to 'US' if running locally without the Vercel header.
    const countryHeader = req.headers.get('x-pk-country') ??
      req.cookies.get('pk-country')?.value ??
      'US';

    const localeConfig = getLocaleConfig(countryHeader);
    const currency: SupportedCurrency = localeConfig.currency;
    const isUK = currency === 'gbp';

    // Verify real-time inventory from Printify
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

    // ── Stripe gateway is decommissioned while transitioning to owner's new account ─
    // Remove this block and uncomment the Stripe code below once the new account is connected.
    return NextResponse.json(
      {
        error:
          'Our payment gateway is currently undergoing an account update. Please reach out to pawkeepsake@gmail.com for priority order processing or check back shortly!',
        status: 'gateway_transition',
        currency, // expose so client can show correct currency symbol
        locale: localeConfig.locale,
      },
      { status: 503 },
    );

    /* ── Uncomment when new Stripe account is connected ─────────────────────────
    const { stripe } = await import('@/lib/stripe');

    const lineItems = validated.items.map((item) => {
      // Use locale-aware price if available, otherwise fall back to unitPrice
      const localizedPrice = getCanvasPrice(item.size, localeConfig);
      const unitAmount = toStripeAmount(localizedPrice || item.unitPrice);

      return {
        price_data: {
          currency,
          product_data: {
            name: `Custom Memorial Canvas — ${item.petName}`,
            description: `${item.breed?.name ?? 'Pet'} • ${item.size}" • ${item.dateRange}`,
            metadata: {
              breed_id: item.breed?.id ?? '',
              breed_name: item.breed?.name ?? '',
              pet_name: item.petName,
              date_range: item.dateRange,
              quote: item.quote,
              size: item.size,
              frame_style: item.frameStyle ?? '',
              product_type: item.productType,
            },
          },
          unit_amount: unitAmount,
        },
        quantity: item.quantity,
      };
    });

    // Add mug order bump if present
    if (validated.hasOrderBump && validated.orderBumpType === 'mug') {
      const mugPrice = toStripeAmount(localeConfig.prices.mug);
      lineItems.push({
        price_data: {
          currency,
          product_data: {
            name: isUK ? 'Memorial Ceramic Mug — 11oz' : 'Memorial Ceramic Mug — 11oz',
            description: "Premium ceramic mug with your pet's watercolor art",
            metadata: { product_type: 'order-bump-mug' },
          },
          unit_amount: mugPrice,
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'link'],
      line_items: lineItems,
      mode: 'payment',
      success_url: validated.successUrl,
      cancel_url: validated.cancelUrl,
      currency,
      shipping_address_collection: {
        // Support US domestic + UK. Add more as you expand.
        allowed_countries: ['US', 'CA', 'GB'],
      },
      billing_address_collection: 'auto',
      phone_number_collection: { enabled: true },
      custom_text: {
        submit: {
          message: isUK
            ? 'Your memorial will be printed and fulfilled in the UK within 1 business day.'
            : 'Your memorial will be printed and shipped within 1 business day.',
        },
      },
      metadata: {
        source: 'paw-keepsake-web',
        item_count: String(validated.items.length),
        locale: localeConfig.locale,
        country: countryHeader,
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
    ─────────────────────────────────────────────────────────────────────────── */

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.errors },
        { status: 400 },
      );
    }
    const message =
      error instanceof Error ? error.message : 'Failed to process checkout request';
    console.error('Checkout error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
