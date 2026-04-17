"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Router } from "lucide-react";
import { cn } from "@/lib/utils";

export function WiFiMap() {
  return (
    <section id="wifi" className="py-24 px-6 overflow-hidden">
      <div className="container mx-auto max-w-5xl text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Home WiFi Health</h2>
        <p className="text-foreground/60 max-w-2xl mx-auto text-lg">
          Visualize your network coverage. We suggest optimal router placement based on signal drop-offs.
        </p>
      </div>

      <div className="w-full max-w-4xl mx-auto glass-card rounded-[40px] p-8 md:p-12 relative">
        {/* Floorplan Simulation Container */}
        <div className="relative w-full aspect-square md:aspect-[16/9] border-2 border-foreground/5 rounded-[24px] overflow-hidden bg-background/30 p-4 grid grid-cols-2 grid-rows-2 gap-4">
          
          {/* Signal Gradients Overlays */}
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-green-500/20 rounded-full blur-[80px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute top-3/4 left-3/4 w-[400px] h-[400px] bg-red-500/10 rounded-full blur-[80px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-orange-500/15 rounded-full blur-[80px] pointer-events-none translate-x-1/4 -translate-y-1/4" />

          {/* Rooms */}
          <div className="border border-foreground/10 rounded-2xl bg-foreground/[0.02] p-4 flex flex-col justify-between group hover:bg-foreground/[0.04] transition-colors">
            <span className="font-semibold text-sm tracking-wider uppercase opacity-70">Living Room</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
              <span className="text-sm font-medium opacity-60">Excellent</span>
            </div>
          </div>

          <div className="border border-foreground/10 rounded-2xl bg-foreground/[0.02] p-4 flex flex-col justify-between group hover:bg-foreground/[0.04] transition-colors relative">
            <span className="font-semibold text-sm tracking-wider uppercase opacity-70">Bedroom</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.8)]" />
              <span className="text-sm font-medium opacity-60">Medium</span>
            </div>

            {/* Router Indicator */}
            <motion.div 
              className="absolute -left-10 -bottom-10 md:-left-6 md:-bottom-6 z-10"
              initial={{ scale: 0.8 }}
              animate={{ scale: [0.8, 1, 0.8] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-16 h-16 rounded-full glass border-blue-500/30 flex items-center justify-center relative shadow-xl shadow-blue-500/20">
                <Router className="w-6 h-6 text-blue-500" />
                <motion.div 
                  className="absolute inset-0 rounded-full border border-blue-500"
                  animate={{ scale: [1, 2], opacity: [0.8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          </div>

          <div className="border border-foreground/10 rounded-2xl bg-foreground/[0.02] p-4 flex flex-col justify-between group hover:bg-foreground/[0.04] transition-colors">
            <span className="font-semibold text-sm tracking-wider uppercase opacity-70">Kitchen</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.8)]" />
              <span className="text-sm font-medium opacity-60">Weak</span>
            </div>
          </div>

          <div className="border border-foreground/10 rounded-2xl bg-foreground/[0.02] p-4 flex flex-col justify-between group hover:bg-foreground/[0.04] transition-colors">
            <span className="font-semibold text-sm tracking-wider uppercase opacity-70">Terrace</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
              <span className="text-sm font-medium opacity-60">Poor</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <div className="glass px-6 py-3 rounded-full inline-flex items-center gap-3">
            <Router className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium">Suggestion: Move router to the center hallway for 40% better terrace coverage.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
