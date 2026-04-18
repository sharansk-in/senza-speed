// src/lib/speedtest.ts

function getMedian(arr: number[]) {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

const LIBRESPEED_SERVERS = [
  { name: "Singapore (Salvatore Cahyo)", url: "https://speedtest.dsgroupmedia.com/backend" },
  { name: "Frankfurt (Clouvider)", url: "https://fra.speedtest.clouvider.net/backend" },
  { name: "London (Clouvider)", url: "https://lon.speedtest.clouvider.net/backend" },
  { name: "Los Angeles (Clouvider)", url: "https://la.speedtest.clouvider.net/backend" },
  { name: "New York (Clouvider)", url: "https://nyc.speedtest.clouvider.net/backend" }
];

let activeServer: { name: string, url: string } | null = null;

export async function fetchNearestServer() {
  if (activeServer) return activeServer;
  
  let bestServer = LIBRESPEED_SERVERS[0];
  let bestPing = Infinity;

  // Race all public LibreSpeed backends to find closest node
  const tests = LIBRESPEED_SERVERS.map(async (server) => {
    try {
      const start = performance.now();
      await fetch(server.url + '/empty.php', { method: 'HEAD', mode: 'cors', cache: 'no-store' });
      const ping = performance.now() - start;
      if (ping < bestPing) {
        bestPing = ping;
        bestServer = server;
      }
    } catch (e) {}
  });

  await Promise.allSettled(tests);
  activeServer = bestServer;
  return activeServer;
}


export async function getTraceDetails() {
  try {
    const nearest = await fetchNearestServer();
    
    // Explicit chained IP sourcing
    const [ipRes] = await Promise.all([
      fetch('https://ipinfo.io/json', { cache: 'no-store' }),
    ]);
    
    const [data] = await Promise.all([
      ipRes.json()
    ]);

    let provider = data.org || "Network Provider";

    return {
      ip: data.ip,
      city: data.city || "Unknown City",
      region: data.region || "Unknown Region",
      isp: `${nearest.name} | ${provider}`,
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
          isp: data.organization || "LibreSpeed Target",
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
  const targetUrl = activeServer ? activeServer.url : LIBRESPEED_SERVERS[0].url;

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    try {
      const res = await fetch(`${targetUrl}/empty.php?t=${Date.now()}${i}`, { cache: 'no-store' });
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
    const WORKER_COUNT = 6;
    const targetUrl = activeServer ? activeServer.url : LIBRESPEED_SERVERS[0].url;
    
    let totalLoaded = 0;
    const startTime = performance.now();
    const DOWNLOAD_DURATION = 8000; 
    
    let activeWorkers = 0;
    let isDone = false;
    
    const history: number[] = [];
    const pings: number[] = [];

    let pingInterval = setInterval(async () => {
      const pStart = performance.now();
      try {
        await fetch(`${targetUrl}/empty.php?loaded=${Date.now()}`, { cache: 'no-store' });
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
                    // LibreSpeed specific garbage data endpoint generating up to 100MB chunks natively
                    const res = await fetch(`${targetUrl}/garbage.php?ckSize=100`, { cache: 'no-store' });
                    if (!res.body) break;
                    const reader = res.body.getReader();
                    while (!isDone) {
                        const { done, value } = await reader.read();
                        if (value && !isDone) totalLoaded += value.length;
                        if (done) break;
                    }
                } catch {
                    // transient error handling natively loops
                }
            }
            activeWorkers--;
        };
        puller();
    }
  });
}

// XHR Physical stream buffers actively target LibreSpeed Open CORS Backend
export function measureUpload(onProgress: (mbps: number, progress: number, errorState?: string) => void): Promise<{ mbps: number, loadedPing: number }> {
    return new Promise((resolve) => {
      const WORKER_COUNT = 4;
      const CHUNK_SIZE = 25 * 1024 * 1024; // 25MB blob continuous stream
      const buffer = new Uint8Array(CHUNK_SIZE);
      const blob = new Blob([buffer], { type: 'application/octet-stream' }); 
      const targetUrl = activeServer ? activeServer.url : LIBRESPEED_SERVERS[0].url;
      
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
          await fetch(`${targetUrl}/empty.php?loadedup=${Date.now()}`, { cache: 'no-store' });
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
                pumper(); // Recursively pump the stream
            };
            
            // XHR Request natively hits Open-Source LibreSpeed Endpoint guaranteed to resolve
            xhr.open("POST", `${targetUrl}/empty.php`, true);
            xhr.setRequestHeader("Content-Type", "application/octet-stream");
            xhr.send(blob);
        };
        pumper();
      }
    });
}
