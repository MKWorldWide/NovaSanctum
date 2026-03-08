import { NextRequest, NextResponse } from 'next/server';

type Bucket = {
  count: number;
  resetAt: number;
};

const rateBuckets = new Map<string, Bucket>();

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 60;

function getClientKey(request: NextRequest, routeName: string): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = (forwarded || realIp || 'local').split(',')[0].trim();
  return `${routeName}:${ip}`;
}

export function enforceRateLimit(request: NextRequest, routeName: string): void {
  const now = Date.now();
  const key = getClientKey(request, routeName);
  const bucket = rateBuckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    rateBuckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }

  if (bucket.count >= MAX_REQUESTS_PER_WINDOW) {
    throw new Error('Rate limit exceeded. Please retry in a minute.');
  }

  bucket.count += 1;
}

export function enforceSameOrigin(request: NextRequest): void {
  const origin = request.headers.get('origin');
  if (!origin) return;

  const requestUrl = new URL(request.url);
  const originUrl = new URL(origin);
  const sameOrigin =
    requestUrl.protocol === originUrl.protocol && requestUrl.host === originUrl.host;
  if (!sameOrigin) {
    throw new Error('Cross-origin request rejected.');
  }
}

export async function parseJsonBody<T>(request: NextRequest): Promise<T> {
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.toLowerCase().includes('application/json')) {
    throw new Error('Expected application/json request body.');
  }
  const contentLengthRaw = request.headers.get('content-length');
  if (contentLengthRaw) {
    const contentLength = Number(contentLengthRaw);
    if (!Number.isNaN(contentLength) && contentLength > 100_000) {
      throw new Error('Request body too large. Max allowed is 100KB.');
    }
  }
  return (await request.json().catch(() => {
    throw new Error('Invalid JSON payload.');
  })) as T;
}

export function jsonOk(payload: unknown, status = 200): NextResponse {
  return NextResponse.json(payload, {
    status,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}

export function jsonError(message: string, status = 400): NextResponse {
  return NextResponse.json(
    { error: message },
    {
      status,
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  );
}
