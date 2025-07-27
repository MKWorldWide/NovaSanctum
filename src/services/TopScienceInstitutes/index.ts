/**
 * 🏛️ Top Science Institutes - Main Module
 * 
 * This module provides a comprehensive interface for managing scientific institutions,
 * research facilities, and their integrations with GameDin and other services.
 * 
 * @module TopScienceInstitutes
 */

export * from './config';
export * from './errors';
export { default as TopScienceInstitutes } from './TopScienceInstitutes';

// Re-export types for convenience
export * from '../../types/scientific-institutes.types';

/**
 * Create and initialize a new TopScienceInstitutes service instance
 * @param config Optional configuration overrides
 * @returns Initialized TopScienceInstitutes service instance
 */
export async function createTopScienceInstitutes(
  config: any = {}
): Promise<import('./TopScienceInstitutes').default> {
  const service = new (await import('./TopScienceInstitutes')).default(config);
  await service.initialize();
  return service;
}

/**
 * Get the singleton instance of TopScienceInstitutes service
 * @param config Optional configuration (only used if instance doesn't exist yet)
 * @returns TopScienceInstitutes service instance
 */
export function getTopScienceInstitutes(
  config: any = {}
): import('./TopScienceInstitutes').default {
  const TopScienceInstitutes = require('./TopScienceInstitutes').default;
  return TopScienceInstitutes.getInstance(config);
}

// Default export for ES modules
const TopScienceInstitutesService = {
  create: createTopScienceInstitutes,
  getInstance: getTopScienceInstitutes,
};

export default TopScienceInstitutesService;
