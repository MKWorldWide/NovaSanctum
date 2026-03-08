const normalizeBoolean = (value: string | undefined, fallback: boolean): boolean => {
  if (value === undefined) return fallback;
  const lower = value.toLowerCase();
  return lower === '1' || lower === 'true' || lower === 'yes' || lower === 'on';
};

export type FeatureFlags = {
  adaptiveLearning: boolean;
  byoGeneration: boolean;
  optInTelemetry: boolean;
};

export function getFeatureFlags(): FeatureFlags {
  return {
    adaptiveLearning: normalizeBoolean(process.env.NS_ADAPTIVE_LEARNING, true),
    byoGeneration: normalizeBoolean(process.env.NS_BYO_GENERATION, true),
    optInTelemetry: normalizeBoolean(process.env.NS_OPT_IN_TELEMETRY, true),
  };
}

export function assertFeatureEnabled(enabled: boolean, message: string): void {
  if (!enabled) {
    throw new Error(message);
  }
}
