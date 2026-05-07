import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomPlayer from "@/components/BottomPlayer";
import BottomNav from "@/components/BottomNav";
import AudioEngine from "@/components/AudioEngine";
import AuthListener from "@/components/AuthListener";
import ServiceWorkerRegistrar from "@/components/ServiceWorkerRegistrar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PulseNode | Premium Music Streaming",
  description: "Experience music without limits. Ad-free, AI-powered, and immersive.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PulseNode",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d0b1e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon-192.png" />
      </head>
      <body className={`${inter.className} bg-background text-foreground overflow-hidden h-[100dvh]`}>
        <ServiceWorkerRegistrar />
        <AuthListener />
        <AudioEngine />
        
        <main className="h-full pb-32">
          {children}
        </main>

        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 space-y-4 pointer-events-none">
          <div className="pointer-events-auto">
            <BottomPlayer />
          </div>
          <div className="pointer-events-auto">
            <BottomNav />
          </div>
        </div>
      </body>
    </html>
  );
}
