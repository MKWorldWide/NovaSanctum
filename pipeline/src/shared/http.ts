import { URL } from 'node:url';
import { PipelineConfig } from './types';
import { sleep } from './utils';

const domainLastRequestAt = new Map<string, number>();

export async function fetchWithPolicy(url: string, config: PipelineConfig): Promise<Response> {
  const parsed = new URL(url);
  const domain = parsed.hostname.toLowerCase();
  const perMinute = Math.max(config.rateLimit.requestsPerDomainPerMinute, 1);
  const minIntervalMs = Math.ceil(60000 / perMinute);

  const last = domainLastRequestAt.get(domain);
  if (last) {
    const elapsed = Date.now() - last;
    if (elapsed < minIntervalMs) {
      await sleep(minIntervalMs - elapsed);
    }
  }

  domainLastRequestAt.set(domain, Date.now());

  const response = await fetch(url, {
    redirect: 'follow',
    headers: {
      'User-Agent': config.userAgent,
      Accept: 'text/html,application/pdf,application/xml;q=0.9,*/*;q=0.8',
    },
  });

  const contentLength = response.headers.get('content-length');
  if (contentLength) {
    const bytes = Number(contentLength);
    const maxBytes = config.maxDownloadSizeMb * 1024 * 1024;
    if (!Number.isNaN(bytes) && bytes > maxBytes) {
      throw new Error(
        `Blocked by max download size policy (${bytes} bytes > ${maxBytes} bytes) for ${url}`
      );
    }
  }

  return response;
}
