export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function getImageUrl(path?: string | null): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5050";
  // Remove duplicate slashes if any
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
