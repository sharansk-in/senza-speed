import { NextResponse } from 'next/server';

export async function GET() {
  const chunkSize = 1 * 1024 * 1024; // 1 MB chunk (zeroes)
  const chunkCount = 35; // 35 MB total to saturate the link for a few seconds
  
  const data = new Uint8Array(chunkSize);
  // Optional: Add some random data to prevent high-level compression tricks,
  // but zero arrays are faster for node CPU limits. To balance it:
  for(let i=0; i<data.length; i+=4096) { data[i] = Math.random() * 255; }

  const stream = new ReadableStream({
    start(controller) {
      let i = 0;
      function push() { // use setTimeout to allow event loop breathing and prevent blocking
        if (i < chunkCount) {
          controller.enqueue(data);
          i++;
          setTimeout(push, 1);
        } else {
          controller.close();
        }
      }
      push();
    }
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Content-Length': (chunkCount * chunkSize).toString(),
    }
  });
}
