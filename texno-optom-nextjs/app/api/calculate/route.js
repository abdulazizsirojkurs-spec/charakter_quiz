import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const FULL_BUILD_MARGIN_USD = 100;
const MIN_ITEMS_FOR_MARGIN = 7;

export async function POST(request) {
  try {
    const { selectedIds } = await request.json();
    
    if (!Array.isArray(selectedIds)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const dataPath = path.join(process.cwd(), 'data.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const db = JSON.parse(rawData);

    // Create a flat map of all items
    const allItems = {};
    for (const category in db) {
      if (Array.isArray(db[category])) {
        db[category].forEach(item => {
          allItems[item.id] = item;
        });
      }
    }

    let totalBaseUsd = 0;
    let validItemsCount = 0;

    selectedIds.forEach(id => {
      if (allItems[id]) {
        totalBaseUsd += (allItems[id].price || 0);
        // Accessories do not count towards the 7 main components
        if (!id.startsWith('acc')) {
          validItemsCount++;
        }
      }
    });

    let isFullBuild = validItemsCount >= MIN_ITEMS_FOR_MARGIN;
    let finalUsd = totalBaseUsd;
    
    if (isFullBuild) {
      finalUsd += FULL_BUILD_MARGIN_USD;
    }

    return NextResponse.json({
      success: true,
      totalUsd: isFullBuild ? finalUsd : null,
      isFullBuild,
      itemsCount: validItemsCount
    });

  } catch (error) {
    console.error('Calculate error:', error);
    return NextResponse.json({ error: 'Failed to calculate price' }, { status: 500 });
  }
}
