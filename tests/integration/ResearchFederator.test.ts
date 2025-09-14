/**
 * Integration-like test for federatedSearch (with provider mocks).
 */

import { federatedSearch } from '../../src/services/search/ResearchFederator';

jest.mock('../../src/services/search/providers/GoogleCseProvider', () => ({
  googleCseSearch: jest.fn().mockResolvedValue([]),
}));

jest.mock('../../src/services/search/providers/CrossrefProvider', () => ({
  crossrefSearch: jest.fn().mockResolvedValue([
    { title: 'Perovskite Efficiency Breakthrough', doi: '10.1000/test', authors: ['Alice'], year: 2024, venue: 'Nature', source: 'crossref' },
  ]),
}));

jest.mock('../../src/services/search/providers/ArxivProvider', () => ({
  arxivSearch: jest.fn().mockResolvedValue([
    { id: 'arxiv:1234.5678', title: 'Quantum Dots Overview', authors: ['Bob'], url: 'https://arxiv.org/abs/1234.5678' },
  ]),
}));

jest.mock('../../src/services/search/providers/PubMedProvider', () => ({
  pubmedSearch: jest.fn().mockResolvedValue([
    { id: '123456', title: 'Solid-state Battery Advances', authors: ['Carol'], year: 2023, journal: 'Science' },
  ]),
}));

jest.mock('../../src/services/search/providers/SemanticScholarProvider', () => ({
  semanticScholarSearch: jest.fn().mockResolvedValue([
    { title: 'Grid Optimization Methods', url: 'https://semanticscholar.org/paper/abc' },
  ]),
}));

describe('federatedSearch', () => {
  it('aggregates internal and scholarly providers', async () => {
    const result = await federatedSearch('perovskite', { includeWeb: false });
    expect(result).toHaveProperty('facilities');
    expect(result).toHaveProperty('publications');
    expect(result).toHaveProperty('patents');
    expect(result).toHaveProperty('institutes');
    expect(result).toHaveProperty('laboratories');
    expect(result).toHaveProperty('scholarly');
    expect(result.scholarly.crossref[0].title).toMatch(/Perovskite/i);
  });
});

