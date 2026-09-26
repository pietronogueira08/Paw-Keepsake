import { NextRequest, NextResponse } from 'next/server';
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

    // Stripe gateway is decommissioned while transitioning to owner's new account
    return NextResponse.json(
      {
        error:
          'Our payment gateway is currently undergoing an account update. Please reach out to pawkeepsake@gmail.com for priority order processing or check back shortly!',
        status: 'gateway_transition',
      },
      { status: 503 },
    );
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
