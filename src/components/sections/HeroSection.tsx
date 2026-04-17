"use client";

import * as React from "react";
import { motion } from "framer-motion";

interface HeroSectionProps {
  onStartTest: () => void;
}

export function HeroSection({ onStartTest }: HeroSectionProps) {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden pt-20">
      {/* Background Mesh/Particles Simulation */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        <motion.div 
          className="absolute w-[800px] h-[800px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[100px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        <motion.h1 
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          Know Your Internet. <br className="hidden md:block"/>
          <span className="text-foreground/50">Not Just Your Speed.</span>
        </motion.h1>

        <motion.p 
          className="text-lg md:text-xl text-foreground/70 max-w-2xl mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          Measure speed, stability, gaming latency, streaming quality, WiFi health, and real-world connection performance.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <button 
            onClick={onStartTest}
            className="group relative w-48 h-48 md:w-56 md:h-56 rounded-full flex flex-col items-center justify-center bg-foreground text-background shadow-[0_0_40px_rgba(0,0,0,0.1)] dark:shadow-[0_0_40px_rgba(255,255,255,0.05)] hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <div className="absolute inset-0 rounded-full border border-background/20 group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-2 rounded-full border border-background/10 group-hover:scale-105 transition-transform duration-500" />
            <span className="text-2xl md:text-3xl font-bold tracking-wider mb-1">START</span>
            <span className="text-sm md:text-base font-medium opacity-70 tracking-widest">TEST</span>
          </button>
        </motion.div>

        <motion.div 
          className="flex flex-wrap items-center justify-center gap-6 md:gap-12 mt-20 text-sm font-medium uppercase tracking-widest opacity-60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <span>Download</span>
          <span className="w-1 h-1 rounded-full bg-foreground/30" />
          <span>Upload</span>
          <span className="w-1 h-1 rounded-full bg-foreground/30" />
          <span>Ping</span>
          <span className="w-1 h-1 rounded-full bg-foreground/30" />
          <span>Stability</span>
        </motion.div>
      </div>
    </section>
  );
}
