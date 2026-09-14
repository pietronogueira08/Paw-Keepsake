import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { z } from 'zod';

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
  orderBumpDetails: z
    .object({
      color: z.string().optional(),
      size: z.string().optional(),
    })
    .optional(),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json() as unknown;
    const validated = CheckoutRequestSchema.parse(body);

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      validated.items.map((item) => {
        // Build a nice description for the Stripe invoice
        const features = [];
        if (item.breed) features.push(item.breed.name);
        features.push(`Size: ${item.size}`);
        if (item.selectedCoat) features.push(`Coat: ${item.selectedCoat}`);
        if (item.color) features.push(`Color: ${item.color}`);
        if (item.dateRange) features.push(item.dateRange);

        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${item.petName ? item.petName + "'s " : ''}${item.productTitle}`,
              description: features.join(' · '),
              metadata: {
                cart_item_id: item.id,
                product_type: item.productType,
                breed_id: item.breed?.id || '',
                breed_name: item.breed?.name || '',
                selected_coat: item.selectedCoat || '',
                pet_name: item.petName,
                date_range: item.dateRange,
                quote: item.quote.slice(0, 500),
                size: item.size,
                frame_style: item.frameStyle || '',
                color: item.color || '',
              },
            },
            unit_amount: Math.round(item.unitPrice * 100),
          },
          quantity: item.quantity,
        };
      });

    if (validated.hasOrderBump) {
      const bumpColor = validated.orderBumpDetails?.color?.toUpperCase() || 'WHITE';
      const bumpSize = validated.orderBumpDetails?.size || 'L';
      const firstPet = validated.items[0]?.petName || 'Pet';
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Matching Comfort Colors T-Shirt — ${firstPet} (${bumpColor}, Size ${bumpSize})`,
            description: `Custom ${firstPet}'s watercolor art on chest · 100% Ring-Spun Cotton · ${bumpColor} · Size ${bumpSize}`,
            metadata: {
              product_type: 'apparel-tshirt',
              color: bumpColor.toLowerCase(),
              size: bumpSize,
              pet_name: firstPet,
            },
          },
          unit_amount: 2900,
        },
        quantity: 1,
      });
    }

    // Verify real-time inventory from Printify before charging the customer
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

    if (validated.hasOrderBump && !inventory.tshirt.available) {
      return NextResponse.json(
        {
          error: 'The matching memorial t-shirt is temporarily out of stock.',
          outOfStockItem: 'tshirt',
        },
        { status: 409 },
      );
    }

    const session = await stripe.checkout.sessions.create({
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
          message: 'Your memorial will be carefully crafted and shipped within 1-2 business days.',
        },
      },
      metadata: {
        source: 'paw-keepsake-web',
        item_count: String(validated.items.length),
        has_order_bump: String(validated.hasOrderBump),
        canvas_size: validated.items[0]?.size || '12x16',
        pet_name: validated.items[0]?.petName || '',
        breed_name: validated.items[0]?.breed?.name || '',
        breed_id: validated.items[0]?.breed?.id || '',
        selected_coat: validated.items[0]?.selectedCoat || '',
        quote: (validated.items[0]?.quote || '').slice(0, 200),
        date_range: validated.items[0]?.dateRange || '',
        bump_size: validated.orderBumpDetails?.size || 'L',
        bump_color: validated.orderBumpDetails?.color || 'WHITE',
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
    const message = error instanceof Error ? error.message : 'Failed to create checkout session';
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}
