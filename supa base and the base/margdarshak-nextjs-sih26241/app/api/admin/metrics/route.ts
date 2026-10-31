import { NextRequest, NextResponse } from 'next/server';

const MIN_K_ANONYMITY = 5;

export function filterKAnonymousGroups<T extends { concern_count: number }>(rows: T[]): {
  visibleRows: T[];
  suppressedRowCount: number;
} {
  const visibleRows = rows.filter((r) => r.concern_count >= MIN_K_ANONYMITY);
  const suppressedRowCount = rows.length - visibleRows.length;
  return { visibleRows, suppressedRowCount };
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 401 });
  }
  return NextResponse.json({ kThreshold: MIN_K_ANONYMITY, status: 'protected' });
}
