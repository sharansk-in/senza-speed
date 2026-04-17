import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://senza-speed.com"),
  title: "SENZA SPEED | Modern Internet Metrics",
  description: "The global benchmark for internet diagnostics. Measure your true real-world network routing path, stability, jitter, and loaded latency beyond local ISP limits.",
  keywords: ["speed test", "internet speed", "latency", "jitter", "bufferbloat", "network test", "SENZA"],
  openGraph: {
    title: "SENZA SPEED",
    description: "Measure your real-world internet capacity natively.",
    url: "https://senza-speed.com",
    siteName: "SENZA SPEED",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    locale: "en-US",
    type: "website",
  },
  icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png" }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col selection:bg-blue-500/30 selection:text-blue-500">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          {/* Analytics Placeholder (Vercel Analytics / Cloudflare Web Analytics goes here) */}
        </ThemeProvider>
      </body>
    </html>
  );
}
