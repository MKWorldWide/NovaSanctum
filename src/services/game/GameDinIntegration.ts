/**
 * 🎮 GameDin Integration Service
 * ===============================
 * 
 * Handles integration with the GameDin platform, providing access to
 * game data, player statistics, and real-time game events.
 */

import { EventEmitter } from 'events';

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

/**
 * GameDin integration service
 */
export class GameDinIntegration extends EventEmitter {
  private static instance: GameDinIntegration;
  private isConnected: boolean = false;
  private apiKey: string | null = null;
  private baseUrl: string = 'https://api.gamedin.io/v1';

  private constructor() {
    super();
  }

  /**
   * Get the singleton instance of GameDinIntegration
   */
  public static getInstance(): GameDinIntegration {
    if (!GameDinIntegration.instance) {
      GameDinIntegration.instance = new GameDinIntegration();
    }
    return GameDinIntegration.instance;
  }

  /**
   * Initialize the GameDin integration
   * @param apiKey - Your GameDin API key
   */
  public async initialize(apiKey: string): Promise<boolean> {
    this.apiKey = apiKey;
    
    try {
      // Test the connection
      const response = await this.makeRequest('/status');
      this.isConnected = response.status === 'online';
      
      if (this.isConnected) {
        this.emit('connected');
        console.log('🎮 GameDin integration initialized successfully');
      }
      
      return this.isConnected;
    } catch (error) {
      console.error('Failed to initialize GameDin integration:', error);
      this.isConnected = false;
      return false;
    }
  }

  /**
   * Get a game by ID
   * @param gameId - The ID of the game to retrieve
   */
  public async getGame(gameId: string): Promise<GameDinGame | null> {
    try {
      const game = await this.makeRequest(`/games/${gameId}`);
      return this.mapGameData(game);
    } catch (error) {
      console.error(`Failed to fetch game ${gameId}:`, error);
      return null;
    }
  }

  /**
   * Search for games
   * @param query - Search query
   * @param limit - Maximum number of results to return
   */
  public async searchGames(query: string, limit: number = 10): Promise<GameDinGame[]> {
    try {
      const params = new URLSearchParams({
        q: query,
        limit: limit.toString(),
      });
      
      const response = await this.makeRequest(`/games/search?${params.toString()}`);
      return response.games.map((game: any) => this.mapGameData(game));
    } catch (error) {
      console.error('Failed to search games:', error);
      return [];
    }
  }

  /**
   * Get player statistics
   * @param playerId - The ID of the player
   */
  public async getPlayerStats(playerId: string): Promise<GameDinPlayerStats | null> {
    try {
      const stats = await this.makeRequest(`/players/${playerId}/stats`);
      return this.mapPlayerStats(stats);
    } catch (error) {
      console.error(`Failed to fetch stats for player ${playerId}:`, error);
      return null;
    }
  }

  /**
   * Make an authenticated request to the GameDin API
   */
  private async makeRequest(endpoint: string, method: string = 'GET', body?: any): Promise<any> {
    if (!this.apiKey) {
      throw new Error('GameDin API key not set. Call initialize() first.');
    }

    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
    };

    const options: RequestInit = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Map raw game data to our GameDinGame interface
   */
  private mapGameData(data: any): GameDinGame {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      version: data.version || '1.0.0',
      publisher: data.publisher || 'Unknown',
      releaseDate: data.releaseDate || new Date().toISOString(),
      genres: data.genres || [],
      tags: data.tags || [],
      platforms: data.platforms || [],
      rating: data.rating || 0,
      playerCount: data.playerCount || 0,
      maxPlayers: data.maxPlayers || 0,
      status: data.status || 'offline',
      lastUpdated: new Date(data.lastUpdated || Date.now()),
    };
  }

  /**
   * Map raw player stats to our GameDinPlayerStats interface
   */
  private mapPlayerStats(data: any): GameDinPlayerStats {
    return {
      playerId: data.playerId,
      username: data.username || 'Anonymous',
      level: data.level || 1,
      experience: data.experience || 0,
      gamesPlayed: data.gamesPlayed || 0,
      achievements: data.achievements || [],
      lastPlayed: new Date(data.lastPlayed || Date.now()),
      playTime: data.playTime || 0,
      rank: data.rank || 0,
    };
  }
}

// Export singleton instance
export const gameDin = GameDinIntegration.getInstance();
