import { NextResponse } from 'next/server';

// Ensure the local dev server accepts larger bodies, NextJS default limits body size.
// App router doesn't have a direct config export for body size limit in standard mode anymore (it uses Next.js server limits).
// However, reading from a stream bypasses simple JSON parsing payload limits.

export async function POST(request: Request) {
  // Consume the readable stream completely to measure bandwidth 
  if (request.body) {
    const reader = request.body.getReader();
    while (true) {
      const { done } = await reader.read();
      if (done) break;
    }
  }
  
  return new NextResponse('ok', {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
}
