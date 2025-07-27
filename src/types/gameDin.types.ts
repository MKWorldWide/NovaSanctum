/**
 * 🎮 GameDin Type Definitions
 * ===========================
 * 
 * TypeScript type definitions for the GameDin integration.
 */

/**
 * Interface for GameDin game data
 */
export interface GameDinGame {
  id: string;
  title: string;
  description: string;
  version: string;
  publisher: string;
  releaseDate: string;
  genres: string[];
  tags: string[];
  platforms: string[];
  rating: number;
  playerCount: number;
  maxPlayers: number;
  status: 'online' | 'offline' | 'maintenance';
  lastUpdated: Date;
}

/**
 * Interface for GameDin player statistics
 */
export interface GameDinPlayerStats {
  playerId: string;
  username: string;
  level: number;
  experience: number;
  gamesPlayed: number;
  achievements: string[];
  lastPlayed: Date;
  playTime: number; // in minutes
  rank: number;
}
