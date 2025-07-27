/**
 * 🏛️ Top Science Institutes - Core Service
 * Main service class for managing scientific institutions and research facilities
 */

import { EventEmitter } from 'events';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { createLogger, format, Logger, transports } from 'winston';
import NodeCache from 'node-cache';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { StatusCodes } from 'http-status-codes';

// Import types and interfaces
import {
  ScienceInstitute,
  ResearchLaboratory,
  InternationalCollaboration,
  NobelPrizeWinner,
  ResearchFacility,
  GameDinClient,
  QueryOptions,
  PaginatedResponse
} from '../../types/scientific-institutes.types';

// Import configuration and errors
import { mergeConfig } from './config';
import {
  TopScienceInstitutesError,
  NotFoundError,
  errorHandler,
  asyncHandler
} from './errors';

// Default data directory path
const DEFAULT_DATA_DIR = path.join(__dirname, '../../../data');

// Default data file paths
const DATA_FILES = {
  INSTITUTES: 'institutes.json',
  LABORATORIES: 'laboratories.json',
  COLLABORATIONS: 'collaborations.json',
  NOBEL_WINNERS: 'nobel_winners.json',
  FACILITIES: 'facilities.json',
} as const;

/**
 * Top Science Institutes Service
 */
export class TopScienceInstitutes extends EventEmitter {
  private static _instance: TopScienceInstitutes | null = null;
  private _initialized = false;
  private _logger: Logger;
  private _config: any;
  private _cache: NodeCache;
  private _institutes = new Map<string, ScienceInstitute>();
  private _laboratories = new Map<string, ResearchLaboratory>();
  private _collaborations = new Map<string, InternationalCollaboration>();
  private _nobelWinners = new Map<string, NobelPrizeWinner>();
  private _facilities = new Map<string, ResearchFacility>();
  private _gameDin: GameDinClient | null = null;

  private constructor(config: any = {}) {
    super();
    this._config = mergeConfig(config);
    this._logger = this._initializeLogger();
    this._cache = new NodeCache({
      stdTTL: this._config.cache.ttl,
      checkperiod: this._config.cache.checkPeriod
    });
    this._setupProcessHandlers();
  }

  public static getInstance(config: any = {}): TopScienceInstitutes {
    if (!TopScienceInstitutes._instance) {
      TopScienceInstitutes._instance = new TopScienceInstitutes(config);
    }
    return TopScienceInstitutes._instance;
  }

  private _initializeLogger(): Logger {
    return createLogger({
      level: this._config.logLevel || 'info',
      format: format.combine(
        format.timestamp(),
        format.json()
      ),
      transports: [new transports.Console()]
    });
  }

  private _setupProcessHandlers(): void {
    process.on('SIGTERM', this.shutdown);
    process.on('SIGINT', this.shutdown);
    process.on('unhandledRejection', this._handleUnhandledRejection);
    process.on('uncaughtException', this._handleUncaughtException);
  }

  private _handleUnhandledRejection(reason: unknown, promise: unknown): void {
    this._logger.error('Unhandled Rejection at:', { promise, reason });
    // Consider whether to crash the process or continue
    if (this._config.shutdownOnUnhandledRejection) {
      process.exit(1);
    }
  }

  private _handleUncaughtException(error: Error): void {
    this._logger.error('Uncaught Exception:', error);
    // Consider whether to crash the process or continue
    if (this._config.shutdownOnUncaughtException) {
      process.exit(1);
    }
  }

  public async initialize(): Promise<void> {
    if (this._initialized) {
      this._logger.warn('Service already initialized');
      return;
    }

    try {
      this._logger.info('Initializing TopScienceInstitutes service...');
      
      // Load data from files
      await this._loadData();
      
      // Initialize GameDin if configured
      if (this._config.gameDinApiKey) {
        await this._initializeGameDin();
      }
      
      // Initialize API server if enabled
      if (this._config.enableApi) {
        await this._initializeApiServer();
      }
      
      this._initialized = true;
      this._logger.info('TopScienceInstitutes service initialized successfully');
      this.emit('initialized');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this._logger.error('Failed to initialize service:', errorMessage);
      throw new TopScienceInstitutesError(
        `Failed to initialize service: ${errorMessage}`,
        'INITIALIZATION_ERROR',
        500
      );
    }
  }

  private async _loadData(): Promise<void> {
    const dataDir = this._config.dataDir || DEFAULT_DATA_DIR;
    
    // Ensure data directory exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Load or initialize data files
    await Promise.all([
      this._loadDataFile<ScienceInstitute>(path.join(dataDir, DATA_FILES.INSTITUTES), this._institutes),
      this._loadDataFile<ResearchLaboratory>(path.join(dataDir, DATA_FILES.LABORATORIES), this._laboratories),
      this._loadDataFile<InternationalCollaboration>(path.join(dataDir, DATA_FILES.COLLABORATIONS), this._collaborations),
      this._loadDataFile<NobelPrizeWinner>(path.join(dataDir, DATA_FILES.NOBEL_WINNERS), this._nobelWinners),
      this._loadDataFile<ResearchFacility>(path.join(dataDir, DATA_FILES.FACILITIES), this._facilities)
    ]);
    
    this._logger.info('Data loaded successfully');
  }

  private async _loadDataFile<T>(
    filePath: string,
    store: Map<string, T>
  ): Promise<void> {
    try {
      if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        if (Array.isArray(data)) {
          data.forEach((item: T & { id: string }) => {
            store.set(item.id, item);
          });
        }
      } else {
        // Create empty file if it doesn't exist
        fs.writeFileSync(filePath, JSON.stringify([], null, 2), 'utf-8');
      }
    } catch (error) {
      this._logger.error(`Error loading data file ${filePath}:`, error);
      throw error;
    }
  }

  private async _initializeGameDin(): Promise<void> {
    if (!this._config.gameDinApiKey) {
      this._logger.warn('GameDin API key not configured');
      return;
    }

    try {
      // Initialize GameDin client with API key
      // this._gameDin = new GameDinClient(this._config.gameDinApiKey);
      // await this._gameDin.initialize();
      this._logger.info('GameDin integration initialized');
    } catch (error) {
      this._logger.error('Failed to initialize GameDin integration:', error);
      throw error;
    }
  }

  private async _initializeApiServer(): Promise<void> {
    const app = express();
    
    // Middleware
    app.use(helmet());
    app.use(cors(this._config.corsOptions));
    app.use(express.json());
    
    // Rate limiting
    if (this._config.rateLimit.enabled) {
      app.use(rateLimit(this._config.rateLimit));
    }
    
    // Health check endpoint
    app.get('/health', (req, res) => {
      res.status(StatusCodes.OK).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.env.npm_package_version || 'unknown'
      });
    });
    
    // API routes
    this._setupApiRoutes(app);
    
    // Error handling
    app.use(errorHandler);
    
    // Start server
    const port = this._config.apiPort || 3000;
    this._server = app.listen(port, () => {
      this._logger.info(`API server listening on port ${port}`);
    });
  }

  private _setupApiRoutes(app: express.Application): void {
    // Institutes routes
    app.get('/api/institutes', asyncHandler(this.getInstitutes.bind(this)));
    app.get('/api/institutes/:id', asyncHandler(this.getInstitute.bind(this)));
    app.post('/api/institutes', asyncHandler(this.createInstitute.bind(this)));
    app.put('/api/institutes/:id', asyncHandler(this.updateInstitute.bind(this)));
    app.delete('/api/institutes/:id', asyncHandler(this.deleteInstitute.bind(this)));
    
    // Similar routes for other entities...
  }

  // Public API methods
  public async getInstitutes(
    options: QueryOptions = {}
  ): Promise<PaginatedResponse<ScienceInstitute>> {
    const { page = 1, pageSize = 10 } = options;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    const institutes = Array.from(this._institutes.values());
    
    // Apply filters, sorting, etc. from options
    
    return {
      data: institutes.slice(startIndex, endIndex),
      pagination: {
        total: institutes.length,
        page,
        pageSize,
        totalPages: Math.ceil(institutes.length / pageSize)
      }
    };
  }

  public async getInstitute(id: string): Promise<ScienceInstitute> {
    const institute = this._institutes.get(id);
    if (!institute) {
      throw new NotFoundError(`Institute with ID ${id} not found`);
    }
    return institute;
  }

  public async createInstitute(data: Omit<ScienceInstitute, 'id' | 'createdAt' | 'updatedAt'>): Promise<ScienceInstitute> {
    const id = uuidv4();
    const now = new Date();
    
    const institute: ScienceInstitute = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now
    };
    
    this._institutes.set(id, institute);
    await this._saveData();
    
    return institute;
  }

  public async updateInstitute(
    id: string,
    data: Partial<Omit<ScienceInstitute, 'id' | 'createdAt'>>
  ): Promise<ScienceInstitute> {
    const existing = this._institutes.get(id);
    if (!existing) {
      throw new NotFoundError(`Institute with ID ${id} not found`);
    }
    
    const updated: ScienceInstitute = {
      ...existing,
      ...data,
      updatedAt: new Date()
    };
    
    this._institutes.set(id, updated);
    await this._saveData();
    
    return updated;
  }

  public async deleteInstitute(id: string): Promise<void> {
    if (!this._institutes.has(id)) {
      throw new NotFoundError(`Institute with ID ${id} not found`);
    }
    
    this._institutes.delete(id);
    await this._saveData();
  }

  private async _saveData(): Promise<void> {
    const dataDir = this._config.dataDir || DEFAULT_DATA_DIR;
    
    await Promise.all([
      this._saveDataFile(path.join(dataDir, DATA_FILES.INSTITUTES), Array.from(this._institutes.values())),
      this._saveDataFile(path.join(dataDir, DATA_FILES.LABORATORIES), Array.from(this._laboratories.values())),
      this._saveDataFile(path.join(dataDir, DATA_FILES.COLLABORATIONS), Array.from(this._collaborations.values())),
      this._saveDataFile(path.join(dataDir, DATA_FILES.NOBEL_WINNERS), Array.from(this._nobelWinners.values())),
      this._saveDataFile(path.join(dataDir, DATA_FILES.FACILITIES), Array.from(this._facilities.values()))
    ]);
  }

  private async _saveDataFile(filePath: string, data: any[]): Promise<void> {
    try {
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      this._logger.error(`Error saving data to ${filePath}:`, error);
      throw error;
    }
  }

  public async shutdown(): Promise<void> {
    if (!this._initialized) {
      return;
    }
    
    this._logger.info('Shutting down TopScienceInstitutes service...');
    
    // Close API server if running
    if (this._server) {
      await new Promise<void>((resolve) => {
        this._server?.close(() => {
          this._logger.info('API server stopped');
          resolve();
        });
      });
    }
    
    // Save any pending data
    try {
      await this._saveData();
      this._logger.info('Data saved successfully');
    } catch (error) {
      this._logger.error('Error saving data during shutdown:', error);
    }
    
    // Close database connections, etc.
    
    this._initialized = false;
    this.emit('shutdown');
    this._logger.info('TopScienceInstitutes service shutdown complete');
  }
}

export default TopScienceInstitutes;
