import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <span className="text-[var(--color-accent)] text-xs tracking-[0.2em] uppercase font-medium">
        404
      </span>
      <h1 className="mt-6 text-3xl md:text-4xl font-semibold text-[var(--color-text-primary)]">
        Not found
      </h1>
      <p className="mt-4 text-[var(--color-text-secondary)] max-w-md">
        This page doesn&apos;t exist yet. Maybe it&apos;s part of the next build.
      </p>
      <Link
        href="/"
        className="mt-8 text-xs tracking-[0.12em] uppercase text-[var(--color-accent)] hover:text-[var(--color-text-primary)] transition-colors duration-200"
      >
        Return home
      </Link>
    </div>
  );
}
