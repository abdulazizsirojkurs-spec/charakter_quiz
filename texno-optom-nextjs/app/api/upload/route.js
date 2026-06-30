import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import * as xlsx from 'xlsx';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const password = formData.get('password');
    const file = formData.get('file');

    if (password !== 'admin2024') {
      return NextResponse.json({ error: 'Noto\\'g\\'ri parol' }, { status: 401 });
    }

    if (!file) {
      return NextResponse.json({ error: 'Fayl topilmadi' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    
    // We expect the first sheet to have columns: id, category, name, price, socket, ddr, tdp, watt, form_factors, sockets
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet);

    const newDb = {
      cpu: [], mb: [], ram: [], gpu: [], storage: [], cooler: [], psu: [], case: []
    };

    rows.forEach(row => {
      const cat = row.category?.toLowerCase();
      if (newDb[cat]) {
        newDb[cat].push({
          id: row.id?.toString(),
          name: row.name,
          price: parseFloat(row.price),
          socket: row.socket || undefined,
          ddr: row.ddr || undefined,
          tdp: row.tdp ? parseInt(row.tdp) : undefined,
          watt: row.watt ? parseInt(row.watt) : undefined,
          form_factors: row.form_factors ? row.form_factors.split(',') : undefined,
          sockets: row.sockets ? row.sockets.split(',') : undefined,
          type: row.type || undefined
        });
      }
    });

    // Save back to data.json (Note: this works locally. On Vercel production, you need a DB like Vercel KV)
    const dataPath = path.join(process.cwd(), 'data.json');
    fs.writeFileSync(dataPath, JSON.stringify(newDb, null, 2));

    return NextResponse.json({ success: true, message: 'Baza muvaffaqiyatli yangilandi!' });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Yuklashda xatolik yuz berdi' }, { status: 500 });
  }
}
