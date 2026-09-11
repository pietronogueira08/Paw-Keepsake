import { NextRequest, NextResponse } from 'next/server';
import { getPrintifyInventory, invalidateInventoryCache } from '@/lib/printify';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const force = searchParams.get('refresh') === 'true';

    if (force) {
      invalidateInventoryCache();
    }

    const inventory = await getPrintifyInventory(force);

    return NextResponse.json(inventory, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('[inventory-api] Error fetching inventory:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory status' },
      { status: 500 }
    );
  }
}
