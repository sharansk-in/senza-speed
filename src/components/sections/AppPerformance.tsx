"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Video, Gamepad2, MessageSquare, MonitorPlay, CloudDownload } from "lucide-react";
import { cn } from "@/lib/utils";

const apps = [
  { id: "netflix", name: "Netflix", icon: Play, category: "Streaming", score: "Excellent 4K HDR" },
  { id: "youtube", name: "YouTube", icon: MonitorPlay, category: "Streaming", score: "Zero Buffer 4K" },
  { id: "zoom", name: "Zoom", icon: Video, category: "Video Call", score: "Ultra Smooth HD" },
  { id: "whatsapp", name: "WhatsApp", icon: MessageSquare, category: "Communication", score: "Instant Delivery" },
  { id: "ps5", name: "PS5", icon: Gamepad2, category: "Gaming", score: "12ms Latency" },
  { id: "steam", name: "Steam", icon: CloudDownload, category: "Downloads", score: "Est: 10GB in 2 mins" },
];

export function AppPerformance() {
  const [activeApp, setActiveApp] = React.useState(apps[0]);

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      
      <div className="container mx-auto max-w-4xl relative z-10 text-center">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Will My App Work?</h2>
        <p className="text-foreground/60 mb-16 text-lg max-w-2xl mx-auto">
          Select an application to see its real-time performance capability on your current network connection.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {apps.map((app) => {
            const Icon = app.icon;
            const isActive = activeApp.id === app.id;
            
            return (
              <button
                key={app.id}
                onClick={() => setActiveApp(app)}
                className={cn(
                  "px-6 py-4 rounded-2xl flex items-center gap-3 transition-all duration-300",
                  isActive 
                    ? "bg-foreground text-background scale-105 shadow-[0_10px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_30px_rgba(255,255,255,0.05)]" 
                    : "glass hover:bg-foreground/[0.04]"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-semibold">{app.name}</span>
              </button>
            );
          })}
        </div>

        <div className="glass-card rounded-[40px] p-10 md:p-16 relative overflow-hidden text-left min-h-[250px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeApp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col md:flex-row items-center gap-10 w-full"
            >
              <div className="p-8 rounded-full bg-blue-500/10 text-blue-500 hidden md:block">
                {React.createElement(activeApp.icon, { className: "w-16 h-16" })}
              </div>
              <div>
                <span className="text-sm font-medium tracking-wide uppercase opacity-60 mb-2 block">{activeApp.category}</span>
                <h3 className="text-4xl md:text-5xl font-bold mb-4">{activeApp.name} Readiness</h3>
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-green-500/10 text-green-500 font-medium text-lg">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  {activeApp.score}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
