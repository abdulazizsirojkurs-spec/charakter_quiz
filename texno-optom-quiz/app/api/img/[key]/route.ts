import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Map of product image keys to their artifact filenames
const IMAGE_ARTIFACTS: Record<string, string> = {
  // Coolers
  'cooler-deepcool-le360-v2': 'media__1778777815246.png',
  'cooler-deepcool-ag620-g2': 'media__1778778168746.png',
  'cooler-deepcool-ak400': 'media__1778778392860.png',
  'cooler-grin-c40-pro': 'media__1778778675678.png',
  'cooler-jungle-c20-pro': 'media__1778779795669.png',
  // PSU
  'psu-xpower-550w': 'media__1778779937246.png',
  'psu-grin-kp-600w': 'media__1778780234959.png',
  'psu-deepcool-pf650': 'media__1778780285417.png',
  'psu-deepcool-pf750': 'media__1778780416868.png',
  'psu-deepcool-pk650d': 'media__1778780626149.png',
  'psu-deepcool-pn750d': 'media__1778780703975.png',
  'psu-deepcool-pq850g': 'media__1778782190816.png',
  'psu-deepcool-pn1000d': 'media__1778783130510.png',
  // Defaults
  'mb-default': 'media__1778783186729.png',
  'cpu-intel': 'media__1778783288893.png',
  'cpu-amd': 'media__1778783345562.png',
  'ram-default': 'media__1778765887508.png',
  // Monitors (from earlier in session)
  'monitor-ziffler': 'media__1778693342603.png',
  // Cases
  'case-texno-gaming': 'media__1778696013021.png',
  'case-mypro-mg13tg': 'media__1778696352649.png',
  'case-mypro-nova-white': 'media__1778696352674.png',
  'case-mypro-nova-black': 'media__1778696632135.png',
};

const ARTIFACTS_DIR = path.join(
  process.env.HOME || '/Users/macbookpro',
  '.gemini/antigravity/brain/4ab4f03f-3023-47fd-a684-646205d21ce7'
);

export async function GET(
  req: NextRequest,
  { params }: { params: { key: string } }
) {
  const key = params.key.replace(/\.(png|jpg|jpeg|webp)$/, '');
  const filename = IMAGE_ARTIFACTS[key];
  
  if (!filename) {
    // Try local public/products fallback
    try {
      const localPath = path.join(process.cwd(), 'public', 'products', params.key);
      const data = await fs.readFile(localPath);
      const ext = params.key.split('.').pop() || 'png';
      const mime = ext === 'svg' ? 'image/svg+xml' : `image/${ext}`;
      return new NextResponse(data, {
        headers: { 'Content-Type': mime, 'Cache-Control': 'public, max-age=31536000' },
      });
    } catch {
      return new NextResponse('Not Found', { status: 404 });
    }
  }

  try {
    const filePath = path.join(ARTIFACTS_DIR, filename);
    const data = await fs.readFile(filePath);
    return new NextResponse(data, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (err) {
    console.error('Image serve error:', err);
    return new NextResponse('Image not found', { status: 404 });
  }
}
