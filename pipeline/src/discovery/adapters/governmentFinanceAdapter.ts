import { DiscoveryRequest } from '../../shared/types';
import { AdapterCandidate, DiscoveryAdapter } from './types';

const FINANCE_CATALOG: AdapterCandidate[] = [
  {
    url: 'https://www.consumerfinance.gov/consumer-tools/educator-tools/youth-financial-education/',
    title: 'CFPB Youth Financial Education Tools',
    author: 'Consumer Financial Protection Bureau',
    institution: 'CFPB',
    resourceType: 'reference',
    license: 'Public Domain',
    access: 'open',
  },
  {
    url: 'https://www.consumerfinance.gov/consumer-tools/credit-reports-and-scores/',
    title: 'Credit Reports and Scores',
    author: 'Consumer Financial Protection Bureau',
    institution: 'CFPB',
    resourceType: 'reference',
    license: 'Public Domain',
    access: 'open',
  },
  {
    url: 'https://www.fdic.gov/resources/consumers/money-smart/',
    title: 'FDIC Money Smart Financial Education Program',
    author: 'Federal Deposit Insurance Corporation',
    institution: 'FDIC',
    resourceType: 'courseware',
    license: 'Public Domain',
    access: 'open',
  },
  {
    url: 'https://www.mymoney.gov/',
    title: 'MyMoney.gov Financial Literacy Portal',
    author: 'U.S. Financial Literacy and Education Commission',
    institution: 'MyMoney.gov',
    resourceType: 'reference',
    license: 'Public Domain',
    access: 'open',
  },
  {
    url: 'https://www.federalreserveeducation.org/',
    title: 'Federal Reserve Education',
    author: 'Federal Reserve System',
    institution: 'Federal Reserve',
    resourceType: 'courseware',
    license: 'Open - Terms Required',
    access: 'open',
  },
  {
    url: 'https://www.khanacademy.org/college-careers-more/financial-literacy',
    title: 'Khan Academy Financial Literacy',
    author: 'Khan Academy',
    institution: 'Khan Academy',
    resourceType: 'courseware',
    license: 'Open - Terms Required',
    access: 'open',
  },
  {
    url: 'https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-31',
    title: 'Investor.gov Credit and Debt Management Bulletins',
    author: 'U.S. Securities and Exchange Commission',
    institution: 'Investor.gov',
    resourceType: 'government-publication',
    license: 'Public Domain',
    access: 'open',
  },
];

export const governmentFinanceAdapter: DiscoveryAdapter = {
  name: 'government-finance',
  async discover(request: DiscoveryRequest): Promise<AdapterCandidate[]> {
    const subject = request.subject.toLowerCase();
    const relevant = /(money|credit|finance|budget|debt|bank|financial|investing|saving)/.test(
      subject
    );

    if (!relevant) {
      return [];
    }

    const terms = subject
      .split(/\s+/)
      .map(term => term.trim())
      .filter(term => term.length > 2);

    return FINANCE_CATALOG.filter(item => {
      const haystack = `${item.title} ${item.url} ${item.institution}`.toLowerCase();
      return terms.some(term => haystack.includes(term));
    });
  },
};
