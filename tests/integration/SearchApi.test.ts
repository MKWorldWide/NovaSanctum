/**
 * Validates the search API route shape with provider mocks
 */

import { POST } from '../../src/app/api/search/route';
import { NextRequest } from 'next/server';

jest.mock('../../src/services/search/providers/GoogleCseProvider', () => ({
  googleCseSearch: jest.fn().mockResolvedValue([]),
}));
jest.mock('../../src/services/search/providers/CrossrefProvider', () => ({
  crossrefSearch: jest.fn().mockResolvedValue([]),
}));
jest.mock('../../src/services/search/providers/ArxivProvider', () => ({
  arxivSearch: jest.fn().mockResolvedValue([]),
}));
jest.mock('../../src/services/search/providers/PubMedProvider', () => ({
  pubmedSearch: jest.fn().mockResolvedValue([]),
}));
jest.mock('../../src/services/search/providers/SemanticScholarProvider', () => ({
  semanticScholarSearch: jest.fn().mockResolvedValue([]),
}));

describe('POST /api/search', () => {
  it('returns 400 for missing query', async () => {
    // @ts-ignore
    const req = new NextRequest(new Request('http://localhost/api/search', { method: 'POST', body: JSON.stringify({}) }));
    const res = await POST(req as any);
    // @ts-ignore
    expect(res.status).toBe(400);
  });

  it('returns aggregated structure for a valid query', async () => {
    // @ts-ignore
    const req = new NextRequest(
      // @ts-ignore
      new Request('http://localhost/api/search', { method: 'POST', body: JSON.stringify({ query: 'quantum', includeWeb: false }) })
    );
    const res = (await POST(req as any)) as any;
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toHaveProperty('facilities');
    expect(json).toHaveProperty('publications');
    expect(json).toHaveProperty('patents');
    expect(json).toHaveProperty('institutes');
    expect(json).toHaveProperty('laboratories');
    // scholarly may be attached
    expect(json).toHaveProperty('web');
  });
});

