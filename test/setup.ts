// Setup test environment
process.env.NODE_ENV = 'test';

// Import required modules
import { gameDin } from '../src/services/game/GameDinIntegration';
import { updateConfig } from '../src/config/gameDin.config';
import { GameDinGame } from '../src/types/game.types';
import sinon from 'sinon';

// Configure test settings
updateConfig({
  debug: false,
  cache: { 
    enabled: false,
    ttl: 300, // 5 minutes
    max: 1000
  },
  rateLimit: { 
    enabled: false,
    max: 100,
    windowInMinutes: 1
  },
  apiKey: 'test-api-key',
});

// Mock GameDin API responses
const MOCK_GAME: GameDinGame = {
  id: 'quantum-simulator',
  title: 'Quantum Physics Simulator',
  description: 'A simulation game about quantum physics',
  version: '1.0.0',
  publisher: 'Science Games Inc.',
  releaseDate: '2023-01-01',
  genres: ['Simulation', 'Education', 'Science'],
  platforms: ['PC', 'Mac'],
  rating: 4.5,
  playerCount: 0,
  maxPlayers: 100,
  status: 'online',
  lastUpdated: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isActive: true,
  metadata: {}
};

// Setup default stubs
const setupStubs = () => {
  return {
    getGame: sinon.stub(gameDin, 'getGame').resolves(MOCK_GAME),
    listGames: sinon.stub(gameDin, 'listGames').resolves([MOCK_GAME])
  };
};

// Export mocks and utilities
export { 
  gameDin, 
  MOCK_GAME, 
  setupStubs 
};
