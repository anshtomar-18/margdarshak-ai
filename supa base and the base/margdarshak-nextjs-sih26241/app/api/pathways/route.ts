import { NextRequest, NextResponse } from 'next/server';
import { TRADES } from '@/lib/db/catalogue';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tradeAId = searchParams.get('tradeA') || 'TRD-ELEC';
  const tradeBId = searchParams.get('tradeB') || 'TRD-SOLAR';

  const tradeA = TRADES.find((t) => t.id === tradeAId) || TRADES[0];
  const tradeB = TRADES.find((t) => t.id === tradeBId) || TRADES[1];

  return NextResponse.json({
    note: 'Pathways are presented as options subject to local institute availability and assessment, never guarantees.',
    tradeA,
    tradeB,
  });
}
