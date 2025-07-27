/**
 * Game-related type definitions for the NovaSanctum application
 */

export interface GameDinGame {
  id: string;
  title: string;
  description: string;
  version: string;
  publisher: string;
  releaseDate: string;
  genres: string[];
  platforms: string[];
  rating: number;
  playerCount: number;
  maxPlayers: number;
  status: 'online' | 'offline' | 'maintenance';
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  metadata: Record<string, any>;
}

export interface GameIntegration {
  gameId: string;
  lastSync: Date;
  gameData?: GameDinGame;
}
