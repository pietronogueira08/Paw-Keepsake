import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { z } from 'zod';

export const runtime = 'nodejs';

const CartItemSchema = z.object({
  productType: z.string(),
  breed: z.object({ name: z.string(), id: z.string() }),
  petName: z.string(),
  dateRange: z.string(),
  quote: z.string(),
  size: z.string(),
  frameStyle: z.string(),
  quantity: z.number().min(1).max(10),
  unitPrice: z.number().positive(),
});

const CheckoutRequestSchema = z.object({
  items: z.array(CartItemSchema).min(1),
  hasOrderBump: z.boolean(),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json() as unknown;
    const validated = CheckoutRequestSchema.parse(body);

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      validated.items.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Custom ${item.productType === 'museum-canvas' ? 'Museum Canvas' : 'Framed Fine Art Print'} — ${item.petName || item.breed.name}`,
            description: `${item.breed.name} · ${item.size.replace('x', '×')}" · ${item.dateRange}`,
            metadata: {
              breed_id: item.breed.id,
              breed_name: item.breed.name,
              pet_name: item.petName,
              date_range: item.dateRange,
              quote: item.quote.slice(0, 500),
              size: item.size,
              frame_style: item.frameStyle,
              product_type: item.productType,
            },
          },
          unit_amount: Math.round(item.unitPrice * 100),
        },
        quantity: item.quantity,
      }));

    if (validated.hasOrderBump) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: "Matching Comfort Colors T-Shirt (35% OFF)",
            description: "Premium unisex tee with your pet's watercolor art — add-on discount",
          },
          unit_amount: 2900,
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
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      billing_address_collection: 'auto',
      phone_number_collection: { enabled: true },
      custom_text: {
        submit: {
          message: 'Your memorial will be printed and shipped within 1 business day.',
        },
      },
      metadata: {
        source: 'paw-keepsake-web',
        item_count: String(validated.items.length),
        has_order_bump: String(validated.hasOrderBump),
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
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 },
    );
  }
}
