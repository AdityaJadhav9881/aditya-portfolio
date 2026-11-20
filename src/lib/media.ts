const ALLOWED_HOST_SUFFIXES = [
  ".supabase.co",
  ".supabase.in",
  ".r2.dev",
  ".r2.cloudflarestorage.com",
];

const BLOCKED_HOSTS = ["localhost", "127.0.0.1", "0.0.0.0", "::1"];

export function isAllowedMediaUrl(raw: string): boolean {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return false;
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") return false;

  const host = url.hostname.toLowerCase();
  if (BLOCKED_HOSTS.includes(host)) return false;

  return ALLOWED_HOST_SUFFIXES.some((suffix) => host.endsWith(suffix));
}

export function mediaSrc(url: string | null | undefined): string {
  if (!url) return "";
  if (url.startsWith("/") || url.startsWith("data:")) return url;
  return `/api/images?url=${encodeURIComponent(url)}`;
}
