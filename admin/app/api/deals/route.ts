import { getStore } from '@netlify/blobs';
import { NextResponse } from 'next/server';

const STORE_NAME = 'dailygrub';
const BLOB_KEY = 'deals.json';

/**
 * GET /api/deals - Load deals from Netlify Blob
 */
export async function GET() {
  try {
    const store = getStore(STORE_NAME);
    const data = await store.get(BLOB_KEY, { type: 'json' });

    if (data === null) {
      return NextResponse.json({ cities: {} });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to load deals:', error);
    return NextResponse.json(
      { error: 'Failed to load deals from blob' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/deals - Save deals to Netlify Blob
 */
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const store = getStore(STORE_NAME);
    await store.set(BLOB_KEY, JSON.stringify(data, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save deals:', error);
    return NextResponse.json(
      { error: 'Failed to save deals to blob' },
      { status: 500 }
    );
  }
}
