import { NextRequest, NextResponse } from 'next/server';
import { CounsellorRequestSchema, sanitizeUserText } from '@/lib/security/validation';
import { encryptSensitiveField } from '@/lib/security/encryption';
import { checkRateLimit } from '@/lib/security/rate-limit';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'local';
  const rate = checkRateLimit(`callback:${ip}`, 5, 60_000);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait before submitting another callback request.' },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const parsed = CounsellorRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const keyHex =
      process.env.CONTACT_ENCRYPTION_KEY_HEX ||
      '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

    const encryptedName = encryptSensitiveField(sanitizeUserText(parsed.data.name), keyHex);
    const encryptedContact = encryptSensitiveField(sanitizeUserText(parsed.data.contact), keyHex);
    const referenceCode = `MRG-${Date.now().toString(36).toUpperCase().slice(-6)}`;

    return NextResponse.json({
      status: 'pending',
      referenceCode,
      encryptedAtRest: Boolean(encryptedName && encryptedContact),
      message:
        'Callback request stored with status: pending. Note: This records your callback request; no live instant phone line is claimed.',
    });
  } catch {
    return NextResponse.json({ error: 'Unable to process callback request' }, { status: 500 });
  }
}
