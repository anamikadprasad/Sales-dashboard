import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Sidebar } from "@/components/Sidebar";
import { AuthGuard } from "@/components/AuthGuard";
import { Navbar } from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sales Dashboard",
  description: "Sales Dashboard Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground antialiased`}
      >
        <Providers>
          <div className="flex min-h-screen">
            {/* Left sidebar (desktop) + mobile top bar provided by Sidebar component */}
            <Sidebar />

            {/* 2. Right Side Content Area */}
            <div className="flex-1 flex flex-col">
              {/* 3. Top Navbar (Now it will show!) */}
              <Navbar />

            {/* Main content area */}
            <main className="flex-1 min-h-screen pt-16 md:pt-0">
              {/* Add padding inside the page so content doesn't touch edges */}
              <div className="p-6">
                <AuthGuard>{children}</AuthGuard>
              </div>
            </main>
          </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}