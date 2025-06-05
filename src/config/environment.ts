export const ENVIRONMENT = {
  // Sacred Constants
  APP_NAME: 'NovaSanctum',
  APP_DESCRIPTION: 'Where Biology Meets Digital Transcendence',
  
  // Mystical Colors
  COLORS: {
    NEON_EMERALD: '#00FF9D',
    DEEP_SLATE: '#1A1A1A',
    MYSTIC_CYAN: '#00FFFF',
    VOID_BLACK: '#000000',
    PURE_WHITE: '#FFFFFF'
  },
  
  // Digital Alchemy
  API: {
    GRAPHQL_ENDPOINT: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || '',
    REGION: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1'
  },
  
  // Temple Security
  AUTH: {
    USER_POOL_ID: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID || '',
    CLIENT_ID: process.env.NEXT_PUBLIC_AWS_USER_POOL_CLIENT_ID || '',
    DOMAIN: process.env.NEXT_PUBLIC_DOMAIN || 'localhost:3000'
  },
  
  // Neural Interface
  FEATURES: {
    ENABLE_PARTICLES: true,
    ENABLE_ANIMATIONS: true,
    ENABLE_3D: false,
    ENABLE_VR: false
  }
} as const;

// Type definitions for our mystical environment
export type Environment = typeof ENVIRONMENT;
export type ColorKey = keyof typeof ENVIRONMENT.COLORS;
export type FeatureKey = keyof typeof ENVIRONMENT.FEATURES;

// Sacred validation
export const validateEnvironment = () => {
  const required = [
    'NEXT_PUBLIC_GRAPHQL_ENDPOINT',
    'NEXT_PUBLIC_AWS_USER_POOL_ID',
    'NEXT_PUBLIC_AWS_USER_POOL_CLIENT_ID'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.warn('Missing required environment variables:', missing);
    return false;
  }
  
  return true;
}; 