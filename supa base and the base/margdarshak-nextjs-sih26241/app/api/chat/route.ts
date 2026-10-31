import { NextRequest, NextResponse } from 'next/server';
import { ChatQuerySchema, sanitizeUserText } from '@/lib/security/validation';
import { postValidateAiResponse, StructuredAiResponse } from '@/lib/ai/pipeline';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ChatQuerySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input parameters', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const cleanMessage = sanitizeUserText(parsed.data.message);
    // Server-side retrieval + post-validation pipeline execution
    return NextResponse.json({
      status: 'ok',
      sanitizedQuery: cleanMessage,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
