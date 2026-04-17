"use client";

import * as React from "react";
import { motion, useMotionValue, useTransform, animate, Variants } from "framer-motion";
import { CheckCircle2, AlertTriangle, MonitorPlay, Gamepad2, Video, UploadCloud, Wifi, Clock, XCircle, ArrowDown, ArrowUp, Globe2, Server as ServerIcon, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

interface ResultsExperienceProps {
  results: {
    download: number;
    upload: number;
    ping: number;
    jitter: number;
    loss: number;
    loadedPing: number;
    trace?: Record<string, string>;
  };
}

export function ResultsExperience({ results }: ResultsExperienceProps) {
  // Safe extraction of ipapi trace variables
  const ip = results.trace?.ip || "Detecting...";
  const isp = results.trace?.isp || "Cloudflare Node";
  const loc = results.trace?.city && results.trace?.region && results.trace?.country
              ? `${results.trace.city}, ${results.trace.region}, ${results.trace.country}` 
              : "Detecting Location...";

  // True Stability Algorithm (Independent of raw throughput speed)
  const loadedLatencyDelta = Math.max(results.loadedPing - results.ping, 0); // Ensure no negative delta
  
  const jitterScore = Math.max(0, 1 - (results.jitter / 50)) * 30; // Max 30 points
  const lossScore = Math.max(0, 1 - (results.loss / 5)) * 40; // Max 40 points
  const bufferbloatScore = Math.max(0, 1 - (loadedLatencyDelta / 150)) * 30; // Max 30 points

  const totalScore = Math.round(jitterScore + lossScore + bufferbloatScore);

  let statusColor = "var(--color-status-excellent)";
  if (totalScore < 60) statusColor = "var(--color-status-problem)";
  else if (totalScore < 80) statusColor = "var(--color-status-warning)";

  return (
    <section className="py-24 px-6 flex flex-col items-center">
      <div className="w-full max-w-6xl mx-auto">

        {/* PROFESSIONAL SERVER DETAILS AREA */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4 p-4 glass-card rounded-2xl">
            <Globe2 className="w-8 h-8 text-blue-500 opacity-80" />
            <div>
              <p className="text-xs font-semibold tracking-widest opacity-50 mb-0.5">CLIENT IP</p>
              <p className="text-sm font-medium">{ip}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 glass-card rounded-2xl">
            <ServerIcon className="w-8 h-8 text-green-500 opacity-80" />
            <div>
              <p className="text-xs font-semibold tracking-widest opacity-50 mb-0.5">SERVER NODE / ISP</p>
              <p className="text-sm font-medium">{isp}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 glass-card rounded-2xl">
            <MapPin className="w-8 h-8 text-orange-500 opacity-80" />
            <div>
              <p className="text-xs font-semibold tracking-widest opacity-50 mb-0.5">REGION</p>
              <div className="flex items-center gap-2">
                 <p className="text-sm font-medium">{loc}</p>
                 <span className="text-[10px] uppercase bg-foreground/10 px-2 py-0.5 rounded-full">Multi-Connection</span>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* PREMIUM TOP METRICS */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8 mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="col-span-2 md:col-span-1 flex flex-col space-y-2 p-6 rounded-3xl glass-card flex-1">
            <span className="text-sm font-semibold opacity-50 tracking-wider">STABILITY</span>
            <div className="flex items-baseline gap-1 mt-auto">
               <CountUp value={totalScore} className="text-6xl font-bold tracking-tighter" style={{ color: statusColor }} />
               <span className="text-2xl font-medium opacity-40">/100</span>
            </div>
          </div>
          
          <div className="col-span-2 flex flex-col space-y-2 p-8 rounded-3xl glass-card relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 text-green-500/5 group-hover:text-green-500/10 transition-colors duration-500"><ArrowDown strokeWidth={4} className="w-40 h-40" /></div>
            <span className="text-sm font-semibold opacity-50 tracking-wider relative z-10 flex items-center gap-2"><ArrowDown className="w-4 h-4 text-green-500" /> DOWNLOAD</span>
            <div className="flex items-baseline gap-2 mt-auto relative z-10">
               <CountUp value={results.download} decimals={1} className="text-7xl font-bold tracking-tighter" />
               <span className="text-xl font-medium opacity-60">Mbps</span>
            </div>
          </div>

          <div className="col-span-2 flex flex-col space-y-2 p-8 rounded-3xl glass-card relative overflow-hidden group">
             <div className="absolute -top-10 -right-10 text-blue-500/5 group-hover:text-blue-500/10 transition-colors duration-500"><ArrowUp strokeWidth={4} className="w-40 h-40" /></div>
            <span className="text-sm font-semibold opacity-50 tracking-wider relative z-10 flex items-center gap-2"><ArrowUp className="w-4 h-4 text-blue-500" /> UPLOAD</span>
            <div className="flex items-baseline gap-2 mt-auto relative z-10">
               <CountUp value={results.upload} decimals={1} className="text-7xl font-bold tracking-tighter" />
               <span className="text-xl font-medium opacity-60">Mbps</span>
            </div>
          </div>
          
          <div className="p-6 rounded-3xl glass-card flex flex-col justify-between">
            <span className="text-xs font-semibold opacity-50 tracking-wider">IDLE PING</span>
            <div className="flex items-baseline gap-1">
               <CountUp value={results.ping} className="text-4xl font-bold tracking-tighter" />
               <span className="text-sm font-medium opacity-60">ms</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl glass-card flex flex-col justify-between">
            <span className="text-xs font-semibold opacity-50 tracking-wider">LOADED</span>
            <div className="flex items-baseline gap-1">
               <CountUp value={results.loadedPing} className="text-4xl font-bold tracking-tighter text-orange-500" />
               <span className="text-sm font-medium opacity-60">ms</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl glass-card flex flex-col justify-between">
            <span className="text-xs font-semibold opacity-50 tracking-wider">JITTER</span>
            <div className="flex items-baseline gap-1">
               <CountUp value={results.jitter} decimals={1} className="text-4xl font-bold tracking-tighter" />
               <span className="text-sm font-medium opacity-60">ms</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl glass-card flex flex-col justify-between">
            <span className="text-xs font-semibold opacity-50 tracking-wider">LOSS</span>
            <div className="flex items-baseline gap-1">
               <CountUp value={results.loss} decimals={1} className="text-4xl font-bold tracking-tighter text-red-500" />
               <span className="text-sm font-medium opacity-60">%</span>
            </div>
          </div>
          
          <div className="md:col-span-1" />
        </motion.div>

        {/* HUMAN INSIGHTS HEADER */}
        <div className="text-center mb-10">
           <h3 className="text-3xl font-bold tracking-tight">Plain-English Insights</h3>
           <p className="text-foreground/60 mt-2 max-w-lg mx-auto">Translating true telemetry bounds into actionable device expectations.</p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <InsightCard 
            icon={<MonitorPlay className="w-5 h-5" />} 
            title="Streaming (Netflix 4K)" 
            value={results.download >= 25 && results.loss < 2 ? "Flawless ultra-HD bufferless playback" : results.download >= 10 ? "Standard HD playback feasible" : "High buffering risk"} 
            status={results.download >= 25 && results.loss < 2 ? "excellent" : results.download >= 10 ? "warning" : "problem"}
          />
          <InsightCard 
            icon={<Gamepad2 className="w-5 h-5" />} 
            title="Console Gaming (PS5)" 
            value={results.ping <= 40 && results.jitter <= 10 && results.loss === 0 ? "Excellent competitive hit-registration" : results.ping <= 80 ? "Acceptable casual latency" : "Unplayable lag delays detected"} 
            status={results.ping <= 40 && results.jitter <= 10 && results.loss === 0 ? "excellent" : results.ping <= 80 ? "warning" : "problem"}
          />
          <InsightCard 
            icon={<Video className="w-5 h-5" />} 
            title="HD Video Calls (Zoom)" 
            value={results.download > 4 && results.upload > 4 && results.loadedPing < 100 && results.jitter < 30 ? "Stable two-way video presentation" : "Audio/Video dropouts highly likely"} 
            status={results.download > 4 && results.upload > 4 && results.loadedPing < 100 && results.jitter < 30 ? "excellent" : "problem"}
          />
          <InsightCard 
            icon={<UploadCloud className="w-5 h-5" />} 
            title="Creator Uploads" 
            value={results.upload > 15 ? "Fast cloud syncs and file attachments" : results.upload > 5 ? "Moderate speeds for standard photos" : "Severe upload bottleneck detected"} 
            status={results.upload > 15 ? "excellent" : results.upload > 5 ? "warning" : "problem"}
          />
          <InsightCard 
            icon={<Clock className="w-5 h-5" />} 
            title="App Download (Steam)" 
            value={results.download > 50 ? "Fast multi-gigabyte downloads" : results.download > 10 ? "Moderate download times expected" : "Slow installation times"} 
            status={results.download > 50 ? "excellent" : results.download > 10 ? "warning" : "problem"}
          />
          <InsightCard 
            icon={<Wifi className="w-5 h-5" />} 
            title="Connection Variance" 
            value={results.jitter < 10 ? "Clockwork-like consistency" : results.jitter < 30 ? "Minor timing instability detected" : "Highly erratic packet arrival"} 
            status={results.jitter < 10 ? "excellent" : results.jitter < 30 ? "warning" : "problem"}
          />
        </motion.div>

        {/* TRUST MESSAGING */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 text-center border-t border-foreground/10 pt-8"
        >
          <p className="text-sm font-medium opacity-50 max-w-2xl mx-auto">
            These metrics represent your <strong>True Real-World Network Path</strong> across the global internet backbone via Cloudflare Edge networks. Results may read within an expected lower range compared to idealized peak numbers presented by local "last-mile" ISP endpoints.
          </p>
        </motion.div>

      </div>
    </section>
  );
}

function CountUp({ value, decimals = 0, style, className }: any) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (latest) => latest.toFixed(decimals));

  React.useEffect(() => {
    const controls = animate(mv, value, { duration: 1.5, ease: "easeOut" });
    return () => controls.stop();
  }, [value, mv]);

  return <motion.span className={className} style={style}>{rounded}</motion.span>;
}

function InsightCard({ icon, title, value, status }: { icon: React.ReactNode, title: string, value: string, status: "excellent" | "warning" | "problem" }) {
  return (
    <motion.div 
      variants={item}
      className="glass-card rounded-2xl p-6 flex flex-col justify-between group hover:scale-[1.02] transition-transform duration-300 cursor-default min-h-[140px]"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-foreground/5 text-foreground/70">
            {icon}
          </div>
          <span className="font-semibold opacity-90">{title}</span>
        </div>
        {status === "excellent" && <CheckCircle2 className="w-6 h-6" style={{ color: "var(--color-status-excellent)" }} />}
        {status === "warning" && <AlertTriangle className="w-6 h-6" style={{ color: "var(--color-status-warning)" }} />}
        {status === "problem" && <XCircle className="w-6 h-6" style={{ color: "var(--color-status-problem)" }} />}
      </div>
      
      <div>
        <p className="text-base text-foreground/80 leading-snug font-medium">{value}</p>
      </div>
    </motion.div>
  );
}
