import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    const token = cookies().get('tx_admin_token')?.value;
    if (token !== 'authenticated') {
      return NextResponse.json({ success: false, error: 'Avtorizatsiyadan o‘tilmagan' }, { status: 401 });
    }

    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'Ma‘lumot to‘liq emas' }, { status: 400 });
    }

    const leadsDir = path.join(process.cwd(), 'data', 'leads');
    const filePath = path.join(leadsDir, `${id}.json`);

    const content = await fs.readFile(filePath, 'utf-8');
    const lead = JSON.parse(content);
    
    lead.status = status;
    await fs.writeFile(filePath, JSON.stringify(lead, null, 2), 'utf-8');

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Lead topilmadi yoki yangilab bo‘lmadi' }, { status: 500 });
  }
}
