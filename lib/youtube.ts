const ID_PATTERN = /^[A-Za-z0-9_-]{6,15}$/;

const ALLOWED_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtu.be"
]);

export function extractYoutubeId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const candidate =
    /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    return null;
  }

  const host = url.hostname.toLowerCase();
  if (!ALLOWED_HOSTS.has(host)) return null;

  if (host === "youtu.be") {
    const id = url.pathname.split("/").filter(Boolean)[0] ?? "";
    return ID_PATTERN.test(id) ? id : null;
  }

  if (url.pathname === "/watch") {
    const id = url.searchParams.get("v") ?? "";
    return ID_PATTERN.test(id) ? id : null;
  }

  const match = url.pathname.match(
    /^\/(?:shorts|embed|live|v)\/([A-Za-z0-9_-]+)/
  );
  if (match && ID_PATTERN.test(match[1])) {
    return match[1];
  }

  return null;
}

export function isYoutubeUrl(input: string): boolean {
  return extractYoutubeId(input) !== null;
}

export function youtubeWatchUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`;
}
