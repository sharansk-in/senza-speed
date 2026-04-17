import * as React from "react";
import { Sparkles, Router, Users, ArrowDownUp, Wifi, Building2, MousePointer2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function AIInsights() {
  return (
    <section id="insights" className="py-24 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-500 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              <span>Senza Intelligence</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Smart Insights</h2>
          </div>
          <p className="text-foreground/60 max-w-md">
            Our AI engine analyzes millions of data points to give you actionable advice tailored to your network.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <InsightCard 
            icon={<Router className="w-5 h-5 text-blue-500" />}
            title="Router Placement"
            description="Moving your router 3 feet higher and away from the window could improve coverage by 18%."
            className="md:col-span-2 lg:col-span-1"
          />
          <InsightCard 
            icon={<Users className="w-5 h-5 text-orange-500" />}
            title="Slight ISP Congestion"
            description="We detected a 12% drop in your ISP's regional performance during peak hours (8 PM - 11 PM)."
          />
          <InsightCard 
            icon={<ArrowDownUp className="w-5 h-5 text-purple-500" />}
            title="Asymmetric Speeds"
            description="Your upload is significantly weaker than your download speed, typical for cable connections."
          />
          <InsightCard 
            icon={<Wifi className="w-5 h-5 text-green-500" />}
            title="Band Suggestion"
            description="For better stability close to the router, force your primary devices to use the 5GHz band."
            className="lg:col-span-2"
          />
          <InsightCard 
            icon={<Building2 className="w-5 h-5 text-blue-400" />}
            title="Remote Work"
            description="Great for remote work. Zoom, Teams, and Slack will run flawlessly with no dropouts."
          />
          <InsightCard 
            icon={<MousePointer2 className="w-5 h-5 text-red-500" />}
            title="Gaming Latency"
            description="Excellent latency. You hold a competitive advantage in fast-twitch multiplayer games."
          />
        </div>
      </div>
    </section>
  );
}

function InsightCard({ icon, title, description, className }: any) {
  return (
    <div className={cn("glass-card rounded-3xl p-8 hover:-translate-y-1 transition-transform duration-300", className)}>
      <div className="bg-background/50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h4 className="text-xl font-bold mb-3">{title}</h4>
      <p className="text-foreground/70 leading-relaxed text-sm">
        {description}
      </p>
    </div>
  );
}
