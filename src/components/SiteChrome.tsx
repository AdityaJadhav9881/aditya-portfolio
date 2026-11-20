"use client";

import { usePathname } from "next/navigation";
import Navigation from "@/components/Navigation";

export default function SiteChrome({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return (
      <div className="min-h-full flex flex-col font-sans">{children}</div>
    );
  }

  return (
    <>
      <Navigation />
      <main className="flex-1 pt-16 md:pt-20">{children}</main>
      {footer}
    </>
  );
}
