import { NextResponse } from 'next/server';

export async function GET() {
  return new NextResponse('pong', { 
    headers: { 
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
}
