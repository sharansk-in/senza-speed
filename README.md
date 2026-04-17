# SENZA SPEED

A premium, browser-native internet speed test platform that measures true real-world network paths using the elegance of an Apple-style interface. 

## Current Features
- **Auto Server Selection**: BGP Anycast automatically targets the nearest low-latency edge node (e.g., Chennai, Mumbai, Bangalore natively from India).
- **8-Thread Concurrency**: Smashes Gigabit fiber connections seamlessly using 8 asynchronous Web Workers for testing boundaries safely.
- **Smart Analytics**: Decoupled Stability Score driven by Bufferbloat Delta, Pings, Jitter, and Packet Loss.
- **Privacy First**: No server-side telemetry or tracking. Uses absolute zero backend configuration for cost-free hosting elasticity. Native `localStorage` History cache.

## Known Limitations
- **Mobile Multitasking**: If deployed to a mobile device, backgrounding the browser (switching apps) midway through a test interrupts the Javascript timers and will flatline speeds.
- **Adblock Conflict**: A small slice of aggressive privacy-browsers automatically sever `__up` telemetry APIs; SENZA actively bypasses these by routing internally to `/cdn-cgi/trace` gracefully if blocked, reading lower throughputs on failed primary arrays.
- **Battery-Saver Limitations**: Browsers on Battery-Saver heavily restrict thread capacities, capping theoretical test scales temporarily.

## Tech Stack
- Frontend: Next.js 16 (App Router), React 19, Tailwind CSS 4, Framer Motion
- Network Tracing: Cloudflare Global Edge (`speed.cloudflare.com/__down` & `__up`)
- Geolocation API: IPAPI.co with Ipify fallback.

## How to Run Locally

Clone exactly as is, move into the directory, and ensure Node is configured to `v18+`. 
```bash
npm install
npm run dev
```
Navigate to `http://localhost:3000` to access the console locally.

## How to Deploy
Because the network engine connects 100% Client-Side directly out to Cloudflare servers, Vercel Edge endpoints don't invoke Bandwidth charges for the testing data arrays, meaning SENZA operates natively 100% free under basic hobby constraints forever.

```bash
# Push to Vercel instantly
npx vercel build --prod
```
Or simply attach your Vercel Project natively to your Github Repository's Main Branch for automated pushing.
