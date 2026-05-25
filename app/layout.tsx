import type { Metadata } from "next";
import { Playfair_Display, Crimson_Text, Caveat } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const crimson = Crimson_Text({
  variable: "--font-crimson",
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  weight: ["500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Wandering Thread · Lottie",
  description:
    "Psychology meets AI Product Management. A portfolio exploring the threads between human cognition and artificial intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${crimson.variable} ${caveat.variable}`}
    >
      <body className="min-h-screen bg-cream text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
