import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-inter",
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "Aditya Jadhav — Engineer, Builder, Explorer",
    template: "%s | Aditya Jadhav",
  },
  description:
    "Engineering portfolio of Aditya Ramesh Jadhav. Building ideas without boundaries — from hardware experiments to complete IoT systems.",
  keywords: [
    "Aditya Jadhav",
    "engineer",
    "builder",
    "electronics",
    "IoT",
    "embedded systems",
    "portfolio",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Aditya Jadhav Portfolio",
    title: "Aditya Jadhav — Engineer, Builder, Explorer",
    description:
      "Building ideas without boundaries. From hardware experiments to complete IoT systems.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`h-full antialiased ${inter.variable}`}>
      <body className="min-h-full flex flex-col font-sans">
        <Navigation />
        <main className="flex-1 pt-16 md:pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
