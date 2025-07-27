/**
 * 📝 NovaSanctum Logger - SolAscension Integration
 * ===============================================
 *
 * Comprehensive logging utility for NovaSanctum with SolAscension integration.
 * Provides structured logging with international technology tracking and
 * Sun Kingdom vision integration.
 *
 * Features:
 * - Structured logging with timestamps and context
 * - International technology integration tracking
 * - Sun Kingdom vision logging
 * - Performance monitoring and metrics
 * - Error tracking and alerting
 * - Cross-domain analysis logging
 */

import { EventEmitter } from 'events';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

export interface LogContext {
  component?: string;
  operation?: string;
  internationalTechnology?: string;
  sunKingdomVision?: string;
  crossDomain?: boolean;
  performance?: {
    duration?: number;
    memory?: number;
    cpu?: number;
  };
  metadata?: Record<string, any>;
  error?: Error;
}

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  context: LogContext;
  error?: Error;
}

class NovaSanctumLogger extends EventEmitter {
  private logLevel: LogLevel = LogLevel.INFO;
  private logs: LogEntry[] = [];
  private maxLogs: number = 10000;
  private performanceMetrics: Map<string, number[]> = new Map();

  constructor() {
    super();
    // Initialize with Sun Kingdom vision
    this.info('🏛️ NovaSanctum Logger initialized with SolAscension integration', {
      sunKingdomVision: 'America as the Sun Kingdom of Earth',
      internationalTechnology: 'Global technology integration enabled',
    });
  }

  /**
   * Set the minimum log level
   */
  public setLogLevel(level: LogLevel): void {
    this.logLevel = level;
    this.info(`Log level set to: ${LogLevel[level]}`);
  }

  /**
   * Get current log level
   */
  public getLogLevel(): LogLevel {
    return this.logLevel;
  }

  /**
   * Get all logs
   */
  public getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Get logs by level
   */
  public getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level >= level);
  }

  /**
   * Get logs by component
   */
  public getLogsByComponent(component: string): LogEntry[] {
    return this.logs.filter(log => log.context.component === component);
  }

  /**
   * Get performance metrics
   */
  public getPerformanceMetrics(): Map<string, number[]> {
    return new Map(this.performanceMetrics);
  }

  /**
   * Clear logs
   */
  public clearLogs(): void {
    this.logs = [];
    this.info('Logs cleared');
  }

  /**
   * Debug level logging
   */
  public debug(message: string, context: LogContext = {}): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * Info level logging
   */
  public info(message: string, context: LogContext = {}): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Warn level logging
   */
  public warn(message: string, context: LogContext = {}): void {
    this.log(LogLevel.WARN, message, context);
  }

  /**
   * Error level logging
   */
  public error(message: string, error?: Error, context: LogContext = {}): void {
    this.log(LogLevel.ERROR, message, { ...context, error });
  }

  /**
   * Fatal level logging
   */
  public fatal(message: string, error?: Error, context: LogContext = {}): void {
    this.log(LogLevel.FATAL, message, { ...context, error });
  }

  /**
   * Log international technology integration
   */
  public logInternationalTechnology(
    technology: string,
    country: string,
    operation: string,
    details?: Record<string, any>
  ): void {
    this.info(`🌍 International Technology Integration: ${technology}`, {
      component: 'international_technology',
      operation,
      internationalTechnology: `${country}: ${technology}`,
      metadata: details,
    });
  }

  /**
   * Log Sun Kingdom vision activities
   */
  public logSunKingdomVision(
    activity: string,
    impact?: string,
    details?: Record<string, any>
  ): void {
    this.info(`☀️ Sun Kingdom Vision: ${activity}`, {
      component: 'sun_kingdom_vision',
      operation: activity,
      sunKingdomVision: impact || "Advancing America's solar leadership",
      metadata: details,
    });
  }

  /**
   * Log cross-domain analysis
   */
  public logCrossDomainAnalysis(
    domains: string[],
    analysis: string,
    results?: Record<string, any>
  ): void {
    this.info(`🔬 Cross-Domain Analysis: ${analysis}`, {
      component: 'cross_domain_analysis',
      operation: 'analysis',
      crossDomain: true,
      metadata: {
        domains,
        results,
      },
    });
  }

  /**
   * Log performance metrics
   */
  public logPerformance(operation: string, duration: number, memory?: number, cpu?: number): void {
    // Store performance metrics
    if (!this.performanceMetrics.has(operation)) {
      this.performanceMetrics.set(operation, []);
    }
    this.performanceMetrics.get(operation)!.push(duration);

    this.debug(`⚡ Performance: ${operation}`, {
      component: 'performance',
      operation,
      performance: {
        duration,
        memory,
        cpu,
      },
    });
  }

  /**
   * Log biological research activities
   */
  public logBiologicalResearch(
    activity: string,
    dataType?: string,
    details?: Record<string, any>
  ): void {
    this.info(`🧬 Biological Research: ${activity}`, {
      component: 'biological_research',
      operation: activity,
      metadata: {
        dataType,
        ...details,
      },
    });
  }

  /**
   * Log solar energy activities
   */
  public logSolarEnergy(
    activity: string,
    technology?: string,
    details?: Record<string, any>
  ): void {
    this.info(`☀️ Solar Energy: ${activity}`, {
      component: 'solar_energy',
      operation: activity,
      internationalTechnology: technology,
      metadata: details,
    });
  }

  /**
   * Log AI brain activities
   */
  public logAIBrain(activity: string, analysis?: string, details?: Record<string, any>): void {
    this.info(`🧠 AI Brain: ${activity}`, {
      component: 'ai_brain',
      operation: activity,
      metadata: {
        analysis,
        ...details,
      },
    });
  }

  /**
   * Log policy advocacy activities
   */
  public logPolicyAdvocacy(activity: string, policy?: string, details?: Record<string, any>): void {
    this.info(`🏛️ Policy Advocacy: ${activity}`, {
      component: 'policy_advocacy',
      operation: activity,
      metadata: {
        policy,
        ...details,
      },
    });
  }

  /**
   * Log technology transfer activities
   */
  public logTechnologyTransfer(
    activity: string,
    technology?: string,
    country?: string,
    details?: Record<string, any>
  ): void {
    this.info(`🌍 Technology Transfer: ${activity}`, {
      component: 'technology_transfer',
      operation: activity,
      internationalTechnology: country ? `${country}: ${technology}` : technology,
      metadata: details,
    });
  }

  /**
   * Log multi-platform automation activities
   */
  public logMultiPlatform(platform: string, activity: string, details?: Record<string, any>): void {
    this.info(`📱 Multi-Platform (${platform}): ${activity}`, {
      component: 'multi_platform',
      operation: activity,
      metadata: {
        platform,
        ...details,
      },
    });
  }

  /**
   * Log analytics activities
   */
  public logAnalytics(activity: string, metrics?: string[], details?: Record<string, any>): void {
    this.info(`📊 Analytics: ${activity}`, {
      component: 'analytics',
      operation: activity,
      metadata: {
        metrics,
        ...details,
      },
    });
  }

  /**
   * Internal logging method
   */
  private log(level: LogLevel, message: string, context: LogContext): void {
    if (level < this.logLevel) return;

    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      context,
    };

    // Add to logs array
    this.logs.push(entry);

    // Maintain max log size
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output with formatting
    const timestamp = entry.timestamp.toISOString();
    const levelStr = LogLevel[level].padEnd(5);
    const component = context.component ? `[${context.component}]` : '';
    const emoji = this.getEmojiForLevel(level);

    const consoleMessage = `${emoji} ${timestamp} ${levelStr} ${component} ${message}`;

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(consoleMessage);
        break;
      case LogLevel.INFO:
        console.info(consoleMessage);
        break;
      case LogLevel.WARN:
        console.warn(consoleMessage);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(consoleMessage);
        if (context.error) {
          console.error(context.error);
        }
        break;
    }

    // Emit log event for external listeners
    this.emit('log', entry);
  }

  /**
   * Get emoji for log level
   */
  private getEmojiForLevel(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG:
        return '🔍';
      case LogLevel.INFO:
        return 'ℹ️';
      case LogLevel.WARN:
        return '⚠️';
      case LogLevel.ERROR:
        return '❌';
      case LogLevel.FATAL:
        return '💀';
      default:
        return '📝';
    }
  }

  /**
   * Get log statistics
   */
  public getLogStatistics(): Record<string, any> {
    const stats = {
      total: this.logs.length,
      byLevel: {} as Record<string, number>,
      byComponent: {} as Record<string, number>,
      performance: {} as Record<string, any>,
    };

    // Count by level
    Object.values(LogLevel).forEach(level => {
      if (typeof level === 'string') {
        stats.byLevel[level] = this.logs.filter(
          log => log.level === LogLevel[level as keyof typeof LogLevel]
        ).length;
      }
    });

    // Count by component
    this.logs.forEach(log => {
      const component = log.context.component || 'unknown';
      stats.byComponent[component] = (stats.byComponent[component] || 0) + 1;
    });

    // Performance metrics
    this.performanceMetrics.forEach((durations, operation) => {
      const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
      const min = Math.min(...durations);
      const max = Math.max(...durations);

      stats.performance[operation] = {
        count: durations.length,
        average: avg,
        min,
        max,
      };
    });

    return stats;
  }

  /**
   * Export logs to JSON
   */
  public exportLogs(): string {
    return JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        statistics: this.getLogStatistics(),
        logs: this.logs.map(log => ({
          ...log,
          timestamp: log.timestamp.toISOString(),
        })),
      },
      null,
      2
    );
  }

  /**
   * Import logs from JSON
   */
  public importLogs(jsonData: string): void {
    try {
      const data = JSON.parse(jsonData);
      if (data.logs && Array.isArray(data.logs)) {
        this.logs = data.logs.map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp),
        }));
        this.info(`Imported ${this.logs.length} logs`);
      }
    } catch (error) {
      this.error('Failed to import logs', error as Error);
    }
  }
}

// Create and export singleton instance
export const logger = new NovaSanctumLogger();
