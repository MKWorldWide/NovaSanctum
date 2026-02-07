import { DiscoveryRequest, DiscoveredResource } from '../../shared/types';

export type AdapterCandidate = Omit<
  DiscoveredResource,
  'score' | 'qualitySignals' | 'relevanceRationale'
>;

export interface DiscoveryAdapter {
  name: string;
  discover(request: DiscoveryRequest): Promise<AdapterCandidate[]>;
}
