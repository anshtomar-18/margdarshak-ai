import { NextRequest, NextResponse } from 'next/server';
import { getTradesFiltered, SOURCES } from '@/lib/db/catalogue';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const region = searchParams.get('region') || undefined;
  const category = searchParams.get('category') || undefined;
  const search = searchParams.get('search') || undefined;
  const nsqfLevel = searchParams.get('nsqfLevel') ? Number(searchParams.get('nsqfLevel')) : undefined;
  const maxDuration = searchParams.get('maxDuration') ? Number(searchParams.get('maxDuration')) : undefined;

  const trades = getTradesFiltered({ region, category, search, nsqfLevel, maxDuration });
  return NextResponse.json(
    {
      disclaimer: 'Demonstration data, not official government figures.',
      count: trades.length,
      trades,
      sources: SOURCES,
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    }
  );
}
