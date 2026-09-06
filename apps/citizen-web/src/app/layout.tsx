import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";
import { LanguageSelector } from "@/components/LanguageSelector";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JanDrishti Citizen Portal",
  description: "Report civic issues directly to the government.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 min-h-screen flex flex-col`}
      >
        <LanguageProvider>
          <header className="p-4 flex justify-end">
            <LanguageSelector />
          </header>
          <main className="flex-1 flex flex-col max-w-md mx-auto w-full p-4 relative">
            {children}
          </main>
        </LanguageProvider>
      </body>
    </html>
  );
}
