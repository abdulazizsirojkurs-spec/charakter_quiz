import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getLeads } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const token = cookies().get('tx_admin_token')?.value;
    if (token !== 'authenticated') {
      return NextResponse.json({ success: false, error: 'Avtorizatsiyadan o‘tilmagan' }, { status: 401 });
    }

    const leads = await getLeads();
    return NextResponse.json({ success: true, leads });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Server xatosi' }, { status: 500 });
  }
}
