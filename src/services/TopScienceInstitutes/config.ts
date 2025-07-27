import { TopScienceInstitutesConfig } from '../types/scientific-institutes.types';

/**
 * Default configuration for TopScienceInstitutes service
 */
export const DEFAULT_CONFIG: Required<TopScienceInstitutesConfig> = {
  dataDir: './data',
  cacheTtl: 300, // 5 minutes
  apiRateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },
  logLevel: 'info',
  enableApi: true,
  apiPort: 3001,
  gameDinApiKey: process.env.GAMEDIN_API_KEY || '',
  enableCaching: true,
  maxCacheItems: 1000,
  enableRequestLogging: true,
  enableErrorTracking: true,
  enableMetrics: true,
  metricsPort: 9090,
  enableHealthCheck: true,
  healthCheckEndpoint: '/health',
  enableSwagger: process.env.NODE_ENV !== 'production',
  corsOptions: {
    origin: process.env.CORS_ORIGIN || '*', // In production, replace with specific origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
  },
  validation: {
    maxNameLength: 100,
    maxDescriptionLength: 1000,
    maxNotesLength: 5000,
    maxItemsPerPage: 100,
    defaultItemsPerPage: 10,
  },
  security: {
    enableHttps: process.env.NODE_ENV === 'production',
    enableCsrf: true,
    enableXssProtection: true,
    enableHsts: true,
    enableNoCache: true,
    enableXssFilter: true,
    enableDnsPrefetchControl: true,
    enableIeNoOpen: true,
    enableNoSniff: true,
    enableReferrerPolicy: true,
  },
  performance: {
    enableCompression: true,
    enableEtag: true,
    enableResponseTime: true,
    enableQueryParser: true,
    enableJsonParser: true,
    enableUrlencodedParser: true,
  },
  logging: {
    enableRequestLogging: true,
    enableErrorLogging: true,
    enableAuditLogging: true,
    logLevel: 'info',
    logFormat: 'combined', // 'combined', 'common', 'dev', 'short', 'tiny'
    logFile: 'logs/application.log',
    errorLogFile: 'logs/error.log',
    auditLogFile: 'logs/audit.log',
    logRotation: {
      frequency: 'daily',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      zippedArchive: true,
    },
  },
  cache: {
    enabled: true,
    ttl: 300, // 5 minutes
    checkPeriod: 60, // 1 minute
    useClones: false,
    maxKeys: 1000,
  },
  database: {
    type: 'file', // 'file' | 'mongodb' | 'postgres' | 'mysql'
    filePath: './data/storage.json',
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/scientific-institutes',
    postgres: {
      host: process.env.PG_HOST || 'localhost',
      port: parseInt(process.env.PG_PORT || '5432', 10),
      username: process.env.PG_USER || 'postgres',
      password: process.env.PG_PASSWORD || 'postgres',
      database: process.env.PG_DATABASE || 'scientific_institutes',
      ssl: process.env.PG_SSL === 'true',
    },
    mysql: {
      host: process.env.MYSQL_HOST || 'localhost',
      port: parseInt(process.env.MYSQL_PORT || '3306', 10),
      username: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || 'root',
      database: process.env.MYSQL_DATABASE || 'scientific_institutes',
      ssl: process.env.MYSQL_SSL === 'true',
    },
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV !== 'production',
  },
};

/**
 * Validates the configuration object
 * @param config Configuration to validate
 * @throws {Error} If configuration is invalid
 */
export function validateConfig(config: Partial<TopScienceInstitutesConfig>): void {
  if (config.apiPort && (config.apiPort < 1 || config.apiPort > 65535)) {
    throw new Error('Invalid API port number');
  }

  if (config.cacheTtl && config.cacheTtl < 0) {
    throw new Error('Cache TTL must be a positive number');
  }

  if (config.apiRateLimit) {
    if (config.apiRateLimit.windowMs <= 0) {
      throw new Error('Rate limit window must be a positive number');
    }
    if (config.apiRateLimit.max <= 0) {
      throw new Error('Rate limit max must be a positive number');
    }
  }
}

/**
 * Merges user configuration with defaults
 * @param userConfig User-provided configuration
 * @returns Merged configuration
 */
export function mergeConfig(
  userConfig: TopScienceInstitutesConfig = {}
): Required<TopScienceInstitutesConfig> {
  // Create a deep copy of the default config
  const merged: any = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
  
  // Deep merge user config
  for (const [key, value] of Object.entries(userConfig)) {
    if (value !== undefined && value !== null) {
      if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
        merged[key] = { ...merged[key], ...value };
      } else {
        merged[key] = value;
      }
    }
  }

  return merged as Required<TopScienceInstitutesConfig>;
}

/**
 * Loads configuration from environment variables
 * @returns Configuration from environment
 */
export function loadConfigFromEnv(): Partial<TopScienceInstitutesConfig> {
  return {
    dataDir: process.env.DATA_DIR,
    cacheTtl: process.env.CACHE_TTL ? parseInt(process.env.CACHE_TTL, 10) : undefined,
    logLevel: process.env.LOG_LEVEL as any,
    enableApi: process.env.ENABLE_API !== 'false',
    apiPort: process.env.API_PORT ? parseInt(process.env.API_PORT, 10) : undefined,
    gameDinApiKey: process.env.GAMEDIN_API_KEY,
    enableCaching: process.env.ENABLE_CACHING !== 'false',
    maxCacheItems: process.env.MAX_CACHE_ITEMS ? parseInt(process.env.MAX_CACHE_ITEMS, 10) : undefined,
    enableRequestLogging: process.env.ENABLE_REQUEST_LOGGING !== 'false',
    enableErrorTracking: process.env.ENABLE_ERROR_TRACKING !== 'false',
    enableMetrics: process.env.ENABLE_METRICS !== 'false',
    metricsPort: process.env.METRICS_PORT ? parseInt(process.env.METRICS_PORT, 10) : undefined,
    enableHealthCheck: process.env.ENABLE_HEALTH_CHECK !== 'false',
    healthCheckEndpoint: process.env.HEALTH_CHECK_ENDPOINT,
    enableSwagger: process.env.ENABLE_SWAGGER === 'true',
  };
}
