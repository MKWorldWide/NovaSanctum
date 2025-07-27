/**
 * 🏛️ Scientific Institutes - Type Definitions
 * Core type definitions for the TopScienceInstitutes service
 */

// Base timestamp interface for all entities
interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}

export interface Location {
  city: string;
  region: string;
  coordinates?: [number, number];
}

export interface ScienceInstitute extends Timestamped {
  id: string;
  name: string;
  type: 'university' | 'research_center' | 'laboratory' | 'institute' | 'foundation';
  country: string;
  location: Location;
  specialties: string[];
  established: number;
  staff: number;
  students: number;
  annualBudget: number;
  ranking: number;
  nobelPrizes: number;
  researchAreas: string[];
  internationalPartners: string[];
  facilities: string[];
  publications: number;
  patents: number;
  status: 'active' | 'inactive' | 'expanding';
  website: string;
  notes: string;
}

export interface ResearchLaboratory extends Timestamped {
  id: string;
  name: string;
  institute: string;
  type: 'physics' | 'chemistry' | 'biology' | 'engineering' | 'computer_science' | 'medicine' | 'materials' | 'quantum';
  specialties: string[];
  established: number;
  staff: number;
  annualBudget: number;
  equipment: string[];
  researchProjects: string[];
  internationalCollaborations: string[];
  publications: number;
  patents: number;
  status: 'active' | 'inactive' | 'under_construction';
  notes: string;
}

export interface CollaborationParticipant {
  institute: string;
  country: string;
  role: 'lead' | 'partner' | 'contributor';
}

export interface InternationalCollaboration extends Timestamped {
  id: string;
  name: string;
  participants: CollaborationParticipant[];
  researchArea: string;
  startDate: Date;
  endDate?: Date;
  status: 'planning' | 'active' | 'completed' | 'suspended';
  budget: number;
  objectives: string[];
  outcomes: string[];
  publications: number;
  patents: number;
  notes: string;
}

export interface NobelPrizeWinner extends Timestamped {
  id: string;
  name: string;
  institute: string;
  country: string;
  category: 'physics' | 'chemistry' | 'medicine' | 'economics' | 'peace' | 'literature';
  year: number;
  research: string;
  impact: string;
  currentStatus: 'active' | 'retired' | 'deceased';
  notes: string;
}

export interface ResearchFacility extends Timestamped {
  id: string;
  name: string;
  institute: string;
  type: 'particle_accelerator' | 'telescope' | 'supercomputer' | 'clean_room' | 'nuclear_reactor' | 'fusion_reactor' | 'quantum_computer';
  capabilities: string[];
  established: number;
  cost: number;
  staff: number;
  specifications: Record<string, unknown>;
  researchProjects: string[];
  internationalAccess: boolean;
  status: 'operational' | 'maintenance' | 'upgrade' | 'planned';
  gameIntegration?: {
    gameId?: string;
    gameData?: Record<string, unknown>;
    lastSync?: Date;
  };
  notes: string;
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export type SortDirection = 'asc' | 'desc';

export interface SortOption {
  field: string;
  direction: SortDirection;
}

export interface QueryOptions {
  page?: number;
  pageSize?: number;
  sort?: SortOption[];
  filters?: Record<string, unknown>;
  search?: string;
}

// Error Types
export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
  details?: Record<string, unknown>;
}

// Game Integration Types
export interface GameDinGame {
  id: string;
  name: string;
  description?: string;
  // Add other game properties as needed
}

export interface GameDinClient {
  initialize(apiKey: string): Promise<boolean>;
  getGame(gameId: string): Promise<GameDinGame | null>;
  // Add other GameDin client methods as needed
}
