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
      const firstPet = validated.items[0]?.petName || 'Beloved Pet';
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Matching Memorial Keepsake Keyring — ${firstPet}`,
            description: `Polished stainless steel medallion keyring featuring ${firstPet}'s custom watercolor portrait`,
            metadata: {
              product_type: 'keepsake-keyring',
              pet_name: firstPet,
            },
          },
          unit_amount: 1990, // $19.90 (in cents)
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

    // Calculate total merchandise to determine Free Shipping ($50+ threshold)
    const itemsSubtotal = validated.items.reduce(
      (sum, item) => sum + (item.unitPrice || 0) * (item.quantity || 1),
      0,
    );
    const merchandiseTotal = itemsSubtotal + (validated.hasOrderBump ? 19.9 : 0);
    const isFreeShipping = merchandiseTotal >= 50;

    const shippingOptions: Stripe.Checkout.SessionCreateParams.ShippingOption[] = isFreeShipping
      ? [
          {
            shipping_rate_data: {
              type: 'fixed_amount',
              fixed_amount: { amount: 0, currency: 'usd' },
              display_name: 'Free Insured Tracked Shipping (Orders $50+)',
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
              fixed_amount: { amount: 946, currency: 'usd' }, // $9.46 standard shipping
              display_name: 'Standard Insured Shipping',
              delivery_estimate: {
                minimum: { unit: 'business_day', value: 3 },
                maximum: { unit: 'business_day', value: 5 },
              },
            },
          },
        ];

    const session = await stripe.checkout.sessions.create({
      locale: 'en',
      line_items: lineItems,
      mode: 'payment',
      shipping_options: shippingOptions,
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
