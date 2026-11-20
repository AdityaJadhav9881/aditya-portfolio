import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import SiteChrome from "@/components/SiteChrome";
import { prisma } from "@/lib/db";
import { settingString } from "@/lib/settings";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-inter",
});

export const dynamic = "force-dynamic";

const FALLBACK_TITLE = "Aditya Jadhav — Engineer, Builder, Explorer";
const FALLBACK_DESCRIPTION =
  "Engineering portfolio of Aditya Ramesh Jadhav. Building ideas without boundaries — from hardware experiments to complete IoT systems.";

async function getSiteMetadata(): Promise<Metadata> {
  try {
    const settings = await prisma.siteSetting.findMany();
    const map = Object.fromEntries(settings.map((s) => [s.key, settingString(s.value)]));
    const title = map.siteTitle || FALLBACK_TITLE;
    const description = map.siteDescription || FALLBACK_DESCRIPTION;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aditya-portfolio-nine-xi.vercel.app";
    const ogImage = map.ogImage || `${siteUrl}/api/og?title=${encodeURIComponent(title)}`;

    return {
      title: {
        default: title,
        template: "%s | Aditya Jadhav",
      },
      description,
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
        siteName: map.siteName || "Aditya Jadhav Portfolio",
        title,
        description,
        images: [{ url: ogImage, width: 1200, height: 630 }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [ogImage],
      },
    };
  } catch {
    return {
      title: {
        default: FALLBACK_TITLE,
        template: "%s | Aditya Jadhav",
      },
      description: FALLBACK_DESCRIPTION,
    };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  return getSiteMetadata();
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`h-full antialiased ${inter.variable}`}>
      <body className="min-h-full flex flex-col font-sans">
        <SiteChrome footer={<Footer />}>{children}</SiteChrome>
      </body>
    </html>
  );
}
