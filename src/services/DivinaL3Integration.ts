/**
 * 🎮 Divina-L3 Integration Service
 * 
 * Integrates the Divina-L3 gaming blockchain with NovaSanctum's AI capabilities
 * and the Genesis Protocol, providing a unified gaming and AI infrastructure.
 * 
 * @author Khandokar Lilitú Sunny
 * @protocol Primal Genesis Engine™
 * @matrix Elohim Matrix ID: ✶-∞-014
 */

/**
 * 🎮 Divina-L3 Integration Service
 * 
 * Integrates the Divina-L3 gaming blockchain with NovaSanctum's AI capabilities
 * and the Genesis Protocol, providing a unified gaming and AI infrastructure.
 * 
 * @author Khandokar Lilitú Sunny
 * @protocol Primal Genesis Engine™
 * @matrix Elohim Matrix ID: ✶-∞-014
 */

// Core dependencies
import { EventEmitter } from 'events';
import * as os from 'os';
import * as http from 'http';
import * as https from 'https';
import { Server } from 'http';
import { performance } from 'perf_hooks';
import { Logger } from 'winston';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import express from 'express';

// Type definitions
type Dict<T> = { [key: string]: T };

// Game related types
interface GameEngine {
  name: string;
  version: string;
  start: () => Promise<void>;
  stop: () => Promise<void>;
  on: (event: string, listener: (...args: any[]) => void) => void;
  emit: (event: string, ...args: any[]) => void;
}

type GameStatus = 'created' | 'initializing' | 'running' | 'paused' | 'stopped' | 'error';

interface GamingFeatures {
  multiplayer: boolean;
  achievements: boolean;
  leaderboards: boolean;
  cloudSaves: boolean;
  crossPlatform: boolean;
}

interface CrossChainBridge {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  isConnected: boolean;
}

interface GenesisProtocol {
  start: () => Promise<void>;
  stop: () => Promise<void>;
  status: string;
}

interface RealTimeEngine {
  start: () => Promise<void>;
  stop: () => Promise<void>;
  on: (event: string, listener: (...args: any[]) => void) => RealTimeEngine;
  emit: (event: string, ...args: any[]) => boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  updateMetrics: () => void;
  getStatus: () => { status: string; lastUpdated: Date; metrics: any };
  metrics: {
    latency: number;
    throughput: number;
    connections: number;
    messagesPerSecond?: number;
  };
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  updateMetrics: () => void;
  getStatus: () => {
    status: string;
    lastUpdated: Date;
    metrics: Record<string, any>;
  };
}

// Using Node.js built-in types for Process, MemoryUsage, and CpuUsage
declare global {
  namespace NodeJS {
    // Augment ProcessEnv with our custom environment variables
    interface ProcessEnv {
      DIVINA_L3_API_KEY?: string;
      NODE_ENV: 'development' | 'production' | 'test';
    }
  }
}

// System load interface for monitoring
interface SystemLoad {
  cpu: {
    user: number;
    system: number;
    idle: number;
  };
  memory: {
    total: number;
    free: number;
    used: number;
    process: NodeJS.MemoryUsage;
  };
  network: {
    in: number;
    out: number;
  };
  uptime: number;
  timestamp: number;
}

// Interface for the constructor parameters
interface DivinaL3IntegrationServiceOptions {
  logger: Logger;
  config: DivinaL3Config;
}

// Service metrics interface moved below for proper declaration order

// Configuration interface with required and optional properties
interface DivinaL3Config {
  // Required properties
  apiKey: string;
  environment: 'development' | 'staging' | 'production';
  maxRetries: number;
  timeout: number;
  
  // Optional properties with default values
  healthCheckPort: number;
  logLevel: 'error' | 'warn' | 'info' | 'debug';
  enableMetrics: boolean;
  maxGames: number;
  autoStartHealthCheck: boolean;
}

// Event types
type DivinaL3Event = 
  | 'initialized'
  | 'shutdown'
  | 'error'
  | 'gameUpdated'
  | 'gameRemoved';

/**
 * Custom error class for DivinaL3 specific errors
 */
class DivinaL3Error extends Error {
  public readonly code: string;
  public readonly context?: Record<string, unknown>;
  public readonly cause?: Error;

  constructor(
    message: string,
    code: string = 'DIVINA_L3_ERROR',
    context?: Record<string, unknown>,
    cause?: unknown
  ) {
    super(message);
    this.name = 'DivinaL3Error';
    this.code = code;
    
    if (context) {
      this.context = context;
    }
    
    if (cause instanceof Error) {
      this.cause = cause;
      this.stack = cause.stack;
    } else if (cause) {
      this.cause = new Error(String(cause));
    }

    // Maintain proper prototype chain
    Object.setPrototypeOf(this, DivinaL3Error.prototype);
  }

  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      context: this.context,
      cause: this.cause ? {
        name: this.cause.name,
        message: this.cause.message,
        stack: this.cause.stack
      } : undefined
    };
  }
}

/**
 * Divina L3 Integration Service
 * 
 * Handles core integration functionality with the Divina L3 network,
 * including game management, health checks, and system metrics.
 */
export class DivinaL3IntegrationService extends EventEmitter {
  private static _instance: DivinaL3IntegrationService | null = null;
  // Logger will be properly initialized in the constructor
  private _config: DivinaL3Config & {
    realTimeEngine?: {
      connectionString: string;
      options: Record<string, any>;
    };
    genesisRpcUrl?: string;
    chainId?: string;
    privateKey?: string;
    contracts?: Record<string, string>;
    blockchain?: {
      rpcUrl: string;
      chainId: string;
      privateKey: string;
      contracts: Record<string, string>;
    };
  } = {
    apiKey: '',
    environment: 'development',
    maxRetries: 3,
    timeout: 30000,
    healthCheckPort: 3000,
    logLevel: 'info',
    enableMetrics: true,
    maxGames: 100,
    autoStartHealthCheck: true,
    realTimeEngine: {
      connectionString: 'default-connection-string',
      options: {}
    }
  };
  // Core service state
  private _healthCheckServer: Server | null = null;
  private _healthCheckPort: number = 3000;
  private _startTime: number = Date.now();
  private _version: string = '1.0.0';
  
  // Service instances
  private _blockchainService: any = null;
  private _aiService: any = null;
  private _quantumService: any = null;
  private _consciousnessService: any = null;
  private _gamingFeatures: any = null;
  private _genesisProtocol: any = null;
  private _crossChainBridge: any = null;
  private _realTimeEngine: RealTimeEngine = {
    start: async (): Promise<{ success: boolean }> => {
      this._logger.info('Starting real-time engine...');
      // Initialize metrics
      this._realTimeEngine.metrics = {
        latency: 0,
        throughput: 0,
        connections: 0,
        messagesPerSecond: 0
      };
      this._realTimeEngine.isConnected = true;
      this._realTimeEngine.emit('start');
      return { success: true };
    },
    
    stop: async (): Promise<{ success: boolean }> => {
      this._logger.info('Stopping real-time engine...');
      this._realTimeEngine.isConnected = false;
      this._realTimeEngine.emit('stop');
      return { success: true };
    },
    
    on: (event: string, listener: (...args: any[]) => void): RealTimeEngine => {
      if (!this._eventListeners.has(event)) {
        this._eventListeners.set(event, []);
      }
      this._eventListeners.get(event)?.push(listener);
      return this._realTimeEngine;
    },
    
    emit: (event: string, ...args: any[]): boolean => {
      const listeners = this._eventListeners.get(event) || [];
      listeners.forEach(listener => {
        try {
          listener(...args);
        } catch (error) {
          this._logger.error(`Error in event listener for ${event}:`, error);
        }
      });
      return true;
    },
    
    connect: async (): Promise<void> => {
      this._logger.info('Connecting real-time engine...');
      this._realTimeEngine.isConnected = true;
      this._realTimeEngine.metrics.connections++;
      this._realTimeEngine.emit('connect');
    },
    
    disconnect: async (): Promise<void> => {
      this._logger.info('Disconnecting real-time engine...');
      this._realTimeEngine.isConnected = false;
      this._realTimeEngine.metrics.connections = Math.max(0, this._realTimeEngine.metrics.connections - 1);
      this._realTimeEngine.emit('disconnect');
    },
    
    updateMetrics: (): void => {
      this._realTimeEngine.metrics = {
        ...this._realTimeEngine.metrics,
        latency: Math.random() * 100,
        throughput: Math.random() * 1000,
        messagesPerSecond: Math.random() * 500,
        connections: this._realTimeEngine.isConnected ? 1 : 0
      };
    },
    
    getStatus: (): { status: string; lastUpdated: Date; metrics: any } => ({
      status: this._realTimeEngine.isConnected ? 'connected' : 'disconnected',
      lastUpdated: new Date(),
      metrics: { ...this._realTimeEngine.metrics }
    }),
    
    // Properties
    metrics: { 
      latency: 0, 
      throughput: 0, 
      connections: 0,
      messagesPerSecond: 0
    },
    isConnected: false,
    status: 'disconnected',
    lastUpdated: new Date()
  };

// ...

/**
 * Get real-time engine status
 * @returns The current status of the real-time engine
 */
public getRealTimeEngineStatus(): RealTimeEngine {
  return this._realTimeEngine;
}

// ...

/**
 * Initialize the real-time engine
 */
private async initializeRealTimeEngine(): Promise<void> {
  this._logger.info('Initializing real-time engine...');
  
  try {
    // Start the engine
    await this._realTimeEngine.start();
    
    // Set up event listeners
    this._realTimeEngine.on('connect', (clientId: string) => {
      this._logger.info(`Client connected: ${clientId}`);
    });
    
    this._realTimeEngine.on('disconnect', (clientId: string) => {
      this._logger.info(`Client disconnected: ${clientId}`);
    });
    
    this._logger.info('Real-time engine initialized successfully');
  } catch (error) {
      await this.initializeAIService();
      await this.initializeGamingFeatures();
      await this.initializeRealTimeEngine();
      await this.initializeGenesisIntegration();
      await this.initializeCrossChainBridge();
      
      // Start health check server if enabled
      if (this._config.autoStartHealthCheck) {
        await this.startHealthCheckServer();
      }
      
      this._isInitialized = true;
      this._logger.info('DivinaL3IntegrationService initialized successfully');
      this.emit('initialized');
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this._logger.error('Failed to initialize Divina L3 Integration Service', err);
      throw new DivinaL3Error(
        'Failed to initialize service',
        'INITIALIZATION_FAILED',
        { cause: err }
      );
    }
  }

  /**
   * Shutdown the service gracefully
   */
  public async shutdown(): Promise<void> {
    if (this._shutdownInProgress) {
      this._logger.warn('Shutdown already in progress');
      return;
    }

    this._shutdownInProgress = true;
    this._logger.info('Shutting down Divina L3 Integration Service');

    try {
      // Stop metrics collection
      if (this._metricsInterval) {
        clearInterval(this._metricsInterval);
        this._metricsInterval = null;
      }

      // Stop health check server if running
      if (this._healthCheckServer) {
        await this.stopHealthCheckServer();
      }

      // Clear all games
      this._games.clear();
      
      this._isInitialized = false;
      this._shutdownInProgress = false;
      this.emit('shutdown');
      this._logger.info('Divina L3 Integration Service shutdown complete');
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this._logger.error('Error during shutdown', err);
      throw new DivinaL3Error(
        'Error during shutdown',
        'SHUTDOWN_ERROR',
        {},
        err
      );
    }
  }

  // Error handling for system metrics update
  private handleSystemMetricsError(error: unknown): never {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    this._logger.error('Failed to update system metrics', error);
    throw new DivinaL3Error(
      'Failed to update system metrics',
      'SYSTEM_METRICS_ERROR',
      { error: errorMessage }
    );
  }

  /**
   * Performs a health check of the service
   * @returns Health check result with success status and optional message
   */
  private async performHealthCheck(): Promise<HealthCheckResponse> {
    const systemLoad = this.getSystemLoad();
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();
    const now = Date.now();

    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime,
      system: {
        load: systemLoad,
        memory: {
          rss: memoryUsage.rss,
          heapTotal: memoryUsage.heapTotal || 0,
          heapUsed: memoryUsage.heapUsed || 0,
          external: memoryUsage.external || 0
        },
        cpu: process.cpuUsage()
      },
      services: {
        blockchain: this._blockchainService ? 'connected' : 'disconnected',
        aiService: this._aiService ? 'connected' : 'disconnected',
        quantumService: this._quantumService ? 'connected' : 'disconnected',
        consciousnessService: this._consciousnessService ? 'connected' : 'disconnected',
        realtime: this._realTimeEngine.isConnected ? 'connected' : 'disconnected'
      },
      metrics: {
        activeConnections: this._metrics.activeConnections,
        requestCount: this._metrics.requestCount,
        errorCount: this._metrics.errorCount,
        latency: this._metrics.averageLatency,
        uptime: now - this._startTime
      },
      version: this._version
    };
  }

  // Properties are already defined at the class level

  private async startHealthCheckServer(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Import express dynamically to avoid requiring it at the top level
      import('express')
        .then((express) => {
          try {
            const app = express.default();
            
            // Health check endpoint
            app.get('/health', async (req: any, res: any) => {
              try {
                const health = await this.performHealthCheck();
                res.json(health);
              } catch (error) {
                res.status(500).json({
                  status: 'error',
                  message: 'Health check failed',
                  error: error instanceof Error ? error.message : 'Unknown error'
                });
              }
            });

            // System metrics endpoint
            app.get('/metrics', (req: any, res: any) => {
              res.json({
                ...this._metrics,
                memoryUsage: process.memoryUsage(),
                uptime: process.uptime()
              });
            });

            // Start the server
            this._healthCheckServer = app.listen(this._config.healthCheckPort || 8080, () => {
              this._logger.info(`Health check server running on port ${this._config.healthCheckPort || 8080}`);
              resolve();
            });

            // Handle server errors
            this._healthCheckServer.on('error', (error: Error) => {
              this._logger.error('Health check server error:', error);
              reject(error);
            });
          } catch (error) {
            this._logger.error('Failed to start health check server:', error);
            reject(error);
          }
        })
        .catch((error) => {
          this._logger.error('Failed to import express:', error);
          reject(error);
        });
    });
  }

  private async stopHealthCheckServer(): Promise<void> {
    return new Promise((resolve) => {
      // @ts-ignore - The server has a close method but TypeScript doesn't know about it
      this._healthCheckServer?.close(() => {
        this._logger.info('Health check server stopped');
        this._healthCheckServer = null;
        resolve();
      });
    });
  }

  /**
   * Add a new game to the system
   * @param gameData The game data to add (excluding auto-generated fields)
   * @returns The newly created game
   * @throws {DivinaL3Error} If the service is not initialized or game is invalid
   */
  public addGame(gameData: Omit<Game, 'id' | 'createdAt' | 'updatedAt' | 'lastUpdated'>): Game {
    const methodName = 'addGame';
    const startTime = performance.now();
    
    try {
      // Service initialization check
      if (!this._isInitialized) {
        throw new DivinaL3Error(
          'Service not initialized',
          'SERVICE_NOT_INITIALIZED',
          { method: methodName }
        );
      }

      // Input validation
      if (!gameData || typeof gameData !== 'object' || Object.keys(gameData).length === 0) {
        throw new DivinaL3Error(
          'Game data is required and must be a non-empty object',
          'INVALID_GAME_DATA',
          { method: methodName, dataType: typeof gameData }
        );
      }

      // Required fields validation
      const requiredFields: (keyof Game)[] = ['name', 'version', 'engine'];
      const missingFields = requiredFields.filter(field => !(field in gameData));
      
      if (missingFields.length > 0) {
        throw new DivinaL3Error(
          `Missing required fields: ${missingFields.join(', ')}`,
          'MISSING_REQUIRED_FIELDS',
          { method: methodName, missingFields }
        );
      }

      // Game limit check
      if (this._games.size >= (this._config.maxGames || 1000)) {
        throw new DivinaL3Error(
          'Maximum number of games reached',
          'GAME_LIMIT_REACHED',
          { 
            method: methodName, 
            currentCount: this._games.size, 
            maxGames: this._config.maxGames 
          }
        );
      }

      // Generate a unique ID and set timestamps
      const id = uuidv4();
      const now = new Date();
      
      // Create the game object with required fields and defaults
      const game: Game = {
        ...gameData,
        id,
        status: gameData.status || 'created',
        transactions: 0,
        lastUpdated: now,
        createdAt: now,
        updatedAt: now,
        metadata: gameData.metadata || {},
        tags: gameData.tags || [],
        maxPlayers: gameData.maxPlayers || 1,
        isActive: gameData.isActive ?? true
      };

      // Validate game data structure
      if (game.maxPlayers < 1) {
        throw new DivinaL3Error(
          'maxPlayers must be at least 1',
          'INVALID_GAME_DATA',
          { method: methodName, maxPlayers: game.maxPlayers }
        );
      }

      // Store the game
      this._games.set(id, game);
      
      // Initialize game status
      this._gameStatuses.set(id, {
        status: 'created',
        players: 0,
        maxPlayers: game.maxPlayers,
        startedAt: null,
        endedAt: null,
        lastActivity: now
      });

      // Update metrics
      if (this._metrics) {
        this._metrics.requestCount = (this._metrics.requestCount || 0) + 1;
      }

      // Emit event with detailed context
      const eventData = { 
        gameId: id,
        name: game.name,
        version: game.version,
        timestamp: now.toISOString(),
        totalGames: this._games.size
      };
      
      this.emit('game:added', eventData);
      
      // Log the successful addition
      const duration = performance.now() - startTime;
      this._logger.info('Successfully added new game', { 
        method: methodName,
        gameId: id,
        name: game.name,
        version: game.version,
        status: game.status,
        duration: `${duration.toFixed(2)}ms`,
        totalGames: this._games.size
      });

      return game;
      
    } catch (error) {
      // Log the error with context
      const errorContext = {
        method: methodName,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      };
      
      this._logger.error('Failed to add game', errorContext);
      
      // Update error metrics with type safety
      if (this._metrics) {
        const currentCount = typeof this._metrics.errorCount === 'number' ? this._metrics.errorCount : 0;
        this._metrics.errorCount = currentCount + 1;
      }
      
      // Re-throw with proper error handling
      if (error instanceof DivinaL3Error) {
        throw error; // Already a well-formed error
      }
      
      throw new DivinaL3Error(
        'Failed to add game',
        'GAME_ADD_FAILED',
        { method: methodName },
        error instanceof Error ? error : undefined
      );
    }
}

/**
 * 🎮 Game Interface
 * 
 * Represents a game in the Divina L3 ecosystem with all its properties
 */
interface Game {
  id: string;
  name: string;
  status: GameStatus;
  engine: GameEngine;
  players: string[];
  maxPlayers: number;
  transactions: number;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
  riskScore?: number;
  recommendation?: string;
  lastAnalyzed?: Date;
  version?: string; // Added missing version property
  tags?: string[]; // Added missing tags property
  isActive?: boolean; // Added missing isActive property
  genesisProtocol?: {
    sacred: boolean;
    divine: boolean;
    resonance: number;
    emotionalHonoring: boolean;
    lastHarmonized: Date;
  };
  metadata: Record<string, unknown>;
  logLevel?: 'info' | 'debug' | 'warn' | 'error';
  enableMetrics?: boolean;
  [key: string]: any; // Allow additional properties to prevent index signature errors
}

// System Load Interface - Consolidated with the one above
// Using the more detailed version that includes additional system metrics

/**
 * 🌌 Quantum Signal Interface
 * 
 * Represents a quantum signal with its properties and measurements
 */
interface QuantumSignal {
  id: string;
  type: string;
  strength: number;
  frequency: number;
  amplitude: number;
  phase: number;
  timestamp: number | Date;
  source: string;
  resonance: number;
  sacred: boolean;
  divine: boolean;
  metadata: Record<string, unknown>;
}

// Health Check Response Interface
interface HealthCheckResponse {
  status: 'healthy' | 'error' | 'degraded';
  timestamp: string;
  uptime: number;
  system: {
    load: SystemLoad;
    memory: {
      rss: number;
      heapTotal: number;
      heapUsed: number;
      external: number;
    };
    cpu: NodeJS.CpuUsage;
  };
  services: {
    blockchain: string;
    aiService: string;
    quantumService: string;
    consciousnessService: string;
    realtime: string;
  };
  metrics: {
    activeConnections: number;
    requestCount: number;
    errorCount: number;
    latency: number;
    uptime: number;
  };
  version: string;
}

/**
 * 🎮 Gaming Blockchain Interface
 * 
 * Represents the L3 gaming blockchain with advanced features
 */
export interface GamingBlockchain {
  network: 'gamedin-l3';
  tps: number;
  uptime: number;
  transactionSuccessRate: number;
  averageResponseTime: number;
  activeGames: number;
  totalTransactions: number;
  gasSponsored: number;
  nftBatched: number;
}

/**
 * 🤖 AI Service Interface
 * 
 * Unified AI service combining AthenaMist and NovaSanctum
 */
export interface AIService {
  athenaMist: AthenaMistAI;
  novaSanctum: NovaSanctumAI;
  unified: UnifiedAI;
  consensus: ConsensusDetection;
}

/**
 * 🧠 AthenaMist AI Interface
 * 
 * Behavioral pattern recognition and fraud detection
 */
export interface AthenaMistAI {
  behavioralAnalysis: {
    patternRecognition: number;
    playerProfiling: number;
    anomalyDetection: number;
    riskAssessment: number;
  };
  fraudDetection: {
    accuracy: number;
    falsePositives: number;
    detectionSpeed: number;
    suspiciousActivity: number;
  };
  realTimeMonitoring: {
    activeSessions: number;
    alertsGenerated: number;
    responseTime: number;
    coverage: number;
  };
}

/**
 * 🧬 NovaSanctum AI Interface
 * 
 * Advanced analytics and game optimization
 */
// Service metrics interface
export interface ServiceMetrics {
  requestCount: number;
  errorCount: number;
  activeConnections: number;
  lastHealthCheck: Date | null;
  uptime: number;
  memoryUsage: NodeJS.MemoryUsage;
  systemLoad: SystemLoad | null;
  averageLatency: number;
}

export interface NovaSanctumAI {
  analytics: {
    realTimeInsights: number;
    predictiveModeling: number;
    performanceMetrics: number;
    optimizationSuggestions: number;
  };
  gameOptimization: {
    fpsOptimization: number;
    lastUpdated: Date;
    metadata?: Record<string, any>;
  };
  unlockAchievement(playerId: string, achievementId: string, xp: number): any;
  advancePrestige(playerId: string, newLevel: number): any;
}

/**
 * 🎮 Divina-L3 Integration Instance
 * 
 * Global instance of the Divina-L3 Integration Service with enhanced initialization
 */
export const divinaL3Integration = (() => {
  const instance = new DivinaL3IntegrationService();
  
  // Add global error handling
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('[DivinaL3] Unhandled Rejection at:', { promise, reason });
  });
  
  process.on('uncaughtException', (error) => {
    logger.error('[DivinaL3] Uncaught Exception:', error);
    // Perform any necessary cleanup
    process.exit(1); // Exit with error to restart the process if using PM2/forever
  });
  
  // Initialize on next tick to allow for event listeners to be registered
  process.nextTick(async () => {
    try {
      await instance.initializeDivinaL3();
      logger.info('[DivinaL3] Integration service initialized successfully');
    } catch (error) {
      logger.error('[DivinaL3] Failed to initialize integration service:', error);
      process.exit(1);
    }
  });
  
  return instance;
})();

// Add health check endpoint if running in a web server context
if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'test') {
  import('express').then(express => {
    const app = express();
    const port = process.env.HEALTH_CHECK_PORT || 3001;
    
    app.get('/health', (req, res) => {
      try {
        const status = divinaL3Integration.getDivinaL3Status();
        res.json({
          status: 'ok',
          timestamp: new Date().toISOString(),
          version: status.version,
          uptime: status.uptime
        });
      } catch (error) {
        res.status(500).json({
          status: 'error',
          error: 'Failed to get system status',
          timestamp: new Date().toISOString()
        });
      }
    });
    
    app.listen(port, () => {
      logger.info(`[DivinaL3] Health check server running on port ${port}`);
    });
  }).catch(error => {
    logger.warn('[DivinaL3] Could not start health check server:', error);
  });
}

/**
 * 🎮 Divina-L3 Integration Export
 * 
 * Export the Divina-L3 Integration for use throughout NovaSanctum
 */
export default DivinaL3IntegrationService; 