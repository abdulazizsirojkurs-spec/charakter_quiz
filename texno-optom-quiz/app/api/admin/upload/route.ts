import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs/promises';
import path from 'path';
import { parseExcelBuffer } from '@/lib/excel-parser';

export async function POST(req: Request) {
  try {
    // 1. Auth check
    const token = cookies().get('tx_admin_token')?.value;
    if (token !== 'authenticated') {
      return NextResponse.json({ success: false, error: 'Avtorizatsiyadan o‘tilmagan' }, { status: 401 });
    }

    // 2. Parse Multipart form data
    const formData = await req.formData();
    const file = formData.get('file') as Blob | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'Fayl yuklanmadi' }, { status: 400 });
    }

    // Check extension
    const filename = (file as any).name || '';
    if (!filename.endsWith('.xlsx')) {
      return NextResponse.json({ success: false, error: 'Faqat .xlsx formatidagi fayllar qabul qilinadi' }, { status: 400 });
    }

    // 3. Convert Blob to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 4. Parse Excel file via SheetJS logic
    const result = parseExcelBuffer(buffer);

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: 'Faylni o‘qishda xatolar aniqlandi',
        details: result.errors,
      }, { status: 400 });
    }

    // 5. Write successfully validated data to data/products.json
    const dataDir = path.join(process.cwd(), 'data');
    await fs.mkdir(dataDir, { recursive: true });
    
    // Backup old file if exists
    const mainPath = path.join(dataDir, 'products.json');
    try {
      const oldContent = await fs.readFile(mainPath, 'utf-8');
      const archiveDir = path.join(dataDir, 'archive');
      await fs.mkdir(archiveDir, { recursive: true });
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      await fs.writeFile(path.join(archiveDir, `products-${timestamp}.json`), oldContent, 'utf-8');
    } catch (e) {
      // no old file yet, fine
    }

    // Merge with products.sample.json to preserve our custom cases and monitors
    try {
      const samplePath = path.join(dataDir, 'products.sample.json');
      const sampleContent = await fs.readFile(samplePath, 'utf-8');
      const sampleProducts = JSON.parse(sampleContent);
      
      const extraProducts = sampleProducts.filter((p: any) => 
        p.category === 'platform' || p.category === 'case' || p.category === 'monitor'
      );
      
      const excelIds = new Set(result.products.map(p => p.id));
      for (const ep of extraProducts) {
        if (!excelIds.has(ep.id)) {
          result.products.push(ep);
        } else {
          const existing = result.products.find(p => p.id === ep.id);
          if (existing && ep.image_url) {
             existing.image_url = ep.image_url;
          }
        }
      }
    } catch(e) {
      console.error('Failed to merge sample data', e);
    }

    // Write new configuration file
    await fs.writeFile(mainPath, JSON.stringify(result.products, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      counts: result.counts,
      total: result.products.length,
    });
  } catch (err) {
    console.error('POST /api/admin/upload xatosi:', err);
    return NextResponse.json({ success: false, error: 'Server xatosi' }, { status: 500 });
  }
}
