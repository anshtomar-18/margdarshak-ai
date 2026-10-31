import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const FeedbackSchema = z.object({
  sessionId: z.string().uuid(),
  concernId: z.string().optional(),
  isHelpful: z.boolean(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = FeedbackSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid feedback payload' }, { status: 400 });
    }
    return NextResponse.json({ status: 'recorded', isHelpful: parsed.data.isHelpful });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
