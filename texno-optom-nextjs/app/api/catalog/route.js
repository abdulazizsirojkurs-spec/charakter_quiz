import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), 'data.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const db = JSON.parse(rawData);

    // Provide the full catalog including prices so the frontend can display them.
    // However, the final price is recalculated on the backend via /api/calculate for security.
    return NextResponse.json(db);
  } catch (error) {
    console.error('Catalog error:', error);
    return NextResponse.json({ error: 'Failed to load catalog' }, { status: 500 });
  }
}
