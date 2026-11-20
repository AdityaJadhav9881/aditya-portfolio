export function isChecked(value: FormDataEntryValue | null | undefined): boolean {
  return value === "on" || value === "true" || value === "1";
}

export function parseYear(value: FormDataEntryValue | null): number | null {
  if (!value) return null;
  const n = parseInt(value as string, 10);
  return Number.isNaN(n) ? null : n;
}

export function parseOrder(value: FormDataEntryValue | null): number {
  if (!value) return 0;
  const n = parseInt(value as string, 10);
  return Number.isNaN(n) ? 0 : n;
}

export function parseTechnologies(value: FormDataEntryValue | null): string[] {
  if (!value) return [];
  return String(value)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}
