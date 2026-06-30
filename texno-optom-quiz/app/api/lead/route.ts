import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { leadFormSchema } from '@/lib/validators';
import { sendTelegramMessage } from '@/lib/telegram';
import { saveLead } from '@/lib/storage';
import type { Lead } from '@/types';

// Simple in-memory rate limiting map: IP -> timestamp
const rateLimitMap = new Map<string, number>();

export async function POST(req: NextRequest) {
  try {
    // 1. Get Client IP
    const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';

    // 2. Rate Limit Check (1 submission per minute per IP)
    const now = Date.now();
    const lastSubmit = rateLimitMap.get(ip);
    if (lastSubmit && now - lastSubmit < 60 * 1000) {
      return NextResponse.json(
        { success: false, error: 'rate_limit_exceeded', message: 'Ko‘p so‘rov yuborildi. 1 daqiqadan so‘ng qayta urinib ko‘ring.' },
        { status: 429 }
      );
    }
    rateLimitMap.set(ip, now);

    // Clean up old IP entries periodically
    if (rateLimitMap.size > 1000) {
      rateLimitMap.clear();
      rateLimitMap.set(ip, now);
    }

    // 3. Parse Body
    const body = await req.json();
    const { build, lead, meta, totalPrice, priceRange } = body;

    if (!lead || !build) {
      return NextResponse.json(
        { success: false, error: 'invalid_payload', details: ['lead and build objects required'] },
        { status: 400 }
      );
    }

    // 4. Validate with Zod
    const validationResult = leadFormSchema.safeParse(lead);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'validation_failed',
          details: validationResult.error.errors.map((e) => e.message),
        },
        { status: 400 }
      );
    }

    // 5. Honeypot check
    if (lead.email && lead.email.trim() !== '') {
      // Reject quietly
      return NextResponse.json({ success: true, id: 'lead_bot_rejected' });
    }

    // 6. Generate unique ID
    const leadId = `lead_${Math.random().toString(36).substring(2, 9)}`;

    // 7. Construct complete Lead Object
    const fullLead: Lead = {
      id: leadId,
      name: lead.name,
      phone: lead.phone,
      telegram: lead.telegram,
      build,
      total_price: totalPrice || 0,
      price_range: priceRange || { min: 0, max: 0 },
      status: 'new',
      created_at: new Date().toISOString(),
      meta: {
        user_agent: meta?.userAgent || req.headers.get('user-agent') || '',
        referrer: meta?.referrer || '',
        ip,
      },
    };

    // 8. Save locally
    await saveLead(fullLead);

    // 9. Send to Telegram
    const tgSuccess = await sendTelegramMessage(fullLead);

    if (!tgSuccess) {
      // Log failure but still return OK since we saved it locally
      console.warn(`Lead #${leadId} saqlandi, lekin Telegramga yuborish muvaffaqiyatsiz bo‘ldi.`);
    }

    return NextResponse.json({ success: true, id: leadId });
  } catch (err) {
    console.error('POST /api/lead xatosi:', err);
    return NextResponse.json(
      { success: false, error: 'internal_server_error' },
      { status: 500 }
    );
  }
}
