import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nadav Shtibel | Full-Stack Engineer",
  description: "Full-stack engineer building AI agents, MCP tools, automation, Hebrew tooling, and e-commerce solutions.",
  keywords: ["full-stack", "developer", "AI", "agents", "MCP", "automation", "TypeScript", "React", "Next.js"],
  authors: [{ name: "Nadav Shtibel", url: "https://github.com/Shtibel1" }],
  creator: "Nadav Shtibel",
  openGraph: {
    type: "website",
    locale: "he_IL",
    alternateLocale: "en_US",
    title: "Nadav Shtibel | Full-Stack Engineer",
    description: "Full-stack engineer building AI agents, MCP tools, automation, Hebrew tooling, and e-commerce solutions.",
    siteName: "Nadav Shtibel Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nadav Shtibel | Full-Stack Engineer",
    description: "Full-stack engineer building AI agents, MCP tools, automation, Hebrew tooling, and e-commerce solutions.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0a0a0f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
