export type GoogleItem = {
  title: string;
  link: string;
  snippet?: string;
  displayLink?: string;
};

export type WebResult = {
  title: string;
  url: string;
  snippet?: string;
  source?: string;
};

function getEnv(name: string): string | undefined {
  return process.env[name];
}

function parseAllowedDomains(raw?: string): string[] {
  if (!raw) return [];
  return raw
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);
}

function isAllowed(urlStr: string, allowed: string[]): boolean {
  if (allowed.length === 0) return true; // no filter
  try {
    const host = new URL(urlStr).hostname.toLowerCase();
    return allowed.some(dom => host === dom || host.endsWith('.' + dom));
  } catch {
    return false;
  }
}

export async function googleCseSearch(query: string, trustedOnly = true, limit = 10): Promise<WebResult[]> {
  const cx = getEnv('GOOGLE_CSE_ID');
  const key = getEnv('GOOGLE_API_KEY');
  if (!cx || !key) return [];

  const allowed = parseAllowedDomains(getEnv('SEARCH_ALLOWED_DOMAINS'));
  const params = new URLSearchParams({ q: query, cx, key, num: String(Math.min(Math.max(limit, 1), 10)), safe: 'active' });
  const res = await fetch(`https://www.googleapis.com/customsearch/v1?${params.toString()}`, { cache: 'no-store' });
  if (!res.ok) return [];
  const json = await res.json();
  const items: GoogleItem[] = json?.items || [];
  const mapped: WebResult[] = items.map(i => ({ title: i.title, url: i.link, snippet: i.snippet, source: i.displayLink }));
  return trustedOnly ? mapped.filter(r => isAllowed(r.url, allowed)) : mapped;
}

