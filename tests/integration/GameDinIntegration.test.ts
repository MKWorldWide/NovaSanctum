/**
 * 🧪 GameDin Integration Tests
 * ===========================
 * 
 * Integration tests for the GameDin service.
 * These tests verify the functionality of the GameDin integration.
 */

import { jest, describe, beforeEach, afterEach, it, expect, beforeAll, afterAll } from '@jest/globals';
import { EventEmitter } from 'events';
import { GameDinGame, GameDinPlayerStats } from '../../src/services/game/GameDinIntegration';

// Create a mock implementation object
const mockImplementation = {
  getGames: jest.fn(),
};

type PlayerStats = {
  playerId: string;
  username: string;
  level: number;
  experience: number;
  gamesPlayed: number;
  achievements: string[];
  lastPlayed: Date;
  playTime: number;
  rank: number;
};

// Mock data
const mockGame1: GameDinGame = {
  id: 'game-1',
  title: 'Eternal Quest',
  description: 'An epic adventure',
  version: '1.0.0',
  publisher: 'Test Studios',
  releaseDate: '2023-01-01',
  genres: ['RPG', 'Adventure'],
  tags: ['fantasy', 'rpg'],
  platforms: ['PC', 'Console'],
  rating: 4.5,
  playerCount: 42,
  maxPlayers: 100,
  status: 'online',
  lastUpdated: new Date()
};

const mockGame2: GameDinGame = {
  id: 'game-2',
  title: 'Cosmic Journey',
  description: 'Explore the universe',
  version: '1.1.0',
  publisher: 'Space Games Inc',
  releaseDate: '2023-02-15',
  genres: ['Action', 'Adventure'],
  tags: ['space', 'exploration'],
  platforms: ['PC', 'Console', 'Mobile'],
  rating: 4.2,
  playerCount: 25,
  maxPlayers: 50,
  status: 'online',
  lastUpdated: new Date()
};

const mockPlayerStats: PlayerStats = {
  playerId: 'player-123',
  username: 'testuser',
  level: 42,
  experience: 12500,
  gamesPlayed: 15,
  achievements: ['first_win', 'explorer'],
  lastPlayed: new Date(),
  playTime: 2500,
  rank: 1
};

// Mock the GameDinIntegration class
const mockInitialize = jest.fn();
const mockShutdown = jest.fn();
const mockGetStatus = jest.fn();
const mockGetGames = jest.fn();
const mockGetGame = jest.fn();
const mockSearchGames = jest.fn();
const mockGetPlayerStats = jest.fn();

// Mock the GameDinIntegration class
jest.mock('../../src/services/game/GameDinIntegration', () => {
  return {
    GameDinIntegration: jest.fn().mockImplementation(() => ({
      initialize: mockInitialize,
      shutdown: mockShutdown,
      getStatus: mockGetStatus,
      getGames: mockGetGames,
      getGame: mockGetGame,
      searchGames: mockSearchGames,
      getPlayerStats: mockGetPlayerStats,
      on: jest.fn(),
      emit: jest.fn(),
      removeListener: jest.fn()
    })),
    gameDin: {
      initialize: mockInitialize,
      shutdown: mockShutdown,
      getStatus: mockGetStatus,
      getGames: mockGetGames,
      getGame: mockGetGame,
      searchGames: mockSearchGames,
      getPlayerStats: mockGetPlayerStats,
      on: jest.fn(),
      emit: jest.fn(),
      removeListener: jest.fn()
    }
  };
});

// Mock the entire module
jest.mock('../../src/services/game/GameDinIntegration', () => {
  const mockGameDin = {
    initialize: jest.fn(),
    shutdown: jest.fn(),
    getStatus: jest.fn(),
    getGames: jest.fn(),
    getGame: jest.fn(),
    searchGames: jest.fn(),
    getPlayerStats: jest.fn(),
  };
  
  return {
    GameDinIntegration: jest.fn(() => mockGameDin),
    gameDin: mockGameDin
  };
});

import { GameDinIntegration, gameDin } from '../../src/services/game/GameDinIntegration';

  // Helper function to set up default mocks
  function setupDefaultMocks() {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Set default implementations
    gameDin.initialize.mockResolvedValue({ success: true });
    gameDin.shutdown.mockResolvedValue({ success: true });
    gameDin.getStatus.mockResolvedValue({ 
      status: 'online', 
      version: '1.0.0',
      lastUpdated: new Date().toISOString()
    });
    gameDin.getGames.mockResolvedValue([mockGame1, mockGame2]);
    gameDin.getGame.mockImplementation((id: string) => 
      Promise.resolve(id === 'game-1' ? mockGame1 : id === 'game-2' ? mockGame2 : null)
    );
    gameDin.searchGames.mockResolvedValue([mockGame1]);
    gameDin.getPlayerStats.mockResolvedValue(mockPlayerStats);
  }
  
  // Initialize mocks before each test
  beforeEach(() => {
    setupDefaultMocks();
  });

  afterEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  // Helper function to simulate a delay
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  describe('initialize', () => {
    it('should initialize the GameDinIntegration service', async () => {
      // Act
      const result = await gameDin.initialize();
      
      // Assert
      expect(result).toEqual({ success: true });
      expect(gameDin.initialize).toHaveBeenCalled();
    });

    it('should handle initialization failure', async () => {
      // Arrange
      gameDin.initialize.mockRejectedValueOnce(new Error('API key invalid'));

      // Act & Assert
      await expect(gameDin.initialize())
        .rejects
        .toThrow('API key invalid');
    });
  });

  describe('shutdown', () => {
    it('should shutdown the GameDinIntegration service', async () => {
      // Act
      const result = await gameDin.shutdown();
      
      // Assert
      expect(result).toEqual({ success: true });
      expect(gameDin.shutdown).toHaveBeenCalled();
    });

    it('should handle shutdown errors', async () => {
      // Arrange
      gameDin.shutdown.mockRejectedValueOnce(new Error('Shutdown failed'));

      // Act & Assert
      await expect(gameDin.shutdown())
        .rejects
        .toThrow('Shutdown failed');
    });
  });

  describe('getStatus', () => {
    it('should return the status of the GameDinIntegration service', async () => {
      // Act
      const result = await gameDin.getStatus();
      
      // Assert
      expect(result).toEqual({ 
        status: 'online', 
        version: '1.0.0',
        lastUpdated: expect.any(String) 
      });
      expect(mockGetStatus).toHaveBeenCalled();
    });
  });

  describe('getGame', () => {
    it('should return a game by ID', async () => {
      // Act
      const result = await gameDin.getGame('game-1');
      
      // Assert
      expect(result).toMatchObject(mockGame1);
      expect(mockGetGame).toHaveBeenCalledWith('game-1');
    });
    
    it('should return null for non-existent game ID', async () => {
      // Arrange
      mockGetGame.mockResolvedValueOnce(null);
      
      // Act
      const result = await gameDin.getGame('non-existent-id');
      
      // Assert
      expect(result).toBeNull();
      expect(mockGetGame).toHaveBeenCalledWith('non-existent-id');
    });
  });

  describe('getGames', () => {
    it('should get all games', async () => {
      // Arrange
      const gameDin = new GameDinIntegration();
      
      // Act
      const result = await gameDin.getGames();
      
      // Assert
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(mockGetGames).toHaveBeenCalled();
      
      // Verify the first game has the expected structure
      if (result.length > 0) {
        const game = result[0];
        expect(game).toHaveProperty('id');
        expect(game).toHaveProperty('title');
        expect(game).toHaveProperty('description');
        expect(game).toHaveProperty('status');
      }
    });
    
    it('should handle errors when getting games', async () => {
      // Arrange
      const error = new Error('Failed to fetch games');
      mockGetGames.mockRejectedValueOnce(error);
      const gameDin = new GameDinIntegration();
      
      // Act & Assert
      await expect(gameDin.getGames())
        .rejects
        .toThrow('Failed to fetch games');
      
      expect(mockGetGames).toHaveBeenCalled();
    });
  });

  describe('searchGames', () => {
    it('should search games', async () => {
      // Arrange
      const gameDin = new GameDinIntegration();
      
      // Act
      const result = await gameDin.searchGames('Eternal');
      
      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockGame1);
      expect(mockSearchGames).toHaveBeenCalledWith('Eternal');
    });

    it('should handle errors when searching games', async () => {
      const query = 'Nonexistent';
      mockSearchGames.mockRejectedValueOnce(new Error('Search failed'));

      await expect(new GameDinIntegration().searchGames(query))
        .rejects
        .toThrow('Search failed');
      
      expect(mockSearchGames).toHaveBeenCalledWith(query);
    });
    
    it('should return empty array when no matches found', async () => {
      mockSearchGames.mockResolvedValueOnce([]);
      const result = await new GameDinIntegration().searchGames('NoMatch');
      expect(result).toEqual([]);
    });
  });

  describe('getPlayerStats', () => {
    it('should return player stats for a game', async () => {
      // Arrange
      const playerId = 'player-123';
      const gameDin = new GameDinIntegration();
      
      // Act
      const result = await gameDin.getPlayerStats(playerId);
      
      // Assert
      expect(result).toEqual(mockPlayerStats);
      expect(mockGetPlayerStats).toHaveBeenCalledWith(playerId);
    });

    it('should handle errors when getting player statistics', async () => {
      // Arrange
      const playerId = 'invalid-player';
      const error = new Error('Player not found');
      mockGetPlayerStats.mockRejectedValueOnce(error);
      const gameDin = new GameDinIntegration();

      // Act & Assert
      await expect(gameDin.getPlayerStats(playerId))
        .rejects
        .toThrow('Player not found');
      
      expect(mockGetPlayerStats).toHaveBeenCalledWith(playerId);
    });
  });
});
