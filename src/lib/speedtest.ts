// src/lib/speedtest.ts

function getMedian(arr: number[]) {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export async function getTraceDetails() {
  try {
    const [ipRes, traceRes] = await Promise.all([
      fetch('https://ipinfo.io/json', { cache: 'no-store' }),
      fetch('https://speed.cloudflare.com/cdn-cgi/trace', { cache: 'no-store' })
    ]);
    
    const [data, traceText] = await Promise.all([
      ipRes.json(),
      traceRes.text()
    ]);

    const coloMatch = traceText.match(/colo=([A-Z]+)/);
    const colo = coloMatch ? coloMatch[1] : null;
    
    let serverNode = data.org || "Cloudflare Anycast";
    if (colo === 'BOM') serverNode = 'Mumbai Node (Cloudflare Edge)';
    if (colo === 'MAA') serverNode = 'Chennai Node (Cloudflare Edge)';
    if (colo === 'BLR') serverNode = 'Bangalore Node (Cloudflare Edge)';
    if (colo === 'DEL' || colo === 'NAG') serverNode = 'New Delhi Node (Cloudflare Edge)';

    return {
      ip: data.ip,
      city: data.city || "Unknown City",
      region: data.region || "Unknown Region",
      isp: serverNode,
      country: data.country || "Unknown Country"
    };
  } catch (e) {
    try {
      const fb = await fetch('https://get.geojs.io/v1/ip/geo.json');
      const data = await fb.json();
      return { 
          ip: data.ip || "Detecting...", 
          city: data.city || "Remote", 
          region: data.region || "Network", 
          isp: data.organization || "Cloudflare Routing",
          country: data.country || "Unknown"
      };
    } catch {
      return { ip: "Unknown IP", city: "Local", region: "Network", isp: "Unknown Provider", country: "Global" };
    }
  }
}

export async function measurePing(iterations: number = 10): Promise<{ping: number, jitter: number, loss: number}> {
  const latencies: number[] = [];
  let failures = 0;

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    try {
      const res = await fetch(`https://speed.cloudflare.com/cdn-cgi/trace?t=${Date.now()}${i}`, { cache: 'no-store' });
      const end = performance.now();
      if (res.ok) {
        latencies.push(end - start);
      } else {
        failures++;
      }
    } catch {
      failures++;
    }
  }

  const loss = (failures / iterations) * 100;
  if (latencies.length === 0) return { ping: 0, jitter: 0, loss };

  const ping = getMedian(latencies);

  let jitter = 0;
  if (latencies.length > 1) {
    let diffs = [];
    for (let i = 1; i < latencies.length; i++) {
      diffs.push(Math.abs(latencies[i] - latencies[i-1]));
    }
    jitter = getMedian(diffs);
  }

  return { ping: Math.round(ping), jitter: Number(jitter.toFixed(1)), loss: Number(loss.toFixed(1)) };
}

export function measureDownload(onProgress: (mbps: number, progress: number) => void): Promise<{ mbps: number, loadedPing: number }> {
  return new Promise((resolve) => {
    const WORKER_COUNT = 8;
    const CHUNK_SIZE = 25000000; // 25MB recursive chunks 
    let totalLoaded = 0;
    const startTime = performance.now();
    const DOWNLOAD_DURATION = 8000; // 8 seconds minimum duration
    
    let activeWorkers = 0;
    let isDone = false;
    
    const history: number[] = [];
    const pings: number[] = [];

    let pingInterval = setInterval(async () => {
      const pStart = performance.now();
      try {
        await fetch(`https://speed.cloudflare.com/cdn-cgi/trace?loaded=${Date.now()}`, { cache: 'no-store' });
        pings.push(performance.now() - pStart);
      } catch (e) {}
    }, 500);

    const shutDown = () => {
      if (isDone) return;
      isDone = true;
      clearInterval(monitorInterval);
      clearInterval(pingInterval);
      
      const finalSpeed = history.length > 0 ? history[history.length - 1] : 0;
      const finalLoadedPing = pings.length > 0 ? getMedian(pings) : 0;
      
      resolve({ mbps: finalSpeed, loadedPing: Math.round(finalLoadedPing) });
    };

    let warmupBytes = 0;
    const monitorInterval = setInterval(() => {
      const now = performance.now();
      const elapsed = now - startTime;

      if (elapsed < 1000) {
          warmupBytes = totalLoaded;
          const instantMbps = totalLoaded > 0 ? (totalLoaded * 8) / (elapsed * 1000) : 0;
          history.push(instantMbps);
          onProgress(instantMbps, Math.min((elapsed / DOWNLOAD_DURATION) * 100, 100));
      } else {
          // Sustained bandwidth math natively resolves micro-jitters
          const sustainedElapsed = elapsed - 1000;
          const sustainedBytes = totalLoaded - warmupBytes;
          const sustainedMbps = sustainedBytes > 0 ? (sustainedBytes * 8) / (sustainedElapsed * 1000) : 0;
          history.push(sustainedMbps);
          onProgress(sustainedMbps, Math.min((elapsed / DOWNLOAD_DURATION) * 100, 100));
      }

      if (elapsed > DOWNLOAD_DURATION) {
         shutDown();
      }
    }, 100);

    for (let i = 0; i < WORKER_COUNT; i++) {
        activeWorkers++;
        const puller = async () => {
            while (!isDone) {
                try {
                    const res = await fetch(`https://speed.cloudflare.com/__down?bytes=${CHUNK_SIZE}`, { cache: 'no-store' });
                    if (!res.body) break;
                    const reader = res.body.getReader();
                    while (!isDone) {
                        const { done, value } = await reader.read();
                        if (value && !isDone) totalLoaded += value.length;
                        if (done) break;
                    }
                } catch {
                    // transient error
                }
            }
            activeWorkers--;
        };
        puller();
    }
  });
}

// Rewritten upload logic using raw XHR physical stream buffers
export function measureUpload(onProgress: (mbps: number, progress: number, errorState?: string) => void): Promise<{ mbps: number, loadedPing: number }> {
    return new Promise((resolve) => {
      const WORKER_COUNT = 4;
      const CHUNK_SIZE = 25 * 1024 * 1024; // 25MB blob continuous stream
      const buffer = new Uint8Array(CHUNK_SIZE);
      const blob = new Blob([buffer], { type: 'text/plain' }); 
      
      let totalLoaded = 0;
      let activeWorkers = 0;
      let isDone = false;
      const history: number[] = [];
      const pings: number[] = [];
      const startTime = performance.now();
      const UPLOAD_DURATION = 8000; 
      let warmupBytes = 0;

      let pingInterval = setInterval(async () => {
        const pStart = performance.now();
        try {
          await fetch(`https://speed.cloudflare.com/cdn-cgi/trace?loadedup=${Date.now()}`, { cache: 'no-store' });
          pings.push(performance.now() - pStart);
        } catch (e) {}
      }, 500);
  
      const shutDown = () => {
        if (isDone) return;
        isDone = true;
        clearInterval(monitorInterval);
        clearInterval(pingInterval);
        
        const finalSpeed = history.length > 0 ? history[history.length - 1] : 0;
        const finalLoadedPing = pings.length > 0 ? getMedian(pings) : 0;
        
        resolve({ mbps: finalSpeed, loadedPing: Math.round(finalLoadedPing) });
      };

      const monitorInterval = setInterval(() => {
        const now = performance.now();
        const elapsed = now - startTime;
        
        if (elapsed < 1000) {
            warmupBytes = totalLoaded;
            const instantMbps = totalLoaded > 0 ? (totalLoaded * 8) / (elapsed * 1000) : 0;
            history.push(instantMbps);
            onProgress(instantMbps, Math.min((elapsed / UPLOAD_DURATION) * 100, 100));
        } else {
            const sustainedElapsed = elapsed - 1000;
            const sustainedBytes = totalLoaded - warmupBytes;
            const sustainedMbps = sustainedBytes > 0 ? (sustainedBytes * 8) / (sustainedElapsed * 1000) : 0;
            history.push(sustainedMbps);
            onProgress(sustainedMbps, Math.min((elapsed / UPLOAD_DURATION) * 100, 100));
        }
  
        if (elapsed > UPLOAD_DURATION) {
           shutDown();
        }
      }, 100);
  
      for(let i=0; i<WORKER_COUNT; i++) {
        activeWorkers++;
        const pumper = () => {
            if (isDone) {
                activeWorkers--;
                return;
            }
            const xhr = new XMLHttpRequest();
            let previousLoaded = 0;
            
            xhr.upload.onprogress = (e) => {
                if (isDone) return;
                const diff = e.loaded - previousLoaded;
                previousLoaded = e.loaded;
                totalLoaded += diff;
            };
            
            xhr.onloadend = () => {
                pumper();
            };
            
            // XHR Simple Request bypasses strict OPTIONS preflights globally
            xhr.open("POST", "https://speed.cloudflare.com/__up", true);
            xhr.setRequestHeader("Content-Type", "text/plain");
            xhr.send(blob);
        };
        pumper();
      }
    });
}
