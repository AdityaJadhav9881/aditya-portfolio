import Link from "next/link";

interface SectionLabelProps {
  label: string;
  href?: string;
}

export default function SectionLabel({ label, href }: SectionLabelProps) {
  const content = (
    <span className="text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-[var(--color-accent)] font-medium">
      {label}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block hover:opacity-80 transition-opacity duration-200">
        {content}
      </Link>
    );
  }

  return <div>{content}</div>;
}
