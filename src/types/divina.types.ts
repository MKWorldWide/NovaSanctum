// Core type definitions for DivinaL3 service

export type GameEngine = 'unity' | 'unreal' | 'web3' | 'custom';
export type GameStatus = 'active' | 'inactive' | 'maintenance' | 'development' | 'suspended';

// System monitoring interfaces
export interface SystemLoad {
  cpu: NodeJS.CpuUsage & {
    load: number;
    cores: number;
    model: string;
  };
  memory: NodeJS.MemoryUsage & {
    usage: number;
  };
  timestamp: number;
  uptime: number;
}

export interface QuantumSignal {
  frequency: number;
  amplitude: number;
  phase: number;
  timestamp: number;
  source: string;
  metadata?: Record<string, unknown>;
}

export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  checks: {
    database: boolean;
    api: boolean;
    cache: boolean;
    externalServices: boolean;
  };
  metrics: {
    cpu: number;
    memory: number;
    heap: number;
    responseTime: number;
  };
  details?: Record<string, unknown>;
}

// Game related interfaces
export interface GameAI {
  behavioralScore: number;
  optimizationScore: number;
  riskScore: number;
  recommendation: string;
  lastAnalyzed: Date;
}

export interface GenesisProtocol {
  sacred: boolean;
  divine: boolean;
  resonance: number;
  emotionalHonoring: boolean;
  lastHarmonized: Date;
}

export interface Game {
  id: string;
  name: string;
  engine: GameEngine;
  status: GameStatus;
  aiAnalysis: GameAI;
  genesisProtocol: GenesisProtocol;
  createdAt: Date;
  updatedAt: Date;
  metadata: Record<string, unknown>;
  transactions: number;
  players: number;
  version: string;
  description?: string;
  tags?: string[];
  isLive: boolean;
  lastUpdated: Date;
}

// Service configuration
export interface DivinaL3Config {
  healthCheckPort: number;
  logLevel: 'error' | 'warn' | 'info' | 'debug' | 'trace';
  enableMetrics: boolean;
  maxGames: number;
}

// Event types
export type DivinaL3Event =
  | { type: 'initializing'; timestamp: Date }
  | { type: 'initialized'; timestamp: Date; duration: number }
  | { type: 'error'; error: Error; context: string; timestamp: Date }
  | { type: 'game_created'; gameId: string; name: string; timestamp: Date }
  | { type: 'game_updated'; gameId: string; updates: Partial<Game>; timestamp: Date }
  | { type: 'health_check'; status: HealthCheckResponse['status']; timestamp: Date };

// Custom error class for DivinaL3 specific errors
export class DivinaL3Error extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly context?: Record<string, unknown>,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'DivinaL3Error';

    // Maintain proper prototype chain
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DivinaL3Error);
    }
  }
}

// Type for event listeners
export type EventListener = (...args: unknown[]) => void;

// Extend the global NodeJS namespace
declare global {
  namespace NodeJS {
    interface Process {
      emit(event: string | symbol, ...args: unknown[]): boolean;
      on(event: string, listener: EventListener): this;
    }

    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test' | 'staging';
      DIVINA_L3_API_KEY?: string;
      // Add other environment variables as needed
    }
  }
}

// This export is needed to make this file a module
export {};
