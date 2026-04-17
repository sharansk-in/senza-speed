"use client";

import { useEffect } from "react";
import { Activity } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
      <div className="glass-card p-12 rounded-3xl flex flex-col items-center max-w-md text-center">
        <Activity className="w-12 h-12 text-red-500 mb-6" />
        <h2 className="text-2xl font-bold tracking-tight mb-2">System Interruption</h2>
        <p className="text-foreground/70 text-sm mb-8">
          The structural telemetry engine encountered a critical rendering exception. 
        </p>
        <button
          onClick={() => reset()}
          className="bg-foreground text-background px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
        >
          Re-Initialize
        </button>
      </div>
    </div>
  );
}
