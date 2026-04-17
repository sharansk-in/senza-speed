"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X, Activity } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Features", href: "#features" },
  { name: "Compare", href: "#compare" },
  { name: "History", href: "#history" },
  { name: "WiFi Map", href: "#wifi" },
  { name: "Insights", href: "#insights" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        isScrolled
          ? "py-3 glass border-b shadow-sm"
          : "py-5 bg-transparent border-transparent"
      )}
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-foreground text-background p-1.5 rounded-lg group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
            <span className="font-bold tracking-tight text-lg">
              SENZA SPEED
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Action */}
          <div className="hidden md:flex items-center gap-4">
            <button className="bg-foreground text-background px-5 py-2.5 rounded-full text-sm font-medium hover:scale-105 transition-transform shadow-lg">
              Run Test
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 opacity-70 hover:opacity-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden absolute top-full left-0 right-0 glass border-b py-4 px-6 flex flex-col gap-4"
        >
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-base font-medium opacity-80 py-2 border-b border-foreground/10"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <button className="bg-foreground text-background px-5 py-3 rounded-xl text-sm font-medium mt-2 w-full">
            Run Test
          </button>
        </motion.div>
      )}
    </header>
  );
}
