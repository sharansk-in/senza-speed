"use client";

import * as React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { LiveTest } from "@/components/sections/LiveTest";
import { ResultsExperience } from "@/components/sections/ResultsExperience";
import { HistoryDashboard } from "@/components/sections/HistoryDashboard";
import { ISPComparison } from "@/components/sections/ISPComparison";
import { CTASection } from "@/components/sections/CTASection";

export default function Home() {
  const [testState, setTestState] = React.useState<"idle" | "testing" | "results">("idle");
  const [results, setResults] = React.useState<any>(null);

  const startTest = () => {
    setTestState("testing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTestComplete = (data: any) => {
    setResults(data);
    setTestState("results");
    
    // Save to real history for HistoryDashboard
    try {
        const historyValue = localStorage.getItem('senza_speed_history');
        const history = historyValue ? JSON.parse(historyValue) : [];
        const loadedDelta = Math.max(data.loadedPing - data.ping, 0);
        const jScore = Math.max(0, 1 - (data.jitter / 50)) * 30;
        const lScore = Math.max(0, 1 - (data.loss / 5)) * 40;
        const bScore = Math.max(0, 1 - (loadedDelta / 150)) * 30;

        const newRecord = {
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            download: data.download,
            upload: data.upload,
            ping: data.ping,
            score: Math.round(jScore + lScore + bScore)
        };
        history.push(newRecord);
        localStorage.setItem('senza_speed_history', JSON.stringify(history));
    } catch {}
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Navbar />

      <main className="flex-1">
        {testState === "idle" && (
          <HeroSection onStartTest={startTest} />
        )}

        {testState === "testing" && (
          <LiveTest onComplete={handleTestComplete} />
        )}

        {testState === "results" && (
          <ResultsExperience results={results} />
        )}

        {testState !== "testing" && (
          <>
            <HistoryDashboard />
            <ISPComparison />
            <CTASection onStartTest={startTest} />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
