"use client";

import * as React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Clock } from "lucide-react";

export function HistoryDashboard() {
  const [history, setHistory] = React.useState<any[]>([]);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    // In a real app we'd fetch these. For now, check localStorage
    const saved = localStorage.getItem('senza_speed_history');
    if (saved) {
        try {
            setHistory(JSON.parse(saved));
        } catch { }
    }
  }, []);

  if (!mounted) return null;

  return (
    <section className="py-24 px-6 border-t border-foreground/5 relative">
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
        
        <div className="text-center mb-16 w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-semibold mb-4 opacity-70">
            <Clock className="w-3 h-3" /> Historical Analytics
          </div>
          <h3 className="text-3xl font-bold tracking-tight mb-2">Connection Stability</h3>
          <p className="text-foreground/50 max-w-lg mx-auto">Track your measured performance over time to detect ISP throttling or time-of-day congestion.</p>
        </div>

        {history.length === 0 ? (
            <div className="w-full h-64 glass-card rounded-3xl flex items-center justify-center text-foreground/40 font-medium">
                No historical data yet. Run more tests to unlock trends.
            </div>
        ) : (
            <div className="w-full h-[400px] glass-card rounded-3xl p-6 md:p-8">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorDownload" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-status-excellent)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-status-excellent)" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'currentColor', opacity: 0.5 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'currentColor', opacity: 0.5 }} />
                <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: '12px', border: 'none', backdropFilter: 'blur(10px)' }}
                    itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="download" stroke="var(--color-status-excellent)" strokeWidth={3} fillOpacity={1} fill="url(#colorDownload)" />
                </AreaChart>
            </ResponsiveContainer>
            </div>
        )}
      </div>
    </section>
  );
}
