"use client";

import * as React from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { ArrowDown, ArrowUp, Activity, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";
import { measurePing, measureDownload, measureUpload, getTraceDetails } from "@/lib/speedtest";

interface LiveTestProps {
  onComplete: (results: any) => void;
}

export function LiveTest({ onComplete }: LiveTestProps) {
  const [stage, setStage] = React.useState<"ping" | "download" | "upload" | "done">("ping");
  const [progress, setProgress] = React.useState(0);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [stats, setStats] = React.useState({ jitter: 0, loss: 0, loadedPing: 0, trace: null as any });

  const pingValue = useMotionValue(0);
  const downloadValue = useMotionValue(0);
  const uploadValue = useMotionValue(0);

  const roundedPing = useTransform(pingValue, Math.round);
  const roundedDownload = useTransform(downloadValue, (v) => v.toFixed(1));
  const roundedUpload = useTransform(uploadValue, (v) => v.toFixed(1));

  React.useEffect(() => {
    let isActive = true;
    
    const runTestSequence = async () => {
      // 1. Idle Ping Phase
      setStage("ping");
      setProgress(5);
      
      const [pingResult, trace] = await Promise.all([
        measurePing(15),
        getTraceDetails()
      ]);
      if (!isActive) return;
      
      pingValue.set(pingResult.ping);
      setStats(s => ({ ...s, jitter: pingResult.jitter, loss: pingResult.loss, trace }));
      setProgress(25);

      await new Promise(resolve => setTimeout(resolve, 500));

      // 2. Download Phase
      if (!isActive) return;
      setStage("download");
      
      const downloadResult = await measureDownload((mbps, prog) => {
        if (isActive) {
           downloadValue.set(mbps);
           setProgress(25 + (prog * 0.4)); // Download is 40% of the bar
        }
      });
      
      if (!isActive) return;
      downloadValue.set(downloadResult.mbps);
      setStats(s => ({ ...s, loadedPing: downloadResult.loadedPing }));
      setProgress(65);
      
      await new Promise(resolve => setTimeout(resolve, 500));

      // 3. Upload Phase
      if (!isActive) return;
      setStage("upload");
      
      const uploadResult = await measureUpload((mbps, prog, errState) => {
        if (isActive) {
           uploadValue.set(mbps);
           setProgress(65 + (prog * 0.35)); // Upload is 35% of the bar
           if (errState) setErrorMsg(errState);
        }
      });
      
      if (!isActive) return;
      uploadValue.set(uploadResult.mbps);
      setStats(s => ({ ...s, loadedPing: Math.round((s.loadedPing + uploadResult.loadedPing) / 2) }));
      setProgress(100);

      // 4. Done
      setStage("done");
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (isActive) {
        onComplete({
          download: downloadResult.mbps,
          upload: uploadResult.mbps,
          ping: pingResult.ping,
          jitter: pingResult.jitter,
          loss: pingResult.loss,
          loadedPing: Math.max(pingResult.ping, Math.round((downloadResult.loadedPing + uploadResult.loadedPing) / 2)),
          trace: stats.trace
        });
      }
    };

    runTestSequence();

    return () => {
      isActive = false; 
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="min-h-[80vh] flex flex-col items-center justify-center pt-20 px-6">
      <div className="w-full max-w-4xl mx-auto glass-card rounded-3xl p-8 md:p-16 relative overflow-hidden">
        
        <div className="absolute top-0 left-0 right-0 h-1 bg-foreground/5">
          <motion.div 
            className="h-full bg-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'linear' }}
          />
        </div>

        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium mb-8"
          >
            <Activity className="w-4 h-4 text-blue-500" />
            <span className="capitalize text-foreground/80">
              {stage === "done" ? "Telemetry Complete" : `Measuring ${stage}...`}
            </span>
          </motion.div>
          
          <div className="flex justify-center items-end gap-4 h-32">
            {stage === "ping" && (
              <motion.div className="flex flex-col items-center">
                <span className="text-sm font-medium opacity-50 mb-2">IDLE PING (ms)</span>
                <motion.h2 className="text-7xl md:text-9xl font-bold tracking-tighter" style={{ color: "var(--color-status-intelligence)" }}>{roundedPing}</motion.h2>
              </motion.div>
            )}
            {stage === "download" && (
              <motion.div className="flex flex-col items-center">
                <span className="text-sm font-medium opacity-50 mb-2">DOWNLOAD (Mbps)</span>
                <motion.h2 className="text-7xl md:text-9xl font-bold tracking-tighter" style={{ color: "var(--color-status-excellent)" }}>{roundedDownload}</motion.h2>
              </motion.div>
            )}
            {(stage === "upload" || stage === "done") && (
              <motion.div className="flex flex-col items-center">
                <span className="text-sm font-medium opacity-50 mb-2">UPLOAD (Mbps)</span>
                <motion.h2 className="text-7xl md:text-9xl font-bold tracking-tighter" style={{ color: "var(--color-status-excellent)" }}>{roundedUpload}</motion.h2>
              </motion.div>
            )}
          </div>
          
          {errorMsg && (
            <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="mt-6 text-orange-500 font-medium text-sm flex items-center justify-center gap-2"
            >
                <Activity className="w-4 h-4 animate-pulse" />
                {errorMsg}
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 pt-12 border-t border-foreground/10">
          <MetricCard title="Download" value={roundedDownload} icon={<ArrowDown />} active={stage === "download" || stage === "upload" || stage === "done"} unit="Mbps" />
          <MetricCard title="Upload" value={roundedUpload} icon={<ArrowUp />} active={stage === "upload" || stage === "done"} unit="Mbps" />
          <MetricCard title="Idle Ping" value={roundedPing} icon={<Activity />} active={stage !== "download" && stage !== "upload"} unit="ms" />
          <MetricCard title="Loaded Ping" value={stats.loadedPing} icon={<Wifi />} active={stage !== "ping"} unit="ms" />
        </div>
      </div>
    </section>
  );
}

function MetricCard({ title, value, icon, active, unit }: any) {
  return (
    <div className={cn("flex flex-col gap-2 transition-opacity duration-500", active ? "opacity-100" : "opacity-40")}>
      <div className="flex items-center gap-2 text-sm font-medium">
        {React.cloneElement(icon, { className: "w-4 h-4" })}
        <span>{title}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <motion.span className="text-3xl font-bold tracking-tight">{value}</motion.span>
        <span className="text-sm font-medium">{unit}</span>
      </div>
    </div>
  );
}
