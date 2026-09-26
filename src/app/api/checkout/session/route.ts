import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

/**
 * Checkout session lookup endpoint.
 * Stripe session verification is decommissioned.
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    {
      error: 'Stripe integration decommissioned',
      isPaid: false,
    },
    { status: 404 }
  );
}
