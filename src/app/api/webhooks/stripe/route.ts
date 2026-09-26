import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

/**
 * Stripe webhook endpoint decommissioned.
 * Prevents third-party or ex-partner Stripe events from interacting with Printify.
 */
export async function POST(): Promise<NextResponse> {
  return NextResponse.json({
    received: true,
    status: 'decommissioned',
    message: 'Stripe webhook integration is inactive.',
  });
}
