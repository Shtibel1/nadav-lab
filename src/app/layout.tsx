import type { Metadata, Viewport } from "next";
import { Frank_Ruhl_Libre, IBM_Plex_Mono, IBM_Plex_Sans_Hebrew, Instrument_Serif } from "next/font/google";
import "./globals.css";

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
});

const frank = Frank_Ruhl_Libre({
  variable: "--font-frank",
  subsets: ["hebrew"],
  weight: "300",
  display: "swap",
});

const plexHebrew = IBM_Plex_Sans_Hebrew({
  variable: "--font-plex-hebrew",
  subsets: ["hebrew", "latin"],
  weight: ["400", "500"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  preload: false,
});

const title = "Nadav Shtibel — Full-Stack Engineer";
const description =
  "Nadav Shtibel builds AI agents, MCP tooling, automation, Hebrew-first software and commerce systems that ship to production.";

export const metadata: Metadata = {
  metadataBase: new URL("https://lab.nadav-shtibel.com"),
  title,
  description,
  authors: [{ name: "Nadav Shtibel", url: "https://github.com/Shtibel1" }],
  creator: "Nadav Shtibel",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://lab.nadav-shtibel.com",
    locale: "he_IL",
    alternateLocale: "en_US",
    title,
    description,
    siteName: "Nadav Shtibel",
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#05080a",
  colorScheme: "dark",
};

const bootScript = `document.documentElement.classList.add('js')`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${instrument.variable} ${frank.variable} ${plexHebrew.variable} ${plexMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        {children}
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
