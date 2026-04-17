import * as React from "react";
import Link from "next/link";
import { Activity } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-foreground/10 py-16 mt-24">
      <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            <span className="font-bold tracking-tight text-lg">
              SENZA SPEED
            </span>
          </Link>
          <p className="text-sm opacity-60">by SKL Enterprises</p>
        </div>

        <div className="flex gap-8 text-sm font-medium opacity-70">
          <span>Privacy First</span>
          <span>No Data Selling</span>
          <span>Built for Truth</span>
        </div>

        <div className="text-sm opacity-50">
          &copy; {new Date().getFullYear()} SKL Enterprises. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
