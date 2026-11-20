import { prisma } from "@/lib/db";

export function settingString(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (typeof value === "object") {
    const v = value as { value?: unknown };
    if ("value" in v && (typeof v.value === "string" || typeof v.value === "number" || typeof v.value === "boolean")) {
      return String(v.value);
    }
    return JSON.stringify(value);
  }
  return String(value);
}

export async function getSiteSettingsMap(): Promise<Record<string, unknown>> {
  const settings = await prisma.siteSetting.findMany();
  return Object.fromEntries(settings.map((s) => [s.key, s.value]));
}

export async function getSiteSettingsStrings(): Promise<Record<string, string>> {
  const map = await getSiteSettingsMap();
  return Object.fromEntries(Object.entries(map).map(([k, v]) => [k, settingString(v)]));
}
