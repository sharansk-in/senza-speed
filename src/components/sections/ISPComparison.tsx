"use client";

import { motion } from "framer-motion";
import { Users, AlertCircle } from "lucide-react";

export function ISPComparison() {
  return (
    <section className="py-24 px-6 relative">
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-semibold mb-4 opacity-70">
            <Users className="w-3 h-3" /> Crowd Intelligence
          </div>
          <h3 className="text-3xl font-bold tracking-tight mb-2">Local Provider Benchmark</h3>
          <p className="text-foreground/50 max-w-lg mb-4">Compare your speeds against neighbors to see if you're getting the best local value.</p>
          <div className="inline-flex flex-col items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-orange-500/10 text-orange-500 text-xs font-medium border border-orange-500/20">
              <AlertCircle className="w-3.5 h-3.5" /> Beta Community Data (Sample Only)
            </div>
            <span className="text-[10px] uppercase opacity-40 font-semibold tracking-wider">Sample Size: 1,492 Local Tests</span>
          </div>
        </div>

        <div className="glass-card rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-foreground/10 text-sm opacity-50">
                  <th className="p-6 font-medium">Provider</th>
                  <th className="p-6 font-medium">Avg Download</th>
                  <th className="p-6 font-medium">Avg Upload</th>
                  <th className="p-6 font-medium text-right">Stability</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-foreground/5 hover:bg-foreground/5 transition-colors">
                  <td className="p-6 font-semibold flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">AX</div>
                    Airtel Xstream
                  </td>
                  <td className="p-6 font-medium">~300 Mbps</td>
                  <td className="p-6 font-medium">~300 Mbps</td>
                  <td className="p-6 text-right"><span className="text-green-500">92%</span></td>
                </tr>
                <tr className="border-b border-foreground/5 hover:bg-foreground/5 transition-colors">
                  <td className="p-6 font-semibold flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">JF</div>
                    JioFiber
                  </td>
                  <td className="p-6 font-medium">~150 Mbps</td>
                  <td className="p-6 font-medium">~150 Mbps</td>
                  <td className="p-6 text-right"><span className="text-green-500">88%</span></td>
                </tr>
                <tr className="hover:bg-foreground/5 transition-colors opacity-50">
                  <td className="p-6 font-semibold flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center">?</div>
                    More providers unlocked as community grows
                  </td>
                  <td className="p-6">...</td>
                  <td className="p-6">...</td>
                  <td className="p-6 text-right">...</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
}
