"use client";

import * as React from "react";
import { motion } from "framer-motion";

export function CTASection({ onStartTest }: { onStartTest: () => void }) {
  return (
    <section className="py-32 px-6">
      <div className="container mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-4xl md:text-7xl font-bold tracking-tight mb-8">
            The First Speed Test <br className="hidden md:block"/>
            <span className="text-foreground/40">That Tells the Truth.</span>
          </h2>
          
          <button 
            onClick={onStartTest}
            className="group relative inline-flex items-center justify-center bg-foreground text-background px-8 py-4 rounded-full text-lg font-medium shadow-[0_0_40px_rgba(0,0,0,0.1)] dark:shadow-[0_0_40px_rgba(255,255,255,0.05)] hover:scale-105 active:scale-95 transition-all duration-300"
          >
            Run Free Test
          </button>
        </motion.div>
      </div>
    </section>
  );
}
