/**
 * 🎮 GameDin Configuration
 * ========================
 * 
 * Configuration settings for the GameDin integration.
 * This file contains environment variables and default settings
 * for connecting to the GameDin platform.
 */

// Default configuration that can be overridden by environment variables
export const gameDinConfig = {
  // Base URL for the GameDin API
  apiBaseUrl: process.env.GAMEDIN_API_URL || 'https://api.gamedin.io/v1',
  
  // API key for authentication (should be set via environment variable)
  apiKey: process.env.GAMEDIN_API_KEY || '',
  
  // Default timeout for API requests in milliseconds
  requestTimeout: parseInt(process.env.GAMEDIN_REQUEST_TIMEOUT || '10000', 10),
  
  // Enable/disable debug logging
  debug: process.env.NODE_ENV !== 'production',
  
  // Cache settings
  cache: {
    // Enable/disable caching
    enabled: true,
    // Default TTL in seconds
    ttl: 300, // 5 minutes
    // Maximum number of items to cache
    max: 100,
  },
  
  // Rate limiting settings
  rateLimit: {
    // Enable/disable rate limiting
    enabled: true,
    // Maximum number of requests per window
    max: 100,
    // Time window in minutes
    windowInMinutes: 15,
  },
};

/**
 * Validates the GameDin configuration
 * @throws {Error} If required configuration is missing
 */
export function validateConfig(): void {
  if (!gameDinConfig.apiKey) {
    throw new Error('GAMEDIN_API_KEY environment variable is required');
  }
  
  if (!gameDinConfig.apiBaseUrl) {
    throw new Error('GAMEDIN_API_URL environment variable is required');
  }
}

/**
 * Gets the current configuration
 * @returns The current GameDin configuration
 */
export function getConfig() {
  return { ...gameDinConfig };
}

/**
 * Updates the configuration
 * @param updates - Partial configuration object with updates
 */
export function updateConfig(updates: Partial<typeof gameDinConfig>): void {
  Object.assign(gameDinConfig, updates);
}

// Validate configuration when this module is imported
if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'test') {
  try {
    validateConfig();
  } catch (error) {
    console.warn('GameDin configuration warning:', (error as Error).message);
    console.warn('Some GameDin features may be limited without proper configuration.');
  }
}
