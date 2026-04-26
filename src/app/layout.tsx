import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { OfflineIndicator } from "@/components/common/OfflineIndicator";
import { BottomNav } from "@/components/layout/BottomNav";
import { ThemeSync } from "@/components/layout/ThemeSync";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Founder CRM",
  description: "Умная CRM для основателей",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <ThemeSync />
        <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 pb-24 pt-4">
          <OfflineIndicator />
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
