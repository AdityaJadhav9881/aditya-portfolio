import Link from "next/link";
import { prisma } from "@/lib/db";

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/skills", label: "Skills" },
  { href: "/journey", label: "Journey" },
  { href: "/research", label: "Research" },
  { href: "/contact", label: "Contact" },
];

async function getSocialLinks() {
  const settings = await prisma.siteSetting.findMany({
    where: { key: { in: ["github", "linkedin"] } },
  });
  const map = Object.fromEntries(settings.map((s) => [s.key, String(s.value)]));
  return { github: map.github || "#", linkedin: map.linkedin || "#" };
}

export default async function Footer() {
  const { github, linkedin } = await getSocialLinks();

  return (
    <footer className="border-t border-[var(--color-border)]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16 md:py-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-12">
          <div className="space-y-6">
            <Link href="/" className="text-[var(--color-text-primary)] font-semibold text-sm tracking-[0.15em] uppercase">
              Aditya
            </Link>
            <p className="text-[var(--color-text-muted)] text-sm max-w-xs leading-relaxed">
              Building ideas without boundaries. Continuously evolving.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-xs tracking-[0.12em] uppercase text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors duration-200">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-[var(--color-border)] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-[var(--color-text-muted)] text-xs">&copy; {new Date().getFullYear()} Aditya Ramesh Jadhav. All rights reserved.</p>
          <div className="flex gap-6">
            <a href={github} target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-muted)] text-xs hover:text-[var(--color-text-primary)] transition-colors duration-200">GitHub</a>
            <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-muted)] text-xs hover:text-[var(--color-text-primary)] transition-colors duration-200">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
