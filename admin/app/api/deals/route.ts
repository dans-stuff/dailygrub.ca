import { getStore } from '@netlify/blobs';
import { NextResponse } from 'next/server';

const STORE_NAME = 'dailygrub';
const BLOB_KEY = 'deals.json';

/**
 * Generate a simple hash of the data for e-tag purposes
 */
function generateETag(data: string): string {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `"${Math.abs(hash).toString(16)}"`;
}

/**
 * GET /api/deals - Load deals from Netlify Blob
 * Returns data with ETag header for optimistic locking
 */
export async function GET() {
  try {
    const store = getStore(STORE_NAME);
    const data = await store.get(BLOB_KEY, { type: 'text' });

    if (data === null) {
      const emptyData = JSON.stringify({ cities: {} });
      const response = NextResponse.json({ cities: {} });
      response.headers.set('ETag', generateETag(emptyData));
      return response;
    }

    const response = NextResponse.json(JSON.parse(data));
    response.headers.set('ETag', generateETag(data));
    return response;
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
 * Supports If-Match header for optimistic locking
 */
export async function POST(request: Request) {
  try {
    const ifMatch = request.headers.get('If-Match');
    const store = getStore(STORE_NAME);

    // If If-Match header provided, verify it matches current data
    if (ifMatch) {
      const currentData = await store.get(BLOB_KEY, { type: 'text' });
      const currentETag = currentData ? generateETag(currentData) : generateETag(JSON.stringify({ cities: {} }));

      if (ifMatch !== currentETag) {
        return NextResponse.json(
          { error: 'Data has been modified by another user. Please reload and try again.' },
          { status: 409 }
        );
      }
    }

    const data = await request.json();
    const newDataStr = JSON.stringify(data, null, 2);
    await store.set(BLOB_KEY, newDataStr);

    const response = NextResponse.json({ success: true });
    response.headers.set('ETag', generateETag(newDataStr));
    return response;
  } catch (error) {
    console.error('Failed to save deals:', error);
    return NextResponse.json(
      { error: 'Failed to save deals to blob' },
      { status: 500 }
    );
  }
}
